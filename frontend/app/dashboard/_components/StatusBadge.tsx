'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export type StatusType = 'active' | 'completed' | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const STATUS_COLORS: Record<StatusType, string> = {
  active: '#10b981',
  completed: '#6b7280',
  draft: '#f59e0b',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation('dashboard');
  const color = STATUS_COLORS[status] || STATUS_COLORS.draft;

  const statusKeys: Record<StatusType, string> = {
    active: 'events.status.live',
    completed: 'events.status.ended',
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
