'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EventStatus } from '../../../../_types/events';

interface EventLinksCardProps {
  guestAppUrl: string;
  slideshowUrl: string;
  eventStatus: EventStatus;
}

interface LinkItemProps {
  icon: React.ReactNode;
  label: string;
  url: string;
  displayUrl: string;
  openLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

function LinkItem({ icon, label, url, displayUrl, openLabel, copyLabel, copiedLabel }: LinkItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2.5 p-3 bg-nory-bg rounded-[10px]">
      <div className="w-8 h-8 bg-nory-card rounded-md flex items-center justify-center flex-shrink-0 text-nory-text">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.65rem] text-nory-muted">{label}</div>
        <div className="text-[0.8rem] font-semibold truncate text-nory-text">{displayUrl}</div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={handleOpen}
          className="px-3 py-1.5 bg-nory-card border-2 border-nory-border rounded-md text-[0.7rem] font-semibold text-nory-text transition-colors hover:bg-nory-bg"
        >
          {openLabel}
        </button>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-nory-yellow border-2 border-nory-border rounded-md text-[0.7rem] font-semibold text-nory-black transition-colors hover:bg-[#f0dc4a]"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}

function extractDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.host + urlObj.pathname;
  } catch {
    return url;
  }
}

export function EventLinksCard({ guestAppUrl, slideshowUrl, eventStatus }: EventLinksCardProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events.manage.links' });
  const isPublished = eventStatus === 'live' || eventStatus === 'ended';

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <h3 className="text-[0.95rem] font-bold mb-3.5 text-nory-text">{t('title')}</h3>

      <div className="flex flex-col gap-2.5">
        {isPublished ? (
          <LinkItem
            icon={<MobileIcon />}
            label={t('guestApp.title')}
            url={guestAppUrl}
            displayUrl={extractDisplayUrl(guestAppUrl)}
            openLabel={t('open')}
            copyLabel={t('copy')}
            copiedLabel={t('copied')}
          />
        ) : (
          <div className="flex items-center gap-2.5 p-3 bg-nory-bg/50 rounded-[10px] border-2 border-dashed border-nory-border/50">
            <div className="w-8 h-8 bg-nory-card/50 rounded-md flex items-center justify-center flex-shrink-0 text-nory-muted">
              <MobileIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.65rem] text-nory-muted">{t('guestApp.title')}</div>
              <div className="text-[0.75rem] text-nory-muted italic">{t('guestApp.publishFirst')}</div>
            </div>
          </div>
        )}
        {isPublished ? (
          <LinkItem
            icon={<MonitorIcon />}
            label={t('slideshow.title')}
            url={slideshowUrl}
            displayUrl={extractDisplayUrl(slideshowUrl)}
            openLabel={t('open')}
            copyLabel={t('copy')}
            copiedLabel={t('copied')}
          />
        ) : (
          <div className="flex items-center gap-2.5 p-3 bg-nory-bg/50 rounded-[10px] border-2 border-dashed border-nory-border/50">
            <div className="w-8 h-8 bg-nory-card/50 rounded-md flex items-center justify-center flex-shrink-0 text-nory-muted">
              <MonitorIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.65rem] text-nory-muted">{t('slideshow.title')}</div>
              <div className="text-[0.75rem] text-nory-muted italic">{t('slideshow.publishFirst')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
