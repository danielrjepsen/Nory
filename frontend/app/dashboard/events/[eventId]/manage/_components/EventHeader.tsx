'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';

interface EventHeaderProps {
  event: EventData;
}

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-nory-yellow text-nory-black',
  draft: 'bg-nory-yellow text-nory-black',
  ended: 'bg-nory-text text-nory-card',
};

export function EventHeader({ event }: EventHeaderProps) {
  const { t } = useTranslation('dashboard');
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.ended;

  return (
    <header className="text-center mb-8">
      <h1 className="text-heading-xl 2xl:text-heading-2xl text-nory-text font-grotesk mb-2">
        {event.name}
      </h1>
      <div className="flex items-center justify-center">
        <span
          className={`inline-block font-mono text-badge uppercase px-3 py-1.5 rounded-badge ${statusStyle}`}
        >
          {t(`events.status.${event.status}`)}
        </span>
      </div>
    </header>
  );
}
