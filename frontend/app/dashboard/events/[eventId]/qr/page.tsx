'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { getEventDetails } from '../../../_services/events';
import { EventQRCode } from '../../../_components/events/EventQRCode';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';
import type { EventData } from '../../../_types/events';

export default function EventQRCodePage() {
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
        <EventPageLayout activeNav="qr">
          <LoadingState />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="qr">
          <ErrorState error={error} />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="qr">
        <div className="flex flex-col items-center">
          <div className="bg-nory-white rounded-card p-8 shadow-card-hover">
            <EventQRCode eventId={eventId} eventName={event.name} size={280} />
          </div>

          <div className="mt-8 p-6 bg-nory-white rounded-card max-w-md">
            <h3 className="text-card-title text-nory-black font-grotesk mb-3">
              {t('qrCodes.howToUse', 'Sådan bruger du QR-koden')}
            </h3>
            <ul className="text-body xl:text-body-xl text-nory-muted font-grotesk space-y-2 list-disc list-inside">
              <li>{t('qrCodes.instruction1', 'Print eller vis QR-koden ved dit event')}</li>
              <li>{t('qrCodes.instruction2', 'Gæster scanner for at uploade billeder')}</li>
              <li>{t('qrCodes.instruction3', 'Billeder vises med det samme på slideshowet')}</li>
            </ul>
          </div>
        </div>
      </EventPageLayout>
    </ProtectedRoute>
  );
}
