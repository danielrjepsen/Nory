'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col justify-center items-center pt-20">
      <div className="w-8 h-8 border-3 border-nory-bg border-t-nory-text rounded-full animate-spin mb-4" />
      <div className="text-nory-muted font-grotesk">
        {t('events.manage.loading')}
      </div>
    </div>
  );
}
