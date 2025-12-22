'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { getEventDetails, updateEvent } from '../../../_services/events';
import GuestAppBuilder from '../../../_components/appbuilder/GuestAppBuilder';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';
import type { EventData } from '../../../_types/events';

export default function EventAppsPage() {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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
      fetchData();
    }
  }, [eventId]);

  const handleConfigChange = async (config: any) => {
    try {
      await updateEvent(eventId, { guestAppConfig: config });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="apps">
          <LoadingState />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="apps">
          <ErrorState error={error} />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="apps">
        <GuestAppBuilder
          eventName={event.name}
          initialConfig={event.guestAppConfig}
          selectedTheme={event.theme || 'wedding'}
          onConfigChange={handleConfigChange}
        />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
