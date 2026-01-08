'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { useEvent, useEventAnalytics } from '../../../_hooks';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function StatCard({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-6 text-center">
      <div className="w-12 h-12 bg-nory-yellow border-2 border-nory-border rounded-xl mx-auto mb-3 flex items-center justify-center text-nory-black">
        {icon}
      </div>
      <div className="font-bricolage text-4xl font-bold text-nory-text mb-1">
        {value}
      </div>
      <div className="text-[0.85rem] text-nory-muted font-grotesk">
        {label}
      </div>
    </div>
  );
}

function EmptyAnalytics({ eventId }: { eventId: string }) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'analytics' });

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-nory-yellow border-2 border-nory-border rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-nory-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-nory-text mb-2 font-bricolage">
        {t('empty.title', 'No activity yet')}
      </h3>
      <p className="text-[0.85rem] text-nory-muted mb-4">
        {t('empty.description', 'Share your event QR code to start collecting photos and seeing analytics.')}
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
        {t('empty.cta', 'View QR Code')}
      </Link>
    </div>
  );
}

function AnalyticsContent() {
  const { t } = useTranslation('dashboard', { keyPrefix: 'analytics' });
  const { event, loading: eventLoading, error: eventError, eventId } = useEvent();
  const { analytics, loading: analyticsLoading } = useEventAnalytics();

  const loading = eventLoading || analyticsLoading;

  if (loading) {
    return <LoadingState />;
  }

  if (eventError || !event) {
    return <ErrorState error={eventError} />;
  }

  const hasActivity = analytics && (analytics.photoCount > 0 || analytics.visitCount > 0 || analytics.guestCount > 0);

  if (!hasActivity) {
    return <EmptyAnalytics eventId={eventId} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
      <StatCard
        value={analytics?.photoCount ?? 0}
        label={t('photos', 'Photos')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        }
      />
      <StatCard
        value={analytics?.visitCount ?? 0}
        label={t('visits', 'Visits')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />
      <StatCard
        value={analytics?.guestCount ?? 0}
        label={t('guests', 'Guests')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      />
    </div>
  );
}

export default function EventAnalyticsPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="analytics">
        <AnalyticsContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
