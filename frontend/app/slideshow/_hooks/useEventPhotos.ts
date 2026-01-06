'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError } from '@/lib/api/types';
import type { Photo, EventData } from '../_types';
import { transformApiPhotos } from '../_utils/media';
import * as eventApi from '../_services/eventApi';

interface Options {
  autoFetch?: boolean;
  preview?: boolean;
}

interface PhotoError {
  status: number;
  message: string;
}

export function useEventPhotos(eventId: string, options: Options = {}) {
  const { autoFetch = false, preview } = options;

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PhotoError | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const categoryRef = useRef<string | undefined>();

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const fetchPhotos = useCallback(async (categoryId?: string) => {
    abort();

    const controller = new AbortController();
    abortRef.current = controller;
    categoryRef.current = categoryId;

    setLoading(true);
    setError(null);

    const isPreview = preview ?? new URLSearchParams(window.location.search).get('preview') === 'true';

    try {
      const apiPhotos = await eventApi.fetchEventPhotos(eventId, categoryId, {
        signal: controller.signal,
        preview: isPreview,
      });

      setPhotos(transformApiPhotos(apiPhotos));

      if (!eventData) {
        const data = await eventApi.fetchEventData(eventId, { signal: controller.signal, preview: isPreview });
        setEventData(data);
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      const msg = ApiError.isApiError(e) ? e.message : e instanceof Error ? e.message : 'Failed to load photos';
      const status = ApiError.isApiError(e) ? e.status : 500;
      setError({ status, message: msg });
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, eventData, preview, abort]);

  const refresh = useCallback(() => fetchPhotos(categoryRef.current), [fetchPhotos]);

  useEffect(() => {
    if (autoFetch) fetchPhotos();
    return abort;
  }, [autoFetch, fetchPhotos, abort]);

  return { photos, eventData, loading, error, fetchPhotos, refresh, abort };
}
