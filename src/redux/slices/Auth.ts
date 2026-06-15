import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getStoredAccessToken, getStoredRefreshToken } from '../../api/axios';
import { AuthState, LoginResponse, AdminUser } from '../../types/auth';
import { loginAdmin, logoutAdmin } from '../../api/xhrHelper';


const initialState: AuthState = {
  user: null,
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  status: 'idle',
  error: null,
  isAuthenticated: Boolean(getStoredAccessToken()),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Manually set the current user, e.g. after fetching their profile. */
    setUser(state, action: PayloadAction<AdminUser>) {
      state.user = action.payload;
    },
    /** Clear any auth error (e.g. when the user edits the form again). */
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh ?? state.refreshToken;
        state.user = action.payload.user ?? state.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed. Please try again.';
        state.isAuthenticated = false;
      })
      // ── Logout ──
      .addCase(logoutAdmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        // Force-clear session locally regardless of server response.
        state.status = 'idle';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";
// import { loginThunk } from "../../api/xhrHelper";
// import { AuthState } from "../../types/auth";

// const initialState: AuthState = {
//   user: null,
//   token: localStorage.getItem("accessToken"),
//   loading: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.token = null;

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(loginThunk.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(loginThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.access;
//       })

//       .addCase(loginThunk.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const { logout } = authSlice.actions;

// export default authSlice.reducer;
