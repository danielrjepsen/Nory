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
  icon: React.ReactNode;
}

function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-[14px] p-4 flex items-center gap-3.5">
      <div className="w-[42px] h-[42px] bg-nory-bg rounded-[10px] flex items-center justify-center flex-shrink-0 text-nory-text">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-2xl font-bold leading-none text-nory-text">{value}</span>
        <span className="text-xs text-nory-muted">{label}</span>
      </div>
    </div>
  );
}

export function EventStatsRow({ event, analytics }: EventStatsRowProps) {
  const { i18n } = useTranslation();

  const eventDate = event.startsAt ? new Date(event.startsAt) : null;
  const dayNumber = eventDate?.getDate();
  const monthName = eventDate?.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        value={analytics.photoCount}
        label="Billeder"
        icon={<PhotoIcon />}
      />
      <StatCard
        value={analytics.visitCount ?? analytics.guestCount}
        label="Besøg"
        icon={<EyeIcon />}
      />
      <StatCard
        value={analytics.guestCount}
        label="Gæster"
        icon={<UsersIcon />}
      />
      {dayNumber && monthName && (
        <StatCard
          value={dayNumber}
          label={monthName}
          icon={<CalendarIcon />}
        />
      )}
    </div>
  );
}

function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
