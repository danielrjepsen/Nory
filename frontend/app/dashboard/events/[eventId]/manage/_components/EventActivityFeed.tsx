'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { ActivityLogEntry } from '../../../../_types/analytics';
import { getEventActivity } from '../../../../_services/analytics';
import {
  PhotoIcon,
  GuestIcon,
  QRIcon,
  SlideshowIcon,
  DefaultActivityIcon,
} from '@/components/icons/ActivityIcons';

interface EventActivityFeedProps {
  eventId: string;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
  photo_upload: { icon: <PhotoIcon />, bg: 'bg-blue-100 dark:bg-blue-900/30' },
  PhotoUploaded: { icon: <PhotoIcon />, bg: 'bg-blue-100 dark:bg-blue-900/30' },
  photo_view: { icon: <PhotoIcon />, bg: 'bg-blue-100 dark:bg-blue-900/30' },
  PhotoViewed: { icon: <PhotoIcon />, bg: 'bg-blue-100 dark:bg-blue-900/30' },
  guest_registration: { icon: <GuestIcon />, bg: 'bg-green-100 dark:bg-green-900/30' },
  GuestRegistered: { icon: <GuestIcon />, bg: 'bg-green-100 dark:bg-green-900/30' },
  guest_app_open: { icon: <GuestIcon />, bg: 'bg-green-100 dark:bg-green-900/30' },
  GuestAppOpened: { icon: <GuestIcon />, bg: 'bg-green-100 dark:bg-green-900/30' },
  AppOpened: { icon: <GuestIcon />, bg: 'bg-green-100 dark:bg-green-900/30' },
  qr_scan: { icon: <QRIcon />, bg: 'bg-amber-100 dark:bg-amber-900/30' },
  QrCodeScanned: { icon: <QRIcon />, bg: 'bg-amber-100 dark:bg-amber-900/30' },
  slideshow_view: { icon: <SlideshowIcon />, bg: 'bg-purple-100 dark:bg-purple-900/30' },
  SlideshowViewed: { icon: <SlideshowIcon />, bg: 'bg-purple-100 dark:bg-purple-900/30' },
};

const DEFAULT_CONFIG = { icon: <DefaultActivityIcon />, bg: 'bg-nory-bg' };

function getActivityConfig(type: string) {
  return ACTIVITY_CONFIG[type] || DEFAULT_CONFIG;
}

export function EventActivityFeed({ eventId }: EventActivityFeedProps) {
  const { t, i18n } = useTranslation('dashboard', { keyPrefix: 'analytics' });
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('activity.time.now');
    if (diffMins < 60) return `${diffMins} ${t('activity.time.minute')} ${t('activity.time.ago')}`;
    if (diffHours < 24) return `${diffHours} ${diffHours > 1 ? t('activity.time.hours') : t('activity.time.hour')} ${t('activity.time.ago')}`;
    if (diffDays < 7) return `${diffDays} ${diffDays > 1 ? t('activity.time.days') : t('activity.time.day')} ${t('activity.time.ago')}`;

    return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getEventActivity(eventId, 4);
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [eventId]);

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-[0.95rem] font-bold text-nory-text">{t('activity.title')}</h3>
        <Link
          href={`/dashboard/events/${eventId}/analytics`}
          className="text-xs font-semibold text-nory-muted hover:text-nory-text transition-colors"
        >
          {t('activity.showAll')} →
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-3 border-b border-nory-border/30 last:border-b-0">
              <div className="h-9 bg-nory-bg rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="py-6 text-center text-sm text-nory-muted">
          {t('activity.empty')}
        </div>
      ) : (
        <div className="flex flex-col">
          {activities.map((activity, index) => {
            const config = getActivityConfig(activity.type);
            return (
              <div
                key={activity.id}
                className={`flex items-center gap-3 py-3 ${index < activities.length - 1 ? 'border-b border-nory-border/30' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${config.bg}`}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-nory-text">
                    {activity.description}
                  </div>
                  <div className="text-[0.65rem] text-nory-muted mt-0.5">
                    {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
