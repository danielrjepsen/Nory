'use client';

import { useState, useEffect, useCallback } from 'react';
import { updateProfile, changePassword, getCurrentUser, type UpdateProfileRequest, type ChangePasswordRequest } from '../../_services/settings';
import { getUser } from '../../_services/auth';
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
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      const localUser = getUser();
      if (localUser) setUser(localUser);
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

  const handleUpdateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    try {
      setSaving(true);
      clearMessages();
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setSuccess('settings.profileUpdated');
      return true;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err?.response?.data?.error || err?.message || 'settings.profileUpdateFailed');
      return false;
    } finally {
      setSaving(false);
    }
  }, [clearMessages]);

  const handleChangePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setSaving(true);
      clearMessages();
      await changePassword(data);
      setSuccess('settings.passwordChanged');
      return true;
    } catch (err: any) {
      console.error('Failed to change password:', err);
      setError(err?.response?.data?.error || err?.message || 'settings.passwordChangeFailed');
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
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    clearMessages,
  };
}
