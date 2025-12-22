'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getEventPhotos } from '../../_services/events';
import { useIntersectionObserver } from '../../_hooks/useIntersectionObserver';
import { AuthenticatedImage } from '../AuthenticatedImage';
import { EventQRModal } from './EventQRModal';
import type { EventData, EventPhoto } from '../../_types/events';

interface EventCardProps {
  event: EventData;
  isOwner?: boolean;
}

const STATUS_STYLES = {
  live: {
    className: 'bg-[#7BED9F] text-nory-black',
    showPulse: true,
  },
  ended: {
    className: 'bg-[#ddd] text-[#666]',
    showPulse: false,
  },
  draft: {
    className: 'bg-nory-yellow text-nory-black',
    showPulse: false,
  },
} as const;

const EventCard: React.FC<EventCardProps> = ({ event, isOwner = false }) => {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events' });
  const router = useRouter();
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const { ref: cardRef, isVisible } = useIntersectionObserver<HTMLAnchorElement>();

  useEffect(() => {
    if (isVisible) {
      fetchEventPhotos();
    }
  }, [isVisible, event.id]);

  const fetchEventPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const photos = await getEventPhotos(event.id, 3);
      setEventPhotos(photos);
    } catch (error) {
      console.error('Failed to fetch event photos:', error);
      setEventPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOwner) {
      router.push(`/dashboard/events/${event.id}/manage`);
    } else {
      router.push(`/dashboard/events/${event.id}`);
    }
  };

  const statusStyles = STATUS_STYLES[event.status] || STATUS_STYLES.draft;

  const PhotoPlaceholder = ({ color }: { color?: string }) => (
    <div
      className="aspect-square border-2 border-nory-border rounded-md flex items-center justify-center"
      style={{ backgroundColor: color || '#f0f0f0' }}
    >
      <svg className="w-6 h-6 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    </div>
  );

  const placeholderColors = event.status === 'ended'
    ? ['#ddd', '#ccc', '#bbb']
    : event.status === 'live'
    ? ['#FFB6C1', '#87CEEB', '#98FB98']
    : ['#f0f0f0', '#f0f0f0', '#f0f0f0'];

  return (
    <>
      <a
        ref={cardRef}
        href={isOwner ? `/dashboard/events/${event.id}/manage` : `/dashboard/events/${event.id}`}
        onClick={handleCardClick}
        className="block w-full bg-nory-card border-[3px] border-nory-border rounded-xl overflow-hidden shadow-brutal transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-brutal-sm cursor-pointer"
      >
        <div className="grid grid-cols-3 gap-[3px] p-3 pb-0">
          {(!isVisible || loadingPhotos) ? (
            <>
              <div className="aspect-square bg-nory-bg border-2 border-nory-border rounded-md animate-pulse" />
              <div className="aspect-square bg-nory-bg border-2 border-nory-border rounded-md animate-pulse" />
              <div className="aspect-square bg-nory-bg border-2 border-nory-border rounded-md animate-pulse" />
            </>
          ) : eventPhotos.length > 0 ? (
            <>
              {eventPhotos.slice(0, 3).map((photo, index) => (
                <div key={photo.id || index} className="aspect-square border-2 border-nory-border rounded-md overflow-hidden">
                  <AuthenticatedImage
                    photo={photo}
                    aspectRatio="square"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {eventPhotos.length < 3 && Array.from({ length: 3 - eventPhotos.length }).map((_, i) => (
                <PhotoPlaceholder key={`placeholder-${i}`} color={placeholderColors[eventPhotos.length + i]} />
              ))}
            </>
          ) : (
            <>
              <PhotoPlaceholder color={placeholderColors[0]} />
              <PhotoPlaceholder color={placeholderColors[1]} />
              <PhotoPlaceholder color={placeholderColors[2]} />
            </>
          )}
        </div>

        <div className="p-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-nory-border rounded text-[11px] font-bold uppercase tracking-wide shadow-brutal-sm mb-2.5 ${statusStyles.className}`}>
            {statusStyles.showPulse && (
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
            )}
            {t(`status.${event.status}`)}
          </span>

          <h3 className="text-xl font-bold text-nory-text mb-1 font-grotesk">
            {event.name}
          </h3>

          <p className="text-[13px] text-nory-muted mb-4">
            {event.date}
          </p>

          <div className="h-0.5 bg-nory-border mb-3" />

          <div className="flex gap-5">
            <div className="flex items-center gap-1.5">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              <span className="text-base font-bold text-nory-text">{event.photoCount}</span>
              <span className="text-[11px] text-nory-muted uppercase tracking-wide">{t('card.photos')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-base font-bold text-nory-text">{event.analytics?.totalGuestAppOpens || 0}</span>
              <span className="text-[11px] text-nory-muted uppercase tracking-wide">{t('card.guests')}</span>
            </div>
          </div>
        </div>
      </a>

      <EventQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        eventId={event.id}
        eventName={event.name}
      />
    </>
  );
};

export default EventCard;
