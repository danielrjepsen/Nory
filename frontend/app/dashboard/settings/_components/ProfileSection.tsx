'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Text } from '../../_components/ui/Typography';
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div>
          <Heading as="h3" className="mb-0">
            {t('settings.profile.title')}
          </Heading>
          <Text variant="muted" className="mt-0">
            {t('settings.profile.subtitle')}
          </Text>
        </div>
      </div>

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
    </div>
  );
}
