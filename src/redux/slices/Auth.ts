import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getStoredAccessToken, getStoredRefreshToken } from "../../api/axios";
import { AuthState, LoginResponse, AdminUser } from "../../types/auth";
import { loginAdmin, logoutAdmin } from "../../api/xhrHelper";

const initialState: AuthState = {
  user: null,
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  status: "idle",
  error: null,
  isAuthenticated: Boolean(getStoredAccessToken()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AdminUser>) {
      state.user = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.accessToken = action.payload.data.access;
          state.refreshToken = action.payload.data.refresh;
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed. Please try again.";
        state.isAuthenticated = false;
      })
      // ── Logout ──
      .addCase(logoutAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

