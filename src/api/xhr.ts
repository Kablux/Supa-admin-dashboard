import api from "./axios";
import {
  LoginCredentials,
  LoginResponse,
  AdminUser,
  PaginatedUsers,
  PaginatedRides,
  RiderQueryParams,
  PaginatedResponse,
  Rider,
  DriverQueryParams,
  Driver,
  TripQueryParams,
  PaginatedTripsResponse,
  Ride,
} from "../types/auth";
import { cleanQueryParams } from "../utils/hook";
import {
  ActionDriverPayload,
  AdminRole,
  CorporateInfo,
  CorporateOwner,
  CorporateStat,
  DriverSummaryData,
  PaginatedRideRequests,
  RideRequestDetail,
  RideRequestQueryParams,
  RideRequestSummaryResponse,
  TransactionAnalytics,
} from "../types/common.types";

export interface SummaryResponse {
  data: {
    total: number;
    active: number;
    suspended: number;
  };
}

export interface DriverSummaryResponse {
  data: DriverSummaryData;
}

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/business-admin/auth/login/",
    credentials,
  );
  return data;
}

export async function logoutRequest(refresh: string): Promise<void> {
  await api.post("/auth/logout/", { refresh });
}
export async function getTransactionAnalytics(
  range: "week" | "month" | "year" = "month",
): Promise<TransactionAnalytics> {
  const { data } = await api.get("/business-admin/transactions/analytics/", {
    params: { range },
  });

  return data;
}

export async function getUserList(): Promise<PaginatedUsers> {
  const { data } = await api.get<PaginatedUsers>(
    "/business-admin/users/?page=1",
  );
  return data;
}

export async function getDriverList(
  params?: DriverQueryParams,
): Promise<PaginatedResponse<Driver>> {
  const { data } = await api.get<PaginatedResponse<Driver>>(
    "/business-admin/drivers/",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );

  return data;
}

export async function getRiders(
  params: RiderQueryParams,
): Promise<PaginatedResponse<Rider>> {
  const { data } = await api.get<PaginatedResponse<Rider>>(
    "/business-admin/riders/",
    {
      params: cleanQueryParams(params),
    },
  );
  return data;
}
// getDriverList();

export async function getUserSummary() {
  const { data } = await api.get<SummaryResponse>(
    "/business-admin/users/summary/",
  );
  return data.data;
}

export async function getDriverSummary() {
  const { data } = await api.get<DriverSummaryResponse>(
    "/business-admin/drivers/summary/",
  );
  return data.data;
}

export const approveDriverKyc = async (
  driverId: string,
  payload: ActionDriverPayload,
) => {
  const response = await api.post(
    `/business-admin/drivers/${driverId}/approve_kyc/`,
    payload,
  );
  return response.data;
};

export const suspendDriver = async (
  driverId: string,
  payload: ActionDriverPayload,
) => {
  const response = await api.post(
    `/business-admin/drivers/${driverId}/suspend/`,
    payload,
  );
  return response.data;
};

export async function getRiderSummary() {
  const { data } = await api.get<SummaryResponse>(
    "/business-admin/riders/summary/",
  );
  return data.data;
}

///LIVE TRIPS
export async function getRides(page = 1): Promise<PaginatedRides> {
  const { data } = await api.get<PaginatedRides>(
    `/business-admin/rides/?page=${page}`,
  );

  return data;
}

export async function getTrips(
  params: TripQueryParams,
): Promise<PaginatedTripsResponse> {
  const { data } = await api.get("/business-admin/rides", {
    params: cleanQueryParams(params),
  });

  return data;
}

export async function getTripById(tripId: string): Promise<Ride> {
  const { data } = await api.get(`/business-admin/rides/${tripId}/`);
  return data;
}

export async function getLiveTripsSummary() {
  const { data } = await api.get("/business-admin/rides/summary/");

  return data.data;
}

export const fetchRiderDetails = async (id: string): Promise<Rider> => {
  const { data } = await api.get<Rider>(`/business-admin/riders/${id}/`);
  return data;
};

export const fetchDriverDetails = async (id: string): Promise<Driver> => {
  const { data } = await api.get<Driver>(`/business-admin/drivers/${id}/`);
  return data;
};

