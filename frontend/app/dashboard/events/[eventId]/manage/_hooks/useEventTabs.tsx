'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { type EventData } from '../../../../_types/events';

interface EventAnalytics {
  photoCount: number;
  guestCount: number;
}

// Icon components
function QrCodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function AppsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

interface TabAction {
  label: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

interface TabContent {
  title: string;
  description: string;
  actions: TabAction[];
  customContent?: React.ReactNode;
}

export interface EventTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content?: TabContent;
}

interface UseEventTabsProps {
  eventId: string;
  event: EventData | null;
  analytics: EventAnalytics;
}

export function useEventTabs({ eventId, event, analytics }: UseEventTabsProps): EventTab[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        id: 'qr',
        label: 'QR',
        icon: <QrCodeIcon />,
        content: {
          title: 'QR Codes',
          description: 'Generate QR codes for easy guest access to your event',
          actions: [
            {
              label: 'Generate QR Codes',
              variant: 'primary' as const,
              onClick: () => router.push(`/dashboard/events/${eventId}/qr`),
            },
          ],
        },
      },
      {
        id: 'photos',
        label: 'Photos',
        icon: <PhotoIcon />,
        content: {
          title: 'Photo Management',
          description: 'View, organize, and download all photos from your event',
          actions: [
            {
              label: 'Manage Photos',
              variant: 'primary' as const,
              onClick: () => router.push(`/dashboard/events/${eventId}/photos`),
            },
            {
              label: 'View Gallery',
              variant: 'secondary' as const,
              onClick: () => router.push(`/galleries`),
            },
          ],
        },
      },
      {
        id: 'apps',
        label: 'Apps',
        icon: <AppsIcon />,
        content: {
          title: 'Event Apps',
          description: 'Configure interactive features like guestbook, polls, and more',
          actions: [
            {
              label: 'Configure Apps',
              variant: 'primary' as const,
              onClick: () => router.push(`/dashboard/events/${eventId}/apps`),
            },
          ],
        },
      },
      {
        id: 'stats',
        label: 'Stats',
        icon: <StatsIcon />,
        content: {
          title: 'Analytics & Stats',
          description: 'View detailed engagement metrics and activity insights',
          actions: [
            {
              label: 'View Full Analytics',
              variant: 'primary' as const,
              onClick: () => router.push(`/dashboard/analytics?eventId=${eventId}`),
            },
          ],
          customContent: (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                  {analytics.photoCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                  Photos
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                  {analytics.guestCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                  Visits
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                  {event ? (event.status === 'live' ? 'Live' : 'Offline') : 'Offline'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                  Status
                </div>
              </div>
            </div>
          ),
        },
      },
      {
        id: 'edit',
        label: 'Edit',
        icon: <EditIcon />,
        content: undefined,
      },
    ],
    [eventId, router, analytics, event]
  );
}
