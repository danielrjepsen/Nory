'use client';

import { useCallback, useMemo } from 'react';
import type { Photo } from '@/app/_shared/types';

interface ImageModalProps {
  isOpen: boolean;
  photos: Photo[];
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  apiBaseUrl: string;
}

function isVideoFile(photo: Photo): boolean {
  return (
    photo.contentType?.startsWith('video/') ||
    photo.imageUrl.includes('.mp4') ||
    photo.imageUrl.includes('.mov')
  );
}

export function ImageModal({
  isOpen,
  photos,
  selectedIndex,
  onClose,
  onNext,
  onPrevious,
  apiBaseUrl,
}: ImageModalProps) {
  const photo = selectedIndex !== null ? photos[selectedIndex] : null;

  const nonVideoPhotos = useMemo(
    () => photos.filter((p) => !isVideoFile(p)),
    [photos]
  );

  const currentIndexInFiltered = useMemo(() => {
    if (!photo) return -1;
    return nonVideoPhotos.findIndex((p) => p.id === photo.id);
  }, [nonVideoPhotos, photo]);

  const mediaUrl = useMemo(() => {
    if (!photo) return '';
    return photo.imageUrl.startsWith('http')
      ? photo.imageUrl
      : `${apiBaseUrl}${photo.imageUrl}`;
  }, [photo, apiBaseUrl]);

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onPrevious();
    },
    [onPrevious]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onNext();
    },
    [onNext]
  );

  if (!isOpen || !photo || isVideoFile(photo)) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-[calc(100vw-200px)] max-h-[calc(100vh-100px)] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={mediaUrl}
          alt={photo.originalFileName}
          className="max-w-full max-h-[calc(100vh-100px)] object-contain rounded-lg shadow-2xl animate-zoom-in"
        />

        <button
          onClick={onClose}
          className="fixed top-8 right-8 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 z-[2001] hover:bg-white/20 hover:rotate-90"
          aria-label="Close"
        >
          ×
        </button>

        {nonVideoPhotos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="fixed top-1/2 left-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl flex items-center justify-center cursor-pointer transition-all duration-300 z-[2001] hover:bg-white/20 hover:scale-110"
              aria-label="Previous"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              className="fixed top-1/2 right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl flex items-center justify-center cursor-pointer transition-all duration-300 z-[2001] hover:bg-white/20 hover:scale-110"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white py-3 px-6 rounded-full text-sm flex items-center gap-4">
          <span className="font-semibold">
            {currentIndexInFiltered + 1} / {nonVideoPhotos.length}
          </span>
          {photo.uploadedBy && (
            <span className="opacity-80">Uploaded by {photo.uploadedBy}</span>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s ease;
        }
      `}</style>
    </div>
  );
}
