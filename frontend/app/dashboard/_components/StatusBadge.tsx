'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventStatus } from '../_types/events';

interface StatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const STATUS_STYLES: Record<EventStatus, string> = {
  live: 'bg-nory-yellow text-nory-black',
  ended: 'bg-nory-bg text-nory-muted',
  draft: 'bg-nory-yellow text-nory-black',
  archived: 'bg-nory-bg text-nory-muted opacity-60',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation('dashboard');
  const styles = STATUS_STYLES[status] || STATUS_STYLES.draft;

  const statusKeys: Record<EventStatus, string> = {
    live: 'events.status.live',
    ended: 'events.status.ended',
    draft: 'events.status.draft',
    archived: 'events.status.archived',
  };

  return (
    <span
      className={`inline-block font-mono text-badge uppercase px-2.5 py-1.5 rounded-badge ${styles} ${className}`}
    >
      {t(statusKeys[status])}
    </span>
  );
}
