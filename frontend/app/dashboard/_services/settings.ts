import { apiClient } from '@/lib/api';
import { authService } from './auth';
import type { User } from '../_types/auth';

export interface UpdateProfileRequest {
  name?: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

class SettingsService {
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const user = await apiClient.put<User>('/api/v1/auth/me', data);
    // Update local user state
    authService.setUser(user);
    return user;
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>('/api/v1/auth/change-password', data);
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/api/v1/auth/me');
  }
}

export const settingsService = new SettingsService();
