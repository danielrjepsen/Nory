'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEvents, getEventPhotos } from '../../_services/events';
import type { EventData, EventPhoto } from '../../_types/events';

interface UseGalleriesReturn {
  events: EventData[];
  selectedEventId: string | null;
  photos: EventPhoto[];
  loading: boolean;
  photosLoading: boolean;
  error: string | null;
  selectEvent: (eventId: string | null) => void;
  refresh: () => Promise<void>;
}

export function useGalleries(): UseGalleriesReturn {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEvents(data);

      // Auto-select first event with photos if none selected
      if (!selectedEventId && data.length > 0) {
        const eventWithPhotos = data.find(e => e.photoCount > 0) ?? data[0];
        setSelectedEventId(eventWithPhotos.id);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  const fetchPhotos = useCallback(async (eventId: string) => {
    try {
      setPhotosLoading(true);
      const data = await getEventPhotos(eventId, 100);
      setPhotos(data);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEventId) {
      fetchPhotos(selectedEventId);
    } else {
      setPhotos([]);
    }
  }, [selectedEventId, fetchPhotos]);

  const selectEvent = useCallback((eventId: string | null) => {
    setSelectedEventId(eventId);
  }, []);

  const refresh = useCallback(async () => {
    await fetchEvents();
    if (selectedEventId) {
      await fetchPhotos(selectedEventId);
    }
  }, [fetchEvents, fetchPhotos, selectedEventId]);

  return {
    events,
    selectedEventId,
    photos,
    loading,
    photosLoading,
    error,
    selectEvent,
    refresh,
  };
}
