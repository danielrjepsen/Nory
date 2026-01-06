'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DashboardIcon,
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
      path: '/dashboard'
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
