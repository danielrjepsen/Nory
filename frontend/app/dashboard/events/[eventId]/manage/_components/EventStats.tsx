'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';

interface EventStatsProps {
  analytics: {
    photoCount: number;
    guestCount: number;
  };
  event: EventData;
}

interface StatItemProps {
  value: string | number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  const isNumber = typeof value === 'number';
  return (
    <div className="text-center">
      <div
        className={`text-gray-900 ${isNumber ? 'text-2xl font-extrabold' : 'text-sm font-semibold'}`}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

export function EventStats({ analytics, event }: EventStatsProps) {
  const { t, i18n } = useTranslation('dashboard');

  const formattedDate = event.startsAt
    ? new Date(event.startsAt).toLocaleDateString(i18n.language, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="flex justify-center gap-8 mb-12 text-gray-500">
      <StatItem value={analytics.photoCount} label={t('events.manage.stats.photos')} />
      <StatItem value={analytics.guestCount} label={t('events.manage.stats.visits')} />
      {formattedDate && <StatItem value={formattedDate} label={t('events.manage.stats.date')} />}
    </div>
  );
}
