'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../_components/Button';

interface LinkItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
  copying: string | null;
  copyKey: string;
  onCopy: (text: string, type: string) => void;
  showBorder?: boolean;
  openLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

function LinkItem({
  icon,
  title,
  description,
  url,
  copying,
  copyKey,
  onCopy,
  showBorder = true,
  openLabel,
  copyLabel,
  copiedLabel,
}: LinkItemProps) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${showBorder ? 'border-b border-gray-200' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(url, '_blank')}
        >
          {openLabel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onCopy(url, copyKey)}
          disabled={copying === copyKey}
        >
          {copying === copyKey ? copiedLabel : copyLabel}
        </Button>
      </div>
    </div>
  );
}

interface EventLinksProps {
  guestAppUrl: string;
  slideshowUrl: string;
  copying: string | null;
  onCopy: (text: string, type: string) => void;
}

function MobileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function EventLinks({ guestAppUrl, slideshowUrl, copying, onCopy }: EventLinksProps) {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div className="max-w-xl mx-auto mb-12">
      <LinkItem
        icon={<MobileIcon />}
        title={t('events.manage.links.guestApp.title')}
        description={t('events.manage.links.guestApp.description')}
        url={guestAppUrl}
        copying={copying}
        copyKey="guest-app"
        onCopy={onCopy}
        openLabel={t('events.manage.links.open')}
        copyLabel={t('events.manage.links.copy')}
        copiedLabel={t('events.manage.links.copied')}
      />
      <LinkItem
        icon={<MonitorIcon />}
        title={t('events.manage.links.slideshow.title')}
        description={t('events.manage.links.slideshow.description')}
        url={slideshowUrl}
        copying={copying}
        copyKey="slideshow"
        onCopy={onCopy}
        showBorder={false}
        openLabel={t('events.manage.links.open')}
        copyLabel={t('events.manage.links.copy')}
        copiedLabel={t('events.manage.links.copied')}
      />
    </div>
  );
}
