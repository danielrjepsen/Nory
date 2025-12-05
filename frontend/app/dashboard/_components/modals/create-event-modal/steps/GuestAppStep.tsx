'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import GuestAppBuilder from '@/app/dashboard/_components/appbuilder/GuestAppBuilder';

interface GuestAppStepProps {
  guestApp: {
    config: any;
    components: any[];
  };
  eventName: string;
  selectedTheme: string;
  onChange: (guestApp: { config: any; components: any[] }) => void;
}

export function GuestAppStep({
  guestApp,
  eventName,
  selectedTheme,
  onChange,
}: GuestAppStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {t('eventCreation.guestApp.title')}
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        {t('eventCreation.guestApp.subtitle')}
      </p>

      <GuestAppBuilder
        initialConfig={guestApp}
        onConfigChange={onChange}
        eventName={eventName}
        selectedTheme={selectedTheme}
      />
    </div>
  );
}