export async function fetchAdminProfile(
  id: string | number,
): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/business-admin/users/${id}/`);
  return data;
}

///RIDE REQUEST
export async function getRideRequestsSummary() {
  const { data } = await api.get<RideRequestSummaryResponse>(
    "/business-admin/ride-requests/summary/",
  );
  return data.data;
}

export async function getRideRequests(
  params: RideRequestQueryParams,
): Promise<PaginatedRideRequests> {
  const { data } = await api.get(
    "/business-admin/ride-requests/",
    {
      params: cleanQueryParams(params),
    },
  );

  return data;
  }
  
  
  export async function getRideRequestDetails(
  id: string,
): Promise<RideRequestDetail> {
  const { data } = await api.get(
    `/business-admin/ride-requests/${id}/`,
  );

  return data;
}
  

////ADMIN ROLES

const ADMIN_ROLE_STORAGE_KEY = "admin_roles";

/////default roles to initialize local storage if not present
const defaultRoles: AdminRole[] = [
  {
    id: "1",
    full_name: "David Demo",
    email: "david@test.com",
    role: "Corporate Manager",
    created_at: "2026-05-04",
    permission: false,
    avatar: null,
  },
  {
    id: "2",
    full_name: "John Smith",
    email: "john@test.com",
    role: "Fleet Manager",
    created_at: "2026-05-04",
    permission: true,
    avatar:
      "https://unsplash.com/photos/man-in-black-button-up-shirt-ZHvM3XIOHoE",
  },
  {
    id: "3",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Engineering Officer",
    permission: true,
    created_at: "2026-05-04",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
];

const initializeRoles = () => {
  const existing = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, JSON.stringify(defaultRoles));
  }
};

const getStoredRoles = (): AdminRole[] => {
  initializeRoles();

  return JSON.parse(localStorage.getItem(ADMIN_ROLE_STORAGE_KEY) || "[]");
};

const saveRoles = (roles: AdminRole[]) => {
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, JSON.stringify(roles));
};

///// fetch, create, update, and delete admin roles
export async function getAdminRoles(): Promise<AdminRole[]> {
  return getStoredRoles();
}

export async function createAdminRole(payload: AdminRole): Promise<AdminRole> {
  const roles = getStoredRoles();

  roles.unshift(payload);

  saveRoles(roles);

  return payload;
}

////UPDATE AND DELETE
export async function updateAdminRole(payload: AdminRole): Promise<AdminRole> {
  const roles = getStoredRoles();

  const updated = roles.map((role) =>
    role.id === payload.id ? payload : role,
  );

  saveRoles(updated);

  return payload;
}

export async function deleteAdminRole(id: string): Promise<string> {
  const roles = getStoredRoles();

  const updated = roles.filter((role) => role.id !== id);

  saveRoles(updated);

  return id;
}

///corporate
const corporateData = {
  stats: [
    {
      id: "1",
      label: "Total Accounts",
      value: 45,
      icon: "BusinessCenter",
      color: "#32D583",
      bg: "#12361F",
    },
    {
      id: "2",
      label: "Active Companies",
      value: 45,
      icon: "Groups",
      color: "#8B5CF6",
      bg: "#241A38",
    },
    {
      id: "3",
      label: "Total Revenue",
      value: 45,
      icon: "Payments",
      color: "#EF4444",
      bg: "#3A1111",
    },
    {
      id: "4",
      label: "Corporate Rides",
      value: 45,
      icon: "DirectionsCar",
      color: "#FACC15",
      bg: "#433306",
    },
  ] as CorporateStat[],

  companyInfo: {
    companyName: "Vik Kreative",
    contactPerson: "Mr. Victor",
    staff: 20,
    accountBalance: 150000,
    uniqueCode: "137087KJA",
    year: 2025,
  } as CorporateInfo,

  owners: [
    {
      id: "1",
      name: "David Demo",
      avatar: null,
      date: "2026-05-04",
      carName: "Camry 2026",
      carQty: 1,
      amount: 500000,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: null,
      date: "2026-05-04",
      carName: "Ferarri",
      carQty: 3,
      amount: 850000,
    },
    {
      id: "3",
      name: "Michael Adams",
      avatar: null,
      date: "2026-05-04",
      carName: "Hummer Jeep",
      carQty: 2,
      amount: 450000,
    },
  ] as CorporateOwner[],
};

export async function getCorporateData() {
  return new Promise<typeof corporateData>((resolve) => {
    setTimeout(() => {
      resolve(corporateData);
    }, 500);
  });
}

///Fleet
export async function getFleetData() {
  return {
    stats: [
      {
        id: "1",
        label: "Account",
        value: 45,
        icon: "AccountBalanceWallet",
        color: "#4CAF50",
        bg: "#12301D",
      },
      {
        id: "2",
        label: "Fleet Pool",
        value: 45,
        icon: "DirectionsCar",
        color: "#8E44AD",
        bg: "#2B1E38",
      },
      {
        id: "3",
        label: "Income Generated",
        value: 45,
        icon: "Payments",
        color: "#D32F2F",
        bg: "#3D1313",
      },
      {
        id: "4",
        label: "Active Vehicle",
        value: 45,
        icon: "LocalTaxi",
        color: "#FBC02D",
        bg: "#403100",
      },
    ],

    vehicles: [
      {
        id: "1",
        name: "SUV 2025",
        model: "2025",
        amount: 500000,
        year: 2025,
        insuranceYear: 2029,
        plateNumber: "137087KJA",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        inspectionReminder:
          "Reminder 4 months before next inspection and paper registration",
      },

      {
        id: "2",
        name: "Toyota Highlander",
        model: "2024",
        amount: 450000,
        year: 2024,
        insuranceYear: 2028,
        plateNumber: "LAG204RT",
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
      },

      {
        id: "3",
        name: "Volkswagen Tiguan",
        model: "2023",
        amount: 420000,
        year: 2023,
        insuranceYear: 2027,
        plateNumber: "ABJ908KL",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
      },

      {
        id: "4",
        name: "Ford Escape",
        model: "2025",
        amount: 520000,
        year: 2025,
        insuranceYear: 2030,
        plateNumber: "FLEET901",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      },
    ],

    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
    ],

    reminders: [
      {
        id: "1",
        avatar: null,
        title: "Maintenance reminders",
        subtitle: "Toyota corolla 2025",
        time: "Today",
      },
      {
        id: "2",
        avatar: null,
        title: "Maintenance reminders",
        subtitle: "Toyota corolla 2025",
        time: "Today",
      },
      {
        id: "3",
        avatar: null,
        title: "Maintenance reminders",
        subtitle: "Toyota corolla 2025",
        time: "Today",
      },
    ],

    pairings: [
      {
        id: "1",
        avatar: null,
        title: "Assign drivers",
        subtitle: "Toyota corolla 2025",
        // time: "Today",
      },
      {
        id: "2",
        avatar: null,
        title: "Assign drivers",
        subtitle: "Toyota corolla 2025",
        // time: "Today",
      },
      {
        id: "3",
        avatar: null,
        title: "Assign drivers",
        subtitle: "Toyota corolla 2025",
        // time: "Today",
      },
    ],

    status: {
      active: 20,
      offline: 10,
      blocked: 3,
    },

    owners: [
      {
        id: "1",
        name: "David Demo",
        avatar: null,
        date: "2026-05-04",
        car: "Ferrari",
        quantity: 1,
        earning: 30000,
      },
      {
        id: "2",
        name: "David Demo",
        avatar: null,
        date: "2026-05-04",
        car: "Ferrari",
        quantity: 1,
        earning: 30000,
      },
      {
        id: "3",
        name: "David Demo",
        avatar: null,
        date: "2026-05-04",
        car: "Ferrari",
        quantity: 1,
        earning: 30000,
      },
    ],
  };
}

export const getDriverLocations = async () => {
  const response = await api.get("/dashboard/driver-locations");
  return response.data.map((item: any) => ({
    lat: item.latitude ?? item.lat,
    lng: item.longitude ?? item.lng ?? item.long,
    weight: item.weight,
  }));
};
