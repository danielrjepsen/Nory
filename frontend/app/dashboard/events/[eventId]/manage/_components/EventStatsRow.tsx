'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../../../_types/events';

interface EventStatsRowProps {
  event: EventData;
  analytics: {
    photoCount: number;
    guestCount: number;
    visitCount?: number;
  };
}

interface StatCardProps {
  value: number | string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="border-nory-border rounded-[14px] p-4 flex items-center gap-3.5">
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-2xl font-bold leading-none text-nory-text">{value}</span>
        <span className="text-xs text-nory-muted">{label}</span>
      </div>
    </div>
  );
}

export function EventStatsRow({ event, analytics }: EventStatsRowProps) {
  const { t, i18n } = useTranslation('dashboard', { keyPrefix: 'events.manage.stats' });

  const eventDate = event.startsAt ? new Date(event.startsAt) : null;
  const dayNumber = eventDate?.getDate();
  const monthName = eventDate?.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        value={analytics.photoCount}
        label={t('photos')}
      />
      <StatCard
        value={analytics.visitCount ?? analytics.guestCount}
        label={t('visits')}
      />
      <StatCard
        value={analytics.guestCount}
        label={t('guests')}
      />
      {dayNumber && monthName && (
        <StatCard
          value={dayNumber}
          label={monthName}
        />
      )}
    </div>
  );
}

