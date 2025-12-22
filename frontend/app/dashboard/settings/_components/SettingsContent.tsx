'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../_hooks/useSettings';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';
import { EmailSection } from './EmailSection';
import { BackupSection } from './BackupSection';
import { Alert } from '../../_components/Alert';

export function SettingsContent() {
  const { t } = useTranslation('dashboard');
  const {
    user,
    loading,
    saving,
    error,
    success,
    updateProfile,
    changePassword,
    clearMessages,
  } = useSettings();

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[700px]">
        <div className="h-8 w-48 bg-nory-bg rounded animate-pulse" />
        <div className="h-4 w-64 bg-nory-bg rounded animate-pulse" />
        <div className="bg-nory-card rounded-card p-6 space-y-4">
          <div className="h-6 w-40 bg-nory-bg rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-nory-bg rounded animate-pulse" />
            <div className="h-12 bg-nory-bg rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-nory-card rounded-card p-6 space-y-4">
          <div className="h-6 w-40 bg-nory-bg rounded animate-pulse" />
          <div className="h-12 bg-nory-bg rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-nory-bg rounded animate-pulse" />
            <div className="h-12 bg-nory-bg rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert variant="success" onDismiss={clearMessages}>
          {t(success)}
        </Alert>
      )}

      {error && (
        <Alert variant="error" onDismiss={clearMessages}>
          {error.startsWith('settings.') ? t(error) : error}
        </Alert>
      )}

      <div className="space-y-6 max-w-[700px]">
        <ProfileSection
          user={user}
          saving={saving}
          onSave={updateProfile}
        />

        <PasswordSection
          saving={saving}
          onSave={changePassword}
        />

        <EmailSection />

        <BackupSection />
      </div>
    </div>
  );
}
