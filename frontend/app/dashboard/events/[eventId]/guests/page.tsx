'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { useEvent } from '../../../_hooks';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function EmptyGuests({ eventId }: { eventId: string }) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'guests' });

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-nory-yellow border-2 border-nory-border rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-nory-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-nory-text mb-2 font-bricolage">
        {t('empty.title', 'No guests yet')}
      </h3>
      <p className="text-[0.85rem] text-nory-muted mb-4">
        {t('empty.description', 'When guests scan your QR code and upload photos, they will appear here.')}
      </p>
      <Link
        href={`/dashboard/events/${eventId}/qr`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-nory-yellow border-2 border-nory-border rounded-lg font-semibold text-[0.85rem] text-nory-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        {t('empty.cta', 'Share QR Code')}
      </Link>
    </div>
  );
}

function GuestsContent() {
  const { event, loading, error, eventId } = useEvent();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  // TODO: Fetch actual guest list when API is available
  const guests: unknown[] = [];

  if (guests.length === 0) {
    return <EmptyGuests eventId={eventId} />;
  }

  return (
    <div>
      {/* Guest list will go here */}
    </div>
  );
}

export default function EventGuestsPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="guests">
        <GuestsContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
