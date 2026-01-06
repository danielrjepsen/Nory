'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SettingsIcon, ExternalLinkIcon } from '@/components/icons/CommonIcons';
import type { EventData } from '../../../../_types/events';

interface EventOverviewHeaderProps {
  event: EventData;
  guestAppUrl: string;
  onPublish: () => void;
}

const STATUS_STYLES = {
  live: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    dot: 'bg-green-500',
    animate: true,
  },
  draft: {
    bg: 'bg-nory-yellow',
    dot: 'bg-nory-text',
    animate: false,
  },
  ended: {
    bg: 'bg-nory-bg',
    dot: 'bg-nory-muted',
    animate: false,
  },
};

export function EventOverviewHeader({ event, guestAppUrl, onPublish }: EventOverviewHeaderProps) {
  const { t, i18n } = useTranslation('dashboard', { keyPrefix: 'events' });
  const isDraft = event.status === 'draft';

  const eventDate = event.startsAt ? new Date(event.startsAt) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : null;

  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.ended;

  return (
    <header className="flex justify-between items-start gap-8">
      <div className="flex-1">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusStyle.bg} border-2 border-nory-border rounded-full text-[0.7rem] font-bold uppercase tracking-wide mb-2`}
        >
          <span
            className={`w-1.5 h-1.5 ${statusStyle.dot} rounded-full ${statusStyle.animate ? 'animate-pulse' : ''}`}
          />
          {t(`header.status.${event.status}`, t(`status.${event.status}`))}
        </div>

        <h1 className="text-[2rem] font-bold tracking-tight text-nory-text mb-1">
          {event.name}
        </h1>

        <p className="text-[0.9rem] text-nory-muted">
          {formattedDate}
          {event.location && ` · ${event.location}`}
        </p>
      </div>

      <div className="flex gap-2.5 flex-shrink-0">
        <Link
          href={`/dashboard/events/${event.id}/settings`}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-nory-card text-nory-text border-2 border-nory-border rounded-[10px] text-[0.8rem] font-semibold transition-colors hover:bg-nory-bg"
        >
          <SettingsIcon />
          {t('header.settings')}
        </Link>
        {isDraft ? (
          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-green-500 text-black border-2 border-nory-border rounded-[10px] text-[0.8rem] font-semibold shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-md hover:bg-green-400"
          >
            <PublishIcon />
            {t('header.publish')}
          </button>
        ) : (
          <a
            href={guestAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-nory-yellow text-nory-black border-2 border-nory-border rounded-[10px] text-[0.8rem] font-semibold shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-md"
          >
            <ExternalLinkIcon />
            {t('header.openGuestApp')}
          </a>
        )}
      </div>
    </header>
  );
}

function PublishIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
