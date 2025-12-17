'use client';

import React from 'react';
import { useAnalytics } from '../_hooks/useAnalytics';
import { StatCard } from './StatCard';
import { ActivityFeed } from './ActivityFeed';

export function AnalyticsContent() {
  const { analytics, recentActivity, loading, error, refresh } = useAnalytics();

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '18px', color: '#dc2626' }}>{error}</div>
        <button
          onClick={refresh}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 8px 0',
          }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Overview of your events performance
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <StatCard
          title="Photos Uploaded"
          value={analytics?.totalPhotosUploaded ?? 0}
          color="#10b981"
          icon={<PhotoIcon />}
        />
        <StatCard
          title="QR Scans"
          value={analytics?.totalQrScans ?? 0}
          color="#8b5cf6"
          icon={<QRIcon />}
        />
        <StatCard
          title="Slideshow Views"
          value={analytics?.totalSlideshowViews ?? 0}
          color="#f59e0b"
          icon={<SlideshowIcon />}
        />
        <StatCard
          title="Guest App Opens"
          value={analytics?.totalGuestAppOpens ?? 0}
          color="#3b82f6"
          icon={<UsersIcon />}
        />
        <StatCard
          title="Gallery Views"
          value={analytics?.totalGalleryViews ?? 0}
          color="#ec4899"
          icon={<GalleryIcon />}
        />
        <StatCard
          title="Guest Registrations"
          value={analytics?.totalGuestRegistrations ?? 0}
          color="#14b8a6"
          icon={<RegistrationIcon />}
        />
        <StatCard
          title="Guestbook Entries"
          value={analytics?.totalGuestbookEntries ?? 0}
          color="#f97316"
          icon={<GuestbookIcon />}
        />
        <StatCard
          title="Live Guests"
          value={analytics?.liveGuestCount ?? 0}
          color="#06b6d4"
          icon={<LiveIcon />}
        />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={recentActivity ?? []} loading={loading} />
    </div>
  );
}

function PhotoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function SlideshowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function RegistrationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function GuestbookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  );
}
