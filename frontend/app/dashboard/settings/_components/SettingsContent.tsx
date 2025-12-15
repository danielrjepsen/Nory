'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../_hooks/useSettings';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';
import { ContentHeader } from '../../_components/ContentHeader';
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

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ContentHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      />

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

      <div className="space-y-6 max-w-3xl">
        <ProfileSection
          user={user}
          saving={saving}
          onSave={updateProfile}
        />

        <PasswordSection
          saving={saving}
          onSave={changePassword}
        />
      </div>
    </div>
  );
}
