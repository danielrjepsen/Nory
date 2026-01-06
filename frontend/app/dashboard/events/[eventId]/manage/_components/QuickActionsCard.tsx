'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  PhotoIcon,
  QRCodeIcon,
  UsersIcon,
  ChartIcon,
  AppsIcon,
  SettingsIcon,
} from '@/app/dashboard/_components/icons';

interface QuickActionsCardProps {
  eventId: string;
}

const shortcuts = [
  { id: 'photos', translationKey: 'photos', Icon: PhotoIcon, path: 'photos' },
  { id: 'qr', translationKey: 'qrCode', Icon: QRCodeIcon, path: 'qr' },
  { id: 'guests', translationKey: 'guests', Icon: UsersIcon, path: 'guests' },
  { id: 'analytics', translationKey: 'analytics', Icon: ChartIcon, path: 'analytics' },
  { id: 'apps', translationKey: 'apps', Icon: AppsIcon, path: 'apps' },
  { id: 'settings', translationKey: 'settings', Icon: SettingsIcon, path: 'settings' },
];

export function QuickActionsCard({ eventId }: QuickActionsCardProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <h3 className="text-[0.95rem] font-bold mb-3.5 text-nory-text">
        {t('events.manage.quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {shortcuts.map(({ id, translationKey, Icon, path }) => (
          <Link
            key={id}
            href={`/dashboard/events/${eventId}/${path}`}
            className="group flex items-center gap-3.5 p-3.5 bg-nory-bg border-2 border-transparent rounded-xl transition-all hover:border-nory-border hover:bg-nory-card"
          >
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 text-nory-text [&_svg]:w-6 [&_svg]:h-6 [&_svg]:stroke-2">
              <Icon />
            </div>
            <span className="text-[0.85rem] font-bold text-nory-text">
              {t(`navigation.eventNavigation.${translationKey}`)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
