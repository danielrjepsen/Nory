'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionCard } from './ActionCard';

interface EventLinksProps {
  guestAppUrl: string;
  slideshowUrl: string;
  copying: string | null;
  onCopy: (text: string, type: string) => void;
}

function MobileIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-nory-text"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-nory-text"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function EventLinks({ guestAppUrl, slideshowUrl, copying, onCopy }: EventLinksProps) {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
      <ActionCard
        icon={<MobileIcon />}
        title={t('events.manage.links.guestApp.title')}
        description={t('events.manage.links.guestApp.description')}
        secondaryAction={{
          label: t('events.manage.links.open'),
          onClick: () => window.open(guestAppUrl, '_blank'),
        }}
        primaryAction={{
          label: copying === 'guest-app' ? t('events.manage.links.copied') : t('events.manage.links.copy'),
          onClick: () => onCopy(guestAppUrl, 'guest-app'),
          disabled: copying === 'guest-app',
        }}
      />
      <ActionCard
        icon={<MonitorIcon />}
        title={t('events.manage.links.slideshow.title')}
        description={t('events.manage.links.slideshow.description')}
        secondaryAction={{
          label: t('events.manage.links.open'),
          onClick: () => window.open(slideshowUrl, '_blank'),
        }}
        primaryAction={{
          label: copying === 'slideshow' ? t('events.manage.links.copied') : t('events.manage.links.copy'),
          onClick: () => onCopy(slideshowUrl, 'slideshow'),
          disabled: copying === 'slideshow',
        }}
      />
    </div>
  );
}
