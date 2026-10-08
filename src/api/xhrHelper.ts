import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  LoginResponse,
  LoginCredentials,
  AuthState,
  RiderQueryParams,
  DriverQueryParams,
  TripQueryParams,
} from "../types/auth";
import {
  setStoredTokens,
  clearStoredTokens,
  getStoredRefreshToken,
} from "./axios";
import {
  courierService,
  createAdminRole,
  createBanner,
  deleteAdminRole,
  deleteBannerById,
  fetchBanners,
  getAdminRoles,
  getCorporateData,
  getDriverList,
  getDriverSummary,
  getFleetData,
  getLiveTripsSummary,
  getReferralDetails,
  getReferrals,
  getReferralsSummary,
  getRideRequestDetails,
  getRideRequests,
  getRideRequestsSummary,
  getRiders,
  getRiderSummary,
  getTransactionAnalytics,
  getTrips,
  getUserList,
  getUserSummary,
  loginRequest,
  logoutRequest,
  updateAdminRole,
  updateBanner,
  uploadFiles,
} from "./xhr";
import { AdminRole, Banner, BannerPayload, BannersState, CourierReferral, CourierRider, CourierUser, FetchReferralsParams, FetchRidersParams, FetchUsersParams, PaginatedReferralResponse, Referral, ReferralQueryParams, RideRequestQueryParams, UploadFile } from "../types/common.types";
import { setCorporateData, setLoading } from "../redux/slices/corporate";
import { AppDispatch } from "../redux/store";
import { setFleetData } from "../redux/slices/Fleet";

export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginAdmin", async (credentials, { rejectWithValue }) => {
  try {
    const responsePayload = await loginRequest(credentials);

    const accessToken = responsePayload.data.access;
    const refreshToken = responsePayload.data.refresh;

    setStoredTokens(accessToken, refreshToken);
    return responsePayload;
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState } }
>("auth/logoutAdmin", async (_, { getState, rejectWithValue }) => {
  // Read from Redux state. If it's missing or null, pull directly from localStorage
  const refreshToken = getState().auth.refreshToken || getStoredRefreshToken();

  try {
    if (refreshToken) {
      await logoutRequest(refreshToken);
    } else {
      console.warn("Logout initiated, but no refresh token was found locally.");
    }
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Session clearance encountered an issue.";
    console.error("Server logout error:", message);
  } finally {
    clearStoredTokens();
  }
});

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const [
        users,
        drivers,
        liveTripsSummary,
        userSummary,
        driverSummary,
        riderSummary,
        referralsSummary,
        requestSummary
      ] = await Promise.all([
        getUserList(),
        getDriverList(),
        getLiveTripsSummary(),
        getUserSummary(),
        getDriverSummary(),
        getRiderSummary(),
        getReferralsSummary(),
        getRideRequestsSummary(),
      ]);

      return {
        totalUsers: users.count,
        totalDrivers: drivers.count,
        userSummary,
        driverSummary,
        riderSummary,
        referralsSummary,
        // liveTrips: liveTripsSummary.total,
        liveTripsSummary,
        requestSummary,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load dashboard stats";
      return rejectWithValue(message);
    }
  },
);

export const fetchRiders = createAsyncThunk(
  "riders/fetchRiders",
  async (params: RiderQueryParams, { rejectWithValue }) => {
    try {
      return await getRiders(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load riders",
      );
    }
  },
);

export const fetchDrivers = createAsyncThunk(
  "riders/fetchDrivers",
  async (params: DriverQueryParams, { rejectWithValue }) => {
    try {
      return await getDriverList(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load drivers",
      );
    }
  },
);

export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (params: TripQueryParams, { rejectWithValue }) => {
    try {
      return await getTrips(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load trips",
      );
    }
  },
);

///Fetch Ride Request
export const fetchRideRequests = createAsyncThunk(
  "rideRequests/fetchRideRequests",

  async (
    params: RideRequestQueryParams,
    { rejectWithValue },
  ) => {
    try {
      return await getRideRequests(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Failed to fetch ride requests",
      );
    }
  },
);

export const fetchRideRequestDetails =
  createAsyncThunk(
    "rideRequests/fetchDetails",

    async (
      id: string,
      { rejectWithValue },
    ) => {
      try {
        return await getRideRequestDetails(id);
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ??
            "Failed to fetch ride request",
        );
      }
    },
  );

// export const fetchRideRequestsSummary = createAsyncThunk(
//   "rideRequests/fetchSummary",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await getRideRequestsSummary();
//       return data.data; // Return just the inner "data" object for easier state management
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch ride requests summary"
//       );
//     }
//   }
// );

export const fetchTransactionAnalytics = createAsyncThunk(
  "dashboard/fetchTransactionAnalytics",
  async (range: "week" | "month" | "year" = "month", { rejectWithValue }) => {
    try {
      return await getTransactionAnalytics(range);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load analytics",
      );
    }
  },
);

/////Admin Roles Thunks
export const fetchAdminRoles = createAsyncThunk(
  "adminRole/fetchAdminRoles",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminRoles();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch admin roles");
    }
  },
);

