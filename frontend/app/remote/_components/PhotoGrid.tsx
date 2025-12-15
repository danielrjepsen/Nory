'use client';

import React from 'react';
import type { Photo } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/useEventData';

interface PhotoGridProps {
  photos: Photo[];
  photosLoading: boolean;
  apiBaseUrl: string;
  eventStatus: string;
  eventTheme: EventTheme | null;
  onImageClick: (index: number) => void;
}

export function PhotoGrid({
  photos,
  photosLoading,
  apiBaseUrl,
  eventTheme,
  onImageClick,
}: PhotoGridProps) {
  const getFullImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `${apiBaseUrl}${imageUrl}`;
  };

  if (photosLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-400">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">📸</div>
          <p className="text-gray-500">No photos yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Be the first to share a moment!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-8">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => onImageClick(index)}
        >
          <img
            src={getFullImageUrl(photo.imageUrl)}
            alt={photo.originalFileName || 'Photo'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
