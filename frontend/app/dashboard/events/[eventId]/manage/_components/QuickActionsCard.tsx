'use client';

import React from 'react';
import Link from 'next/link';

interface QuickActionsCardProps {
  eventId: string;
  guestAppUrl: string;
  slideshowUrl: string;
}

interface ActionItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  external?: boolean;
}

function ActionItem({ href, icon, title, description, external = false }: ActionItemProps) {
  const content = (
    <>
      <div className="w-10 h-10 bg-nory-card border-2 border-nory-border rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-nory-yellow text-nory-text group-hover:text-nory-black">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.85rem] font-bold mb-0.5 text-nory-text">{title}</div>
        <div className="text-[0.7rem] text-nory-muted">{description}</div>
      </div>
    </>
  );

  const className =
    'group flex items-center gap-3.5 p-3.5 bg-nory-bg border-2 border-transparent rounded-xl transition-all hover:border-nory-border hover:bg-nory-card';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function QuickActionsCard({ eventId, guestAppUrl, slideshowUrl }: QuickActionsCardProps) {
  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <h3 className="text-[0.95rem] font-bold mb-3.5 text-nory-text">Hurtig adgang</h3>
      <div className="grid grid-cols-2 gap-2.5">
        <ActionItem
          href={guestAppUrl}
          icon={<MobileIcon />}
          title="Gæste-app"
          description="Del med gæster"
          external
        />
        <ActionItem
          href={slideshowUrl}
          icon={<MonitorIcon />}
          title="Slideshow"
          description="Vis på skærm eller TV"
          external
        />
        <ActionItem
          href={`/dashboard/events/${eventId}/photos`}
          icon={<DownloadIcon />}
          title="Download"
          description="Hent alle billeder"
        />
        <ActionItem
          href={`/dashboard/events/${eventId}/photos?upload=true`}
          icon={<UploadIcon />}
          title="Upload"
          description="Tilføj billeder"
        />
      </div>
    </div>
  );
}

function MobileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
