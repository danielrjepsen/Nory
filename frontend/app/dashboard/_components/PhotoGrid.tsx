'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticatedImage } from './AuthenticatedImage';
import type { EventPhoto } from '../_types/events';

interface PhotoGridProps {
  photos: EventPhoto[];
  isLoading: boolean;
  skeletonCount?: number;
  className?: string;
}

export function PhotoGrid({
  photos,
  isLoading,
  skeletonCount = 6,
  className = '',
}: PhotoGridProps) {
  const { t } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        <div className="col-span-3 flex flex-col items-center justify-center p-5 text-gray-400">
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <p className="text-sm mt-2">{t('photos.noPhotos')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {photos.map((photo) => (
        <AuthenticatedImage key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
