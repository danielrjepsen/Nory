'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Text } from '../../_components/ui/Typography';
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <div>
          <Heading as="h3" className="mb-0">
            {t('settings.password.title')}
          </Heading>
          <Text variant="muted" className="mt-0">
            {t('settings.password.subtitle')}
          </Text>
        </div>
      </div>

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
    </div>
  );
}
