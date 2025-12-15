'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';

interface EventHeaderProps {
  event: EventData;
}

const STATUS_COLORS: Record<string, string> = {
  live: 'bg-emerald-500',
  draft: 'bg-amber-500',
  ended: 'bg-gray-500',
};

export function EventHeader({ event }: EventHeaderProps) {
  const { t } = useTranslation('dashboard');
  const statusColorClass = STATUS_COLORS[event.status] || STATUS_COLORS.ended;

  return (
    <div className="text-center">
      <h1 className="text-6xl font-black text-black mb-4 leading-none tracking-tight">
        {event.name}
      </h1>

      <div className="flex items-center justify-center gap-3 mb-6">
        <span
          className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white uppercase tracking-wide ${statusColorClass}`}
        >
          {t(`events.status.${event.status}`)}
        </span>

        {event.status === 'live' && event.hasContent && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {t('events.manage.hasContent')}
          </span>
        )}
      </div>
    </div>
  );
}
