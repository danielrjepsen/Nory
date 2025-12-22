'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEventPhotos } from '../../../../_services/events';
import { useAuthenticatedImage } from '../../../../_hooks';
import type { EventPhoto } from '../../../../_types/events';

interface RecentPhotosCardProps {
  eventId: string;
  totalPhotoCount: number;
}

interface PhotoItemProps {
  photo: EventPhoto;
}

function PhotoItem({ photo }: PhotoItemProps) {
  const { imageSrc, isLoading, error, imageLoaded, handleImageLoad, handleImageError } = useAuthenticatedImage({
    photoId: photo.id,
    imageUrl: photo.imageUrl,
  });

  if (isLoading && !imageSrc) {
    return (
      <div className="aspect-square rounded-lg border-2 border-nory-border overflow-hidden bg-nory-bg animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="aspect-square rounded-lg border-2 border-nory-border overflow-hidden bg-nory-bg flex items-center justify-center">
        <span className="text-nory-muted text-xs">⚠️</span>
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-lg border-2 border-nory-border overflow-hidden bg-nory-bg">
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}

export function RecentPhotosCard({ eventId, totalPhotoCount }: RecentPhotosCardProps) {
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const recentPhotos = await getEventPhotos(eventId, 7);
        setPhotos(recentPhotos);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [eventId]);

  const remainingCount = Math.max(0, totalPhotoCount - 7);

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-[0.95rem] font-bold text-nory-text">Seneste billeder</h3>
        <Link
          href={`/dashboard/events/${eventId}/photos`}
          className="text-xs font-semibold text-nory-muted hover:text-nory-text transition-colors"
        >
          Se alle →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border-2 border-nory-border overflow-hidden bg-nory-bg animate-pulse"
            />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="py-8 text-center text-sm text-nory-muted">
          Ingen billeder endnu
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo) => (
            <PhotoItem key={photo.id} photo={photo} />
          ))}
          {remainingCount > 0 && (
            <Link
              href={`/dashboard/events/${eventId}/photos`}
              className="aspect-square rounded-lg border-2 border-nory-border overflow-hidden bg-nory-bg flex items-center justify-center font-mono font-bold text-[0.9rem] text-nory-text transition-colors hover:bg-nory-yellow hover:text-nory-black"
            >
              +{remainingCount}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