export const createAdminRoleThunk = createAsyncThunk(
  "adminRole/create",
  async (payload: AdminRole, { rejectWithValue }) => {
    try {
      return await createAdminRole(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create admin role");
    }
  },
);

export const updateAdminRoleThunk = createAsyncThunk(
  "adminRole/updateAdminRole",
  async (payload: AdminRole, { rejectWithValue }) => {
    try {
      const response = await updateAdminRole(payload);

      toast.success("Admin role updated successfully");

      return response;
    } catch (error: any) {
      toast.error("Unable to update admin role");

      return rejectWithValue(error.message || "Failed to update admin role");
    }
  },
);

export const deleteAdminRoleThunk = createAsyncThunk(
  "adminRole/deleteAdminRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAdminRole(id);

      toast.success("Admin role deleted successfully");

      return id;
    } catch (error: any) {
      toast.error("Unable to delete admin role");

      return rejectWithValue(error.message || "Failed to delete admin role");
    }
  },
);

////CORPORATE THUNKS

export const fetchCorporateData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await getCorporateData();

    dispatch(setCorporateData(response));
  } catch (error) {
    console.error("Failed to fetch corporate data", error);
  } finally {
    dispatch(setLoading(false));
  }
};

///FLEET THUNKS
export const fetchFleetData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getFleetData();
    dispatch(setFleetData(response));
  } catch (error) {
    console.error("Failed to fetch fleet data:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

////Referrals
export const fetchReferrals = createAsyncThunk<
  PaginatedReferralResponse,
  ReferralQueryParams | undefined,
  { rejectValue: string }
>(
  "referrals/fetchReferrals",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getReferrals(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referrals list."
      );
    }
  }
);


export const fetchReferralDetails = createAsyncThunk<
  Referral,
  string, // Referral ID
  { rejectValue: string }
>(
  "referrals/fetchReferralDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getReferralDetails(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referral details."
      );
    }
  }
);


///Banner Thunks

export const uploadBannerImages = createAsyncThunk<
  UploadFile[],
  File[],
  { rejectValue: string }
>(
  'banners/uploadBannerImages',
  async (files, { rejectWithValue }) => {
    try {
      const response = await uploadFiles(files);

      return response.results;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
        'Failed to upload banner image.',
      );
    }
  },
);

export const loadBanners = createAsyncThunk<
  { list: Banner[]; count: number },
  void,
  { state: { banners: BannersState }; rejectValue: string }
>('banners/loadBanners', async (_, { getState, rejectWithValue }) => {
  const { currentPage, pageSize, search, audienceFilter, activeFilter } =
    getState().banners;
  try {
    const data = await fetchBanners({
      page:      currentPage,
      page_size: pageSize,
      search:    search || undefined,
      audience:  audienceFilter || undefined,
      is_active: activeFilter === '' ? undefined : activeFilter,
    });
    return { list: data.results, count: data.count };
  } catch (err:any) {
    return rejectWithValue( err.response?.data?.message || "Failed to fetch banner.");
  }
});

export const addBanner = createAsyncThunk<
  Banner,
  BannerPayload,
  { rejectValue: string }
>('banners/addBanner', async (payload, { rejectWithValue }) => {
  try {
    return await createBanner(payload);
  } catch (err:any) {
    return rejectWithValue( err.response?.data?.message || "Failed to create banner.");
  }
});

export const editBanner = createAsyncThunk<
  Banner,
  { id: string; payload: Partial<BannerPayload> },
  { rejectValue: string }
>('banners/editBanner', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateBanner(id, payload);
  } catch (err:any) {
    return rejectWithValue( err.response?.data?.message|| "Failed to update banner.");
  }
});


export const removeBanner = createAsyncThunk<
  string,  
  string,
  { rejectValue: string }
>('banners/removeBanner', async (id, { rejectWithValue }) => {
  try {
    await deleteBannerById(id);
    return id;
  } catch (err:any) {
    return rejectWithValue( err.response?.data?.message || "Failed to delete banner.");
  }
});


////Courier Thunks
// Async Thunks
export const fetchCourierRiders = createAsyncThunk(
  'courier/fetchRiders',
  async (params: FetchRidersParams, { rejectWithValue }) => {
    try {
      const res = await courierService.fetchRiders(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch riders');
    }
  }
);

export const approveCourierRiderKyc = createAsyncThunk(
  'courier/approveRiderKyc',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await courierService.approveRiderKyc(userId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve KYC');
    }
  }
);

export const fetchCourierUsers = createAsyncThunk(
  'courier/fetchUsers',
  async (params: FetchUsersParams, { rejectWithValue }) => {
    try {
      const res = await courierService.fetchUsers(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const fetchCourierReferrals = createAsyncThunk(
  'courier/fetchReferrals',
  async (params: FetchReferralsParams, { rejectWithValue }) => {
    try {
      const res = await courierService.fetchReferrals(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch referrals');
    }
  }
);

// ── Toggle active (optimistic PATCH) ─────────────────────────────────────────

export const toggleBannerActive = createAsyncThunk<
  Banner,
  { id: string; is_active: boolean },
  { rejectValue: string }
>('banners/toggleActive', async ({ id, is_active }, { rejectWithValue }) => {
  try {
    return await updateBanner(id, { is_active });
  } catch (err:any) {
    return rejectWithValue( err.message || "Failed to toggle banner active status.");
  }
});