'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';

interface EventStatsProps {
  analytics: {
    photoCount: number;
    guestCount: number;
    visitCount?: number;
  };
  event: EventData;
}

interface StatItemProps {
  value: string | number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="font-mono text-stat xl:text-stat-xl text-nory-text">
        {value}
      </div>
      <div className="text-body text-nory-muted mt-0.5 font-grotesk">
        {label}
      </div>
    </div>
  );
}

export function EventStats({ analytics, event }: EventStatsProps) {
  const { t, i18n } = useTranslation('dashboard');

  const eventDate = event.startsAt ? new Date(event.startsAt) : null;
  const dayNumber = eventDate?.getDate();
  const monthName = eventDate?.toLocaleDateString(i18n.language, { month: 'long' });

  return (
    <div className="flex justify-center gap-12 mb-10">
      <StatItem
        value={analytics.photoCount}
        label={t('events.manage.stats.photos')}
      />
      <StatItem
        value={analytics.visitCount ?? analytics.guestCount}
        label={t('events.manage.stats.visits')}
      />
      <StatItem
        value={analytics.guestCount}
        label={t('events.manage.stats.guests')}
      />
      {dayNumber && monthName && (
        <StatItem
          value={dayNumber}
          label={monthName}
        />
      )}
    </div>
  );
}
