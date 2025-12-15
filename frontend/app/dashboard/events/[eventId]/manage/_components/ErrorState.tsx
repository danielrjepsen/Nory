'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../_components/Button';

interface ErrorStateProps {
  error?: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
      <div className="text-lg text-red-600">
        {error || t('events.manage.errors.notFound')}
      </div>
      <Button variant="primary" onClick={() => router.push('/')}>
        {t('events.manage.backToDashboard')}
      </Button>
    </div>
  );
}
