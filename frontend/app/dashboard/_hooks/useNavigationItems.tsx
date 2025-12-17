'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DashboardIcon,
  CalendarIcon,
  PhotoIcon,
  QRCodeIcon,
  UsersIcon,
  ChartIcon,
  SettingsIcon
} from '../_components/icons';
import type { NavigationItem } from '../_types';

export function useNavigationItems(): NavigationItem[] {
  const { t } = useTranslation('dashboard');

  return useMemo(() => [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      id: 'events',
      label: t('navigation.events'),
      icon: <CalendarIcon />,
      path: '/'
    },
    {
      id: 'galleries',
      label: t('navigation.galleries'),
      icon: <PhotoIcon />,
      path: '/dashboard/galleries'
    },
    {
      id: 'qr',
      label: t('navigation.qrCodes'),
      icon: <QRCodeIcon />,
      path: '/dashboard/qr-codes'
    },
    {
      id: 'guests',
      label: t('navigation.guests'),
      icon: <UsersIcon />,
      path: '/dashboard/guests'
    },
    {
      id: 'analytics',
      label: t('navigation.analytics'),
      icon: <ChartIcon />,
      path: '/dashboard/analytics'
    },
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: <SettingsIcon />,
      path: '/dashboard/settings'
    }
  ], [t]);
}
