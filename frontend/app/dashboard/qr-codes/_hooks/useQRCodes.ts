'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../../_services/events';
import type { EventData } from '../../_types/events';

interface UseQRCodesReturn {
  events: EventData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useQRCodes(): UseQRCodesReturn {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refresh = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh,
  };
}
