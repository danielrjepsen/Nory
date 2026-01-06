'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DashboardIcon,
  PhotoIcon,
  QRCodeIcon,
  UsersIcon,
  ChartIcon,
  AppsIcon,
  SettingsIcon
} from '../_components/icons';
import type { NavigationItem } from '../_types';

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

interface UseEventNavigationItemsProps {
  eventId: string;
}

export function useEventNavigationItems({ eventId }: UseEventNavigationItemsProps): {
  backItem: NavigationItem;
  navigationItems: NavigationItem[];
} {
  const { t } = useTranslation('dashboard');

  return useMemo(() => ({
    backItem: {
      id: 'back',
      label: t('events.manage.backToDashboard'),
      icon: <BackIcon />,
      path: '/dashboard'
    },
    navigationItems: [
      {
        id: 'overview',
        label: t('navigation.eventNavigation.overview'),
        icon: <DashboardIcon />,
        path: `/dashboard/events/${eventId}/manage`
      },
      {
        id: 'photos',
        label: t('navigation.eventNavigation.photos'),
        icon: <PhotoIcon />,
        path: `/dashboard/events/${eventId}/photos`
      },
      {
        id: 'qr',
        label: t('navigation.eventNavigation.qrCode'),
        icon: <QRCodeIcon />,
        path: `/dashboard/events/${eventId}/qr`
      },
      {
        id: 'guests',
        label: t('navigation.eventNavigation.guests'),
        icon: <UsersIcon />,
        path: `/dashboard/events/${eventId}/guests`
      },
      {
        id: 'analytics',
        label: t('navigation.eventNavigation.analytics'),
        icon: <ChartIcon />,
        path: `/dashboard/events/${eventId}/analytics`
      },
      {
        id: 'apps',
        label: t('navigation.eventNavigation.apps'),
        icon: <AppsIcon />,
        path: `/dashboard/events/${eventId}/apps`
      },
      {
        id: 'settings',
        label: t('navigation.eventNavigation.settings'),
        icon: <SettingsIcon />,
        path: `/dashboard/events/${eventId}/settings`
      }
    ]
  }), [t, eventId]);
}
