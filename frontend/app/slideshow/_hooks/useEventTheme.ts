'use client';

import { useState, useEffect } from 'react';
import type { EventTheme } from '../_types';
import * as eventApi from '../_services/eventApi';

export function useEventTheme(eventId: string) {
  const [theme, setTheme] = useState<EventTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    eventApi.fetchEventTheme(eventId)
      .then(setTheme)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load theme'))
      .finally(() => setLoading(false));
  }, [eventId]);

  return { theme, loading, error };
}
