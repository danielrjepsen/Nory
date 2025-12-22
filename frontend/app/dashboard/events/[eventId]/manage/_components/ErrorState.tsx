'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  error?: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col justify-center items-center pt-20 gap-6">
      <div className="text-btn-xl text-nory-muted font-grotesk text-center">
        {error || t('events.manage.errors.notFound')}
      </div>
      <button
        onClick={() => router.push('/dashboard')}
        className="px-5 py-3 bg-nory-yellow text-nory-black border-2 border-nory-border rounded-btn text-btn font-grotesk shadow-brutal-md transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        {t('events.manage.backToDashboard')}
      </button>
    </div>
  );
}
