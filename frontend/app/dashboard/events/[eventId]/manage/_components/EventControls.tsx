'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';

interface EventControlsProps {
  event: EventData;
  updating: boolean;
  onStatusToggle: () => void;
}

export function EventControls({ event, updating, onStatusToggle }: EventControlsProps) {
  const { t } = useTranslation('dashboard');

  if (event.status === 'ended') {
    return null;
  }

  const isLive = event.status === 'live';

  return (
    <div className="max-w-sm mx-auto">
      <button
        onClick={onStatusToggle}
        disabled={updating}
        className={`w-full py-4 px-8 rounded-2xl text-lg font-extrabold uppercase tracking-wide text-white transition-opacity disabled:opacity-70 disabled:cursor-not-allowed ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {updating
          ? t('events.manage.controls.updating')
          : isLive
            ? t('events.manage.controls.endEvent')
            : t('events.manage.controls.goLive')}
      </button>
    </div>
  );
}
