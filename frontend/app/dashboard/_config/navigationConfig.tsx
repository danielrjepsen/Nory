import {
  DashboardIcon,
  CalendarIcon,
  PhotoIcon,
  QRCodeIcon,
  ChartIcon,
  SettingsIcon
} from '../_components/icons';
import type { NavigationItem } from '../_types';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/'
  },
  {
    id: 'events',
    label: 'Events',
    icon: <CalendarIcon />,
    path: '/'
  },
  {
    id: 'galleries',
    label: 'Photo Galleries',
    icon: <PhotoIcon />,
    path: '/galleries'
  },
  {
    id: 'qr',
    label: 'QR Codes',
    icon: <QRCodeIcon />,
    path: '/qr-codes'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <ChartIcon />,
    path: '/analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings'
  }
];
