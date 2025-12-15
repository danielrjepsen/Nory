'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex justify-center items-center h-[50vh] text-lg text-gray-500">
      {t('events.manage.loading')}
    </div>
  );
}
