'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardOverview } from '../../_services/analytics';
import type { DashboardOverview, ActivityLogEntry, OrgAnalyticsSummary, EventSummary } from '../../_types/analytics';

interface UseAnalyticsReturn {
  events: EventSummary[];
  analytics: OrgAnalyticsSummary | null;
  recentActivity: ActivityLogEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [analytics, setAnalytics] = useState<OrgAnalyticsSummary | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const overview = await getDashboardOverview();

      setEvents(overview.events);
      setAnalytics(overview.analytics);
      setRecentActivity(overview.recentActivity);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    analytics,
    recentActivity,
    loading,
    error,
    refresh: fetchData,
  };
}
