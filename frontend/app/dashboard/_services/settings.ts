import { apiClient } from '@/lib/api';
import { setUser } from './auth';
import type { User } from '../_types/auth';

const Endpoints = {
  me: '/api/v1/auth/me',
  changePassword: '/api/v1/auth/change-password',
} as const;

export interface UpdateProfileRequest {
  name?: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  const user = await apiClient.put<User>(Endpoints.me, data);
  setUser(user);
  return user;
}

export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(Endpoints.changePassword, data);
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>(Endpoints.me);
}
