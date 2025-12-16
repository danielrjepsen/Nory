'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import PageLayout from '../../../_components/layout/PageLayout';
import { getEventDetails } from '../../../_services/events';
import { EventQRCode } from '../../../_components/events/EventQRCode';
import type { EventData } from '../../../_types/events';

export default function EventQRCodePage() {
  const params = useParams();
  const router = useRouter();
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
        <PageLayout>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              fontSize: '18px',
              color: '#6b7280',
            }}
          >
            Loading...
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <PageLayout>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '18px', color: '#dc2626' }}>{error || 'Event not found'}</div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => router.push(`/dashboard/events/${eventId}/manage`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Event
            </button>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#111827',
                margin: '0 0 8px 0',
              }}
            >
              QR Code
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>{event.name}</p>
          </div>

          {/* QR Code Card */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <EventQRCode eventId={eventId} eventName={event.name} size={320} />
          </div>

          {/* Instructions */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', margin: '0 0 8px 0' }}>
              How to use
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#166534', lineHeight: '1.6' }}>
              <li>Print or display the QR code at your event</li>
              <li>Guests scan to upload photos directly</li>
              <li>Photos appear instantly on the slideshow</li>
            </ul>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
