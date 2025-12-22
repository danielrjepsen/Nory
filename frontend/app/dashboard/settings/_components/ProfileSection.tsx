'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsCard } from './SettingsCard';
import { Input } from '../../_components/form/Input';
import { Button } from '../../_components/Button';
import type { User } from '../../_types/auth';

interface ProfileSectionProps {
  user: User | null;
  saving: boolean;
  onSave: (data: { name?: string }) => Promise<boolean>;
}

export function ProfileSection({ user, saving, onSave }: ProfileSectionProps) {
  const { t } = useTranslation('dashboard');
  const [name, setName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    setHasChanges(name !== (user?.name || ''));
  }, [name, user?.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    const success = await onSave({ name });
    if (success) {
      setHasChanges(false);
    }
  };

  const icon = (
    <svg className="w-5 h-5 text-nory-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <SettingsCard
      icon={icon}
      title={t('settings.profile.title')}
      description={t('settings.profile.subtitle')}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('settings.profile.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Input
            label={t('settings.profile.email')}
            value={user?.email || ''}
            disabled
            fullWidth
            hint={t('settings.profile.emailHint')}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={!hasChanges || saving}
          >
            {t('settings.profile.save')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}
