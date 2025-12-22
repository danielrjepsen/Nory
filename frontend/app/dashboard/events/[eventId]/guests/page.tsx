'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { getEventDetails } from '../../../_services/events';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';
import type { EventData } from '../../../_types/events';

export default function EventGuestsPage() {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventDetails(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="guests">
          <LoadingState />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="guests">
          <ErrorState error={error} />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="guests">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-nory-bg rounded-card flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-nory-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-body-xl text-nory-muted font-grotesk">
            {t('guests.noGuests', 'Ingen gæster endnu')}
          </p>
        </div>
      </EventPageLayout>
    </ProtectedRoute>
  );
}
