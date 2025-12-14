'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Toggle from '@/app/dashboard/_components/form/Toggle';

interface SettingsStepProps {
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
}

export function SettingsStep({ isPublic, onPublicChange }: SettingsStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('eventCreation.settings.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('eventCreation.settings.subtitle')}
          </p>
        </div>

        <Toggle
          label={t('eventCreation.settings.publicEvent')}
          description={t('eventCreation.settings.publicEventDescription')}
          checked={isPublic}
          onChange={onPublicChange}
        />
      </div>
    </div>
  );
}
