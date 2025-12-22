'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../_hooks/useAnalytics';
import { StatCard } from './StatCard';
import { MiniStatCard } from './MiniStatCard';
import { ChartCard } from './ChartCard';
import { ActivityFeed } from './ActivityFeed';

export function AnalyticsContent() {
  const { t } = useTranslation('dashboard', { keyPrefix: 'analytics' });
  const { analytics, recentActivity, loading, error, refresh } = useAnalytics();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="text-lg text-red-600 font-semibold">{error}</div>
        <button
          onClick={refresh}
          className="px-6 py-3 bg-nory-yellow border-[3px] border-nory-border rounded-xl font-bold text-nory-black hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title={t('stats.photosUploaded')}
          value={analytics?.totalPhotosUploaded ?? 0}
          featured
          change={{ value: 12, isPositive: true }}
          changeLabel={t('stats.vsPreviousWeek')}
        />
        <StatCard
          title={t('stats.qrScans')}
          value={analytics?.totalQrScans ?? 0}
          change={{ value: 8, isPositive: true }}
          changeLabel={t('stats.vsPreviousWeek')}
        />
        <StatCard
          title={t('stats.slideshowViews')}
          value={analytics?.totalSlideshowViews ?? 0}
          change={{ value: 5, isPositive: false }}
          changeLabel={t('stats.vsPreviousWeek')}
        />
        <StatCard
          title={t('stats.guestAppVisits')}
          value={analytics?.totalGuestAppOpens ?? 0}
          change={{ value: 18, isPositive: true }}
          changeLabel={t('stats.vsPreviousWeek')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <ChartCard title={t('chart.title')} />
        <ActivityFeed
          activities={recentActivity ?? []}
          loading={loading}
          initialLimit={5}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MiniStatCard
          title={t('stats.galleryViews')}
          value={analytics?.totalGalleryViews ?? 0}
          icon={<GalleryIcon />}
        />
        <MiniStatCard
          title={t('stats.guestbookEntries')}
          value={analytics?.totalGuestbookEntries ?? 0}
          icon={<GuestbookIcon />}
        />
        <MiniStatCard
          title={t('stats.registrations')}
          value={analytics?.totalGuestRegistrations ?? 0}
          icon={<RegistrationIcon />}
        />
      </div>
    </div>
  );
}

function GalleryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function RegistrationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function GuestbookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
