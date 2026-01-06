'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { getEventDetails, getEventPhotos } from '../../../_services/events';
import { PhotoGrid } from '../../../_components/PhotoGrid';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';
import type { EventData, EventPhoto } from '../../../_types/events';

export default function EventPhotosPage() {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, photosData] = await Promise.all([
          getEventDetails(eventId),
          getEventPhotos(eventId),
        ]);
        setEvent(eventData);
        setPhotos(photosData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="photos">
          <LoadingState />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="photos">
          <ErrorState error={error} />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="photos">
        <div>
          {photos.length > 0 ? (
            <>
              <p className="text-body xl:text-body-xl text-nory-muted font-grotesk mb-4">
                {photos.length} {t('events.photos', 'billeder')}
              </p>
              <PhotoGrid photos={photos} isLoading={false} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-nory-bg rounded-card flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-nory-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-body-xl text-nory-muted font-grotesk">
                {t('photos.noPhotos', 'Ingen billeder endnu')}
              </p>
            </div>
          )}
        </div>
      </EventPageLayout>
    </ProtectedRoute>
  );
}
