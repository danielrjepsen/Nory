'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../_types/events';

interface EventSelectorProps {
  events: EventData[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
  loading?: boolean;
}

export function EventSelector({
  events,
  selectedEventId,
  onSelectEvent,
  loading = false,
}: EventSelectorProps) {
  const { t } = useTranslation('dashboard');

  if (loading) {
    return (
      <div className="w-full sm:w-64 h-12 bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <select
      value={selectedEventId ?? ''}
      onChange={(e) => onSelectEvent(e.target.value || null)}
      className="
        w-full sm:w-64 px-4 py-3
        border border-gray-300 rounded-lg
        bg-white text-gray-900
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
      "
    >
      <option value="">{t('galleries.selectEvent')}</option>
      {events.map((event) => (
        <option key={event.id} value={event.id}>
          {event.name} ({event.photoCount} {t('galleries.photos')})
        </option>
      ))}
    </select>
  );
}
