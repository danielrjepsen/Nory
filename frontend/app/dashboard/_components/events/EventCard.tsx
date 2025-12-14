'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import EventsService from '../../_services/events';
import { useIntersectionObserver } from '../../_hooks/useIntersectionObserver';
import { StatusBadge } from '../StatusBadge';
import { QRButton } from '../QRButton';
import { PhotoGrid } from '../PhotoGrid';
import { EventQRModal } from './EventQRModal';
import type { EventData, EventPhoto } from '../../_types/events';

interface EventCardProps {
  event: EventData;
  isOwner?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isOwner = false }) => {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const { ref: cardRef, isVisible } = useIntersectionObserver<HTMLDivElement>();

  // fetch photos when card becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchEventPhotos();
    }
  }, [isVisible, event.id]);

  const fetchEventPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const photos = await EventsService.getEventPhotos(event.id, 6);
      setEventPhotos(photos);
    } catch (error) {
      console.error('Failed to fetch event photos:', error);
      setEventPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleCardClick = () => {
    if (isOwner) {
      router.push(`/dashboard/events/${event.id}/manage`);
    } else {
      router.push(`/dashboard/events/${event.id}`);
    }
  };

  const handleQRClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQRModal(true);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className="flex flex-col h-full min-h-[320px] p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '26px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex justify-between items-start mb-5">
        <StatusBadge status={event.status} />
        <div className="text-2xl font-extrabold text-gray-900">
          {event.photoCount}
        </div>
      </div>

      <div className="mb-6 flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {event.name}
        </h2>
        <p className="text-sm text-gray-500 mb-1">
          {event.location || t('events.locationTbd')}
        </p>
        <p className="text-sm text-gray-500">
          {event.date}
        </p>
      </div>

      <PhotoGrid
        photos={isVisible ? eventPhotos : []}
        isLoading={!isVisible || loadingPhotos}
        className="mb-5"
      />

      <QRButton onClick={handleQRClick} />

      {/* QR Code Modal */}
      <EventQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        eventId={event.id}
        eventName={event.name}
      />
    </div>
  );
};

export default EventCard;