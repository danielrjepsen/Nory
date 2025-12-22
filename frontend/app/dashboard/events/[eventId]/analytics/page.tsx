'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { getEventDetails, getEventAnalytics } from '../../../_services/events';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';
import type { EventData } from '../../../_types/events';

interface AnalyticsData {
  photoCount: number;
  guestCount: number;
  visitCount: number;
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-nory-white rounded-card p-6 text-center">
      <div className="font-mono text-stat xl:text-stat-xl text-nory-black mb-1">
        {value}
      </div>
      <div className="text-body text-nory-muted font-grotesk">
        {label}
      </div>
    </div>
  );
}

export default function EventAnalyticsPage() {
  const params = useParams();
  const { t } = useTranslation('dashboard');
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, analyticsData] = await Promise.all([
          getEventDetails(eventId),
          getEventAnalytics(eventId),
        ]);
        setEvent(eventData);
        setAnalytics(analyticsData);
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
        <EventPageLayout activeNav="analytics">
          <LoadingState />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <EventPageLayout activeNav="analytics">
          <ErrorState error={error} />
        </EventPageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="analytics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <StatCard
            value={analytics?.photoCount ?? 0}
            label={t('analytics.photos', 'Billeder')}
          />
          <StatCard
            value={analytics?.visitCount ?? 0}
            label={t('analytics.visits', 'Besøg')}
          />
          <StatCard
            value={analytics?.guestCount ?? 0}
            label={t('analytics.guests', 'Gæster')}
          />
        </div>
      </EventPageLayout>
    </ProtectedRoute>
  );
}
