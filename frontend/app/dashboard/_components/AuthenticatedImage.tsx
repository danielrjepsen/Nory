import React from 'react';
import { useAuthenticatedImage } from '@/app/dashboard/_hooks/useAuthenticatedImage';
import type { EventPhoto } from '@/app/dashboard/_types/events';

interface AuthenticatedImageProps {
  photo: EventPhoto;
  className?: string;
  aspectRatio?: 'square' | 'auto';
}

export function AuthenticatedImage({ photo, className = '', aspectRatio = 'square' }: AuthenticatedImageProps) {
  const {
    imageSrc,
    isLoading,
    error,
    imageLoaded,
    handleImageLoad,
    handleImageError,
  } = useAuthenticatedImage({
    photoId: photo.id,
    imageUrl: photo.imageUrl,
  });

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : '';

  return (
    <div className={`relative overflow-hidden rounded-lg ${aspectClass} ${className}`}>
      {(isLoading || (!imageLoaded && imageSrc)) && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="text-gray-400 text-xs">📸</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-xs">
          ⚠️
        </div>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt={photo.originalFileName || 'Event photo'}
          className="w-full h-full object-cover transition-opacity duration-300 ease-out"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
}