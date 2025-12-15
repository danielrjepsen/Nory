'use client';

import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Photo } from '../_types';
import { MediaDisplay } from '../_constants';
import { getMediaType } from '../_utils/media';

interface Props {
  photo: Photo | null;
  onImageLoad?: () => void;
  onImageError?: () => void;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
  onMediaFailure?: (photoId: string) => void;
}

const DISPLAY_BOX = 'flex items-center justify-center min-h-[500px] min-w-[700px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl';

function MediaViewerInner({ photo, onImageLoad, onImageError, onVideoStart, onVideoEnd, onMediaFailure }: Props) {
  const { t } = useTranslation('slideshow');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isVideo = photo ? getMediaType(photo) === 'video' : false;
  const isLoading = !photo || photo.id === 'loading';

  useEffect(() => {
    setHasError(false);
  }, [photo?.id]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    onImageError?.();
    if (photo) onMediaFailure?.(photo.id);
  }, [photo, onImageError, onMediaFailure]);

  const handleVideoEnded = useCallback(() => {
    setTimeout(() => onVideoEnd?.(), 500);
  }, [onVideoEnd]);

  const handleVideoError = useCallback(() => {
    if (photo) onMediaFailure?.(photo.id);
  }, [photo, onMediaFailure]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className={DISPLAY_BOX}>
          <div className="text-center text-white p-8">
            <div className="w-12 h-12 mx-auto mb-6">
              <div className="w-full h-full border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <div className="text-xl font-bold mb-3">{t('display.mediaViewer.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError && photo) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`${DISPLAY_BOX} border-2 border-gray-600`}>
          <div className="text-center text-white p-8">
            <div className="text-8xl mb-6">{photo.type === 'video' ? '🎬' : '📷'}</div>
            <div className="text-2xl font-bold mb-3">
              {t(`display.mediaViewer.error.${photo.type === 'video' ? 'video' : 'image'}`)}
            </div>
            <div className="text-lg opacity-75 mb-2">{photo.name}</div>
            <div className="text-sm opacity-50 font-mono mb-4">ID: {photo.id}</div>
            <div className="text-xs opacity-60 mt-4">💡 {t('display.mediaViewer.error.hint')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 rounded-2xl blur-2xl transform translate-y-6 scale-110" />

        <div className="relative transform transition-all duration-1000 ease-in-out hover:scale-[1.02] flex items-center justify-center">
          {isVideo ? (
            <div className="relative">
              <video
                ref={videoRef}
                src={photo.url}
                autoPlay
                muted={isMuted}
                controls={false}
                playsInline
                onCanPlay={onVideoStart}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                className="block rounded-2xl shadow-2xl"
                style={{ width: MediaDisplay.VIDEO_MAX_WIDTH, height: MediaDisplay.VIDEO_MAX_HEIGHT, objectFit: 'contain' }}
              />

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-gray-600">
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                  title={t(`display.mediaViewer.mute.${isMuted ? 'enable' : 'disable'}`)}
                >
                  <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
                  <span className="text-sm font-medium">
                    {t(`display.mediaViewer.mute.${isMuted ? 'muted' : 'unmuted'}`)}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center shadow-2xl">
              <img
                src={photo.url}
                alt={photo.name || t('display.mediaViewer.photoAlt')}
                className="block rounded-2xl"
                onLoad={onImageLoad}
                onError={handleImageError}
                style={{ maxWidth: MediaDisplay.IMAGE_MAX_WIDTH, maxHeight: MediaDisplay.IMAGE_MAX_HEIGHT, width: 'auto', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const MediaViewer = memo(MediaViewerInner);
