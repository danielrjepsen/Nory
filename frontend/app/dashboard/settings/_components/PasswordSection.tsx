'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsCard } from './SettingsCard';
import { Input } from '../../_components/form/Input';
import { Button } from '../../_components/Button';

interface PasswordSectionProps {
  saving: boolean;
  onSave: (data: { currentPassword: string; newPassword: string }) => Promise<boolean>;
}

export function PasswordSection({ saving, onSave }: PasswordSectionProps) {
  const { t } = useTranslation('dashboard');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const canSubmit = currentPassword && newPassword && confirmPassword && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (newPassword !== confirmPassword) {
      setValidationError(t('settings.password.mismatch'));
      return;
    }

    if (newPassword.length < 8) {
      setValidationError(t('settings.password.tooShort'));
      return;
    }

    const success = await onSave({ currentPassword, newPassword });
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const icon = (
    <svg className="w-5 h-5 text-nory-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <SettingsCard
      icon={icon}
      title={t('settings.password.title')}
      description={t('settings.password.subtitle')}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label={t('settings.password.current')}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('settings.password.new')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={validationError && newPassword ? validationError : undefined}
              fullWidth
            />
            <Input
              label={t('settings.password.confirm')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={validationError && confirmPassword !== newPassword ? t('settings.password.mismatch') : undefined}
              fullWidth
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={!canSubmit}
          >
            {t('settings.password.update')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}
