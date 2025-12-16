'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PublicEventData } from '@/app/_shared/types';

interface GalleryHeaderProps {
  eventData: PublicEventData;
  photosCount: number;
}

export function GalleryHeader({ eventData, photosCount }: GalleryHeaderProps) {
  const { t } = useTranslation('remote');

  return (
    <div className="gallery-header">
      <h2 className="gallery-title">
        {eventData?.status === 'ended' ? t('gallery.titleEnded') : t('gallery.title')}
        {eventData?.status === 'ended' && (
          <span style={{
            fontSize: '12px',
            background: 'linear-gradient(135deg, #ff9a56, #ff6b6b)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            marginLeft: '12px',
            fontWeight: '500'
          }}>
            {t('common.eventEnded')}
          </span>
        )}
      </h2>
      <p className="gallery-subtitle">
        {eventData?.status === 'ended'
          ? t('gallery.subtitleEnded')
          : t('gallery.subtitle')
        }
      </p>
    </div>
  );
}