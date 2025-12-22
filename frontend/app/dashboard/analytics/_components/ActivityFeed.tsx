'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActivityLogEntry } from '../../_types/analytics';

interface ActivityFeedProps {
  activities: ActivityLogEntry[];
  loading?: boolean;
  initialLimit?: number;
}

const ACTIVITY_TYPE_KEYS: Record<string, string> = {
  photo_upload: 'photosUploaded',
  PhotoUploaded: 'photosUploaded',
  photo_view: 'photoViewed',
  PhotoViewed: 'photoViewed',
  photo_download: 'photoDownloaded',
  PhotoDownloaded: 'photoDownloaded',
  photo_like: 'photoLiked',
  PhotoLiked: 'photoLiked',
  photo_share: 'photoShared',
  PhotoShared: 'photoShared',
  guest_registration: 'guestRegistered',
  GuestRegistered: 'guestRegistered',
  guest_app_open: 'guestAppOpened',
  GuestAppOpened: 'guestAppOpened',
  AppOpened: 'appOpened',
  event_join: 'eventJoined',
  EventJoined: 'eventJoined',
  qr_scan: 'qrScanned',
  QrCodeScanned: 'qrScanned',
  slideshow_view: 'slideshowStarted',
  SlideshowViewed: 'slideshowStarted',
  gallery_view: 'galleryViewed',
  GalleryViewed: 'galleryViewed',
  guestbook_entry: 'guestbookEntry',
  GuestbookEntryAdded: 'guestbookEntry',
};

export function ActivityFeed({ activities = [], loading = false, initialLimit = 5 }: ActivityFeedProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'analytics' });
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedActivities = isExpanded ? activities : activities.slice(0, initialLimit);
  const hasMore = activities.length > initialLimit;

  const getActivityLabel = (type: string) => {
    const key = ACTIVITY_TYPE_KEYS[type] || 'default';
    return t(`activity.types.${key}`);
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('activity.time.now');
    if (diffMins < 60) return `${diffMins} ${t('activity.time.minute')}`;
    if (diffHours < 24) return `${diffHours} ${diffHours > 1 ? t('activity.time.hours') : t('activity.time.hour')}`;
    if (diffDays < 7) return `${diffDays} ${diffDays > 1 ? t('activity.time.days') : t('activity.time.day')}`;

    return date.toLocaleDateString('da-DK', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-nory-card border-[3px] border-nory-border rounded-xl p-6 flex flex-col shadow-brutal">
        <h3 className="text-lg font-bold font-grotesk text-nory-text mb-6">{t('activity.title')}</h3>
        <div className="flex flex-col flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3.5 border-b-2 border-[#eee] last:border-b-0">
              <div className="h-5 bg-nory-bg rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-nory-card border-[3px] border-nory-border rounded-xl p-6 flex flex-col shadow-brutal">
      <h3 className="text-lg font-bold font-grotesk text-nory-text mb-6">{t('activity.title')}</h3>

      {activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-10 px-5 border-[3px] border-dashed border-[#ccc] rounded-lg">
          <p className="text-nory-muted text-sm font-medium">{t('activity.empty')}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col flex-1">
            {displayedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`
                  flex items-start gap-3.5 py-3.5
                  ${index < displayedActivities.length - 1 ? 'border-b-2 border-[#eee]' : ''}
                `}
              >
                <span className="text-[11px] font-semibold text-[#888] bg-[#f0f0ec] px-2 py-1 rounded flex-shrink-0 whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
                <span className="text-sm font-medium text-nory-text leading-relaxed">
                  {activity.description || getActivityLabel(activity.type)}
                </span>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 mt-4 py-2.5 text-xs font-bold text-nory-text bg-nory-bg border-2 border-nory-border rounded-lg transition-all duration-150 hover:bg-nory-yellow hover:text-nory-black hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <ChevronIcon expanded={isExpanded} />
              {isExpanded ? t('activity.showLess') : `${t('activity.showAll')} (${activities.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
