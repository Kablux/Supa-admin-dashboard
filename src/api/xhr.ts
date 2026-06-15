import api from './axios';
import { LoginCredentials, LoginResponse, AdminUser } from '../types/auth';

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    '/business-admin/auth/login/',
    credentials
  );
  return data;
}

export async function logoutRequest(refresh?: string): Promise<void> {
  await api.post('/auth/logout/', refresh ? { refresh } : {});
}

export async function fetchAdminProfile(id: string | number): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/business-admin/users/${id}/`);
  return data;
}
