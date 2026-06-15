import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { LoginResponse, LoginCredentials, AuthState } from "../types/auth";
import { setStoredTokens, clearStoredTokens } from "./axios";
import { loginRequest, logoutRequest } from "./xhr";


export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginAdmin", async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginRequest(credentials);
    setStoredTokens(data.access, data.refresh);
    return data;
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
>("auth/logoutAdmin", async (_, { getState }) => {
  const { refreshToken } = getState().auth;
  try {
    await logoutRequest(refreshToken ?? undefined);
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
  } finally {
    clearStoredTokens();
  }
});
