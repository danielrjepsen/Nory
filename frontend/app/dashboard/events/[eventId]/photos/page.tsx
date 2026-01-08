'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { useEvent, useEventPhotos } from '../../../_hooks';
import { PhotoGrid } from '../../../_components/PhotoGrid';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function EmptyPhotos({ eventId }: { eventId: string }) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'photos' });

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-nory-yellow border-2 border-nory-border rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-nory-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-nory-text mb-2 font-bricolage">
        {t('empty.title', 'No photos yet')}
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

function PhotosContent() {
  const { t } = useTranslation('dashboard');
  const { event, loading: eventLoading, error: eventError, eventId } = useEvent();
  const { photos, loading: photosLoading } = useEventPhotos();

  const loading = eventLoading || photosLoading;

  if (loading) {
    return <LoadingState />;
  }

  if (eventError || !event) {
    return <ErrorState error={eventError} />;
  }

  if (photos.length === 0) {
    return <EmptyPhotos eventId={eventId} />;
  }

  return (
    <div>
      <p className="text-body xl:text-body-xl text-nory-muted font-grotesk mb-4">
        {photos.length} {t('events.photos', 'billeder')}
      </p>
      <PhotoGrid photos={photos} isLoading={false} />
    </div>
  );
}

export default function EventPhotosPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="photos">
        <PhotosContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
