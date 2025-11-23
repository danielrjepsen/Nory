import React from 'react';

export type StatusType = 'active' | 'completed' | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const STATUS_CONFIG: Record<StatusType, { color: string; text: string }> = {
  active: { color: '#10b981', text: 'Live' },
  completed: { color: '#6b7280', text: 'Ended' },
  draft: { color: '#f59e0b', text: 'Draft' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white uppercase tracking-wide ${className}`}
      style={{ background: config.color }}
    >
      {config.text}
    </div>
  );
}
