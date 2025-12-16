'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventStatus } from '../_types/events';

interface StatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const STATUS_COLORS: Record<EventStatus, string> = {
  live: '#10b981',
  ended: '#6b7280',
  draft: '#f59e0b',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation('dashboard');
  const color = STATUS_COLORS[status] || STATUS_COLORS.draft;

  const statusKeys: Record<EventStatus, string> = {
    live: 'events.status.live',
    ended: 'events.status.ended',
    draft: 'events.status.draft',
  };

  return (
    <div
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white uppercase tracking-wide ${className}`}
      style={{ background: color }}
    >
      {t(statusKeys[status])}
    </div>
  );
}
