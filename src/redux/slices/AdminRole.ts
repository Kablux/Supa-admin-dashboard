import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAdminRoles, createAdminRoleThunk, deleteAdminRoleThunk } from "../../api/xhrHelper";
import { AdminRoleState, AdminRole, AdminRoleSummary } from "../../types/common.types";

const initialState: AdminRoleState = {
  roles: [],
  summary: [],
  isLoading: false,
  error: null,
};

const buildSummary = (
  roles: AdminRole[],
): AdminRoleSummary[] => {
  const roleMap: Record<string, number> = {};

  roles.forEach((role) => {
    roleMap[role.role] = (roleMap[role.role] || 0) + 1;
  });

  return Object.entries(roleMap).map(([role, count]) => ({
    role,
    count,
  }));
};

const adminRoleSlice = createSlice({
  name: "adminRole",
  initialState,
  reducers: {
    clearAdminRoleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH ROLES
      .addCase(fetchAdminRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload;
        state.summary = buildSummary(action.payload);
      })
      .addCase(fetchAdminRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Failed to load admin roles";
      })

      // CREATE ROLE
      .addCase(createAdminRoleThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAdminRoleThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.roles.unshift(action.payload);

        state.summary = buildSummary(state.roles);
      })
      .addCase(createAdminRoleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Failed to create admin role";
      })

      // DELETE ROLE
      .addCase(deleteAdminRoleThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAdminRoleThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.roles = state.roles.filter(
          (role) => role.id !== action.payload,
        );

        state.summary = buildSummary(state.roles);
      })
      .addCase(deleteAdminRoleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Failed to delete admin role";
      });
  },
});

export const { clearAdminRoleError } =
  adminRoleSlice.actions;

export default adminRoleSlice.reducer;