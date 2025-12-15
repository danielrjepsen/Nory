'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService, UpdateProfileRequest, ChangePasswordRequest } from '../../_services/settings';
import { authService } from '../../_services/auth';
import type { User } from '../../_types/auth';

interface UseSettingsReturn {
  user: User | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  clearMessages: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await settingsService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      // Fall back to local user
      const localUser = authService.getUser();
      if (localUser) {
        setUser(localUser);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    try {
      setSaving(true);
      clearMessages();

      const updatedUser = await settingsService.updateProfile(data);
      setUser(updatedUser);
      setSuccess('settings.profileUpdated');
      return true;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      const errorMessage = err?.response?.data?.error || err?.message || 'settings.profileUpdateFailed';
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [clearMessages]);

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setSaving(true);
      clearMessages();

      await settingsService.changePassword(data);
      setSuccess('settings.passwordChanged');
      return true;
    } catch (err: any) {
      console.error('Failed to change password:', err);
      const errorMessage = err?.response?.data?.error || err?.message || 'settings.passwordChangeFailed';
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [clearMessages]);

  return {
    user,
    loading,
    saving,
    error,
    success,
    updateProfile,
    changePassword,
    clearMessages,
  };
}
