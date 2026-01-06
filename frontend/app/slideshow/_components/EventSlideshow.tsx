'use client';

import { useCallback, useMemo, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MediaViewer,
  AmbilightBackground,
  ParticleField,
  ConnectionStatus,
  PhotoCounter,
  ActivityFeed,
  EventStatusScreen,
  PreviewBadge,
  QRCodeDisplay,
} from './index';
import HeartAnimations from './HeartAnimations';
import LoadingScreen from './LoadingScreen';
import {
  useSlideshow,
  useEventPhotos,
  useEventTheme,
  useAmbilight,
  useActivities,
  useHearts,
} from '../_hooks';

interface Props {
  eventId: string;
}

const NOOP = () => { };

function toHeart(h: { id: string; randomX: number; userName: string; timestamp: number }) {
  return { id: h.id, x: h.randomX, y: 0, userName: h.userName, timestamp: h.timestamp };
}

function getEventStatus(error: { code?: string; status: number } | null, hasPhotos: boolean, isLoading: boolean) {
  if (error?.code === 'draft') return 'draft' as const;
  if (error?.code === 'ended') return 'ended' as const;
  if (error?.status === 404) return 'error' as const;
  if (!hasPhotos && !isLoading) return 'no-photos' as const;
  return null;
}

function EventSlideshowInner({ eventId }: Props) {
  const { t } = useTranslation('slideshow');

  const { photos, eventData, loading: photosLoading, error: photosError, fetchPhotos, refresh } = useEventPhotos(eventId, { autoFetch: true });
  const { theme: eventTheme, loading: themeLoading } = useEventTheme(eventId);
  const { activities, addActivity } = useActivities();
  const { animatingHearts } = useHearts();
  const { currentIndex, currentPhoto, selectedCategory, availableCategories, isLoadingPhotos, moveToNext, onVideoEnd } = useSlideshow(photos, { eventId, autoPlay: true });
  const { colors: ambilightColors, animation: ambilightAnimation } = useAmbilight(currentPhoto, { theme: eventTheme });

  const log = useCallback((key: string, params?: Record<string, string>) => addActivity('system', t(key, params)), [addActivity, t]);

  useEffect(() => {
    if (selectedCategory) fetchPhotos(selectedCategory);
  }, [selectedCategory, fetchPhotos]);

  useEffect(() => {
    const timer = setTimeout(() => log('display.welcome.title', { event: eventData?.name || t('display.fallback.eventName') }), 2000);
    return () => clearTimeout(timer);
  }, [eventData?.name, log, t]);

  const handleRetry = useCallback(() => {
    log('display.loading');
    fetchPhotos(selectedCategory ?? undefined);
  }, [selectedCategory, fetchPhotos, log]);

  const handleRefresh = useCallback(async () => {
    log('display.loading');
    try { await refresh(); } catch { log('display.error'); }
  }, [refresh, log]);

  const handleMediaFailure = useCallback(() => {
    log('display.error');
    moveToNext();
  }, [log, moveToNext]);

  const isLoading = photosLoading || isLoadingPhotos;
  const isInitialLoading = isLoading && photos.length === 0;
  const eventStatus = useMemo(() => getEventStatus(photosError, photos.length > 0, isLoading), [photosError, photos.length, isLoading]);
  const categoryName = selectedCategory ? availableCategories.find((c) => c.id === selectedCategory)?.name : null;
  const hearts = useMemo(() => animatingHearts.map(toHeart), [animatingHearts]);

  if (isInitialLoading) {
    return themeLoading ? <ThemeLoadingSpinner /> : <LoadingScreen eventName={eventData?.name} eventTheme={eventTheme} />;
  }

  if (eventStatus) {
    return (
      <EventStatusScreen
        status={eventStatus}
        eventName={eventData?.name}
        eventTheme={eventTheme}
        errorMessage={photosError?.message}
        endedAt={eventData?.endsAt}
        isPreview={eventData?.isPreview}
        onRetry={handleRetry}
        onRefresh={handleRefresh}
      >
        {eventStatus === 'no-photos' && <QRCodeDisplay eventId={eventId} />}
      </EventStatusScreen>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative flex">
      {eventData?.isPreview && <PreviewBadge />}
      <AmbilightBackground animation={ambilightAnimation} colors={ambilightColors} theme={eventTheme} />
      <ParticleField theme={eventTheme} />

      <div className="flex-1 relative">
        <MediaViewer photo={currentPhoto} onImageLoad={NOOP} onImageError={NOOP} onVideoEnd={onVideoEnd} onMediaFailure={handleMediaFailure} />
        <HeartAnimations hearts={hearts} />
        <ConnectionStatus connected connectionAttempts={0} currentController={null} eventInfo={eventData} selectedCategory={selectedCategory} availableCategories={availableCategories} onReconnect={NOOP} />
        <QRCodeDisplay eventId={eventId} />
        <PhotoCounter currentIndex={currentIndex} totalPhotos={photos.length} categoryName={categoryName} eventName={eventData?.name} isLoading={isLoading} />
      </div>

      <ActivityFeed activities={activities} />
    </div>
  );
}

const ThemeLoadingSpinner = memo(function ThemeLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] to-[#1a1625]">
      <div className="w-10 h-10 border-[3px] border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );
});

export const EventSlideshow = memo(EventSlideshowInner);
