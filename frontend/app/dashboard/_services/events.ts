import { apiClient } from '@/lib/api';
import { eventCache } from './cache';
import type { CreateEventRequest, EventData, EventPhoto } from '../_types/events';

const CACHE_KEYS = {
  eventPhotos: (eventId: string, limit: number) => `event:photos:${eventId}:${limit}`,
  eventDetails: (eventId: string) => `event:details:${eventId}`,
  events: () => `events`,
} as const;

export default class EventsService {
  static async getEventPhotos(eventId: string, limit = 6): Promise<EventPhoto[]> {
    const cacheKey = CACHE_KEYS.eventPhotos(eventId, limit);

    return eventCache.getOrSet(cacheKey, async () => {
      const response = await apiClient.get<{ photos: EventPhoto[]; totalCount: number }>(
        `/api/v1/events/${eventId}/photos/dashboard`,
        { params: { limit } }
      );
      return (response.photos || []).slice(0, limit);
    });
  }

  static async getEventDetails(eventId: string): Promise<EventData> {
    const cacheKey = CACHE_KEYS.eventDetails(eventId);

    return eventCache.getOrSet(
      cacheKey,
      () => apiClient.get<EventData>(`/api/v1/events/${eventId}`)
    );
  }

  static async createEvent(event: CreateEventRequest): Promise<EventData> {
    return apiClient.post<EventData>('/api/v1/events', event);
  }

  static async getEvents(): Promise<EventData[]> {
    const cacheKey = CACHE_KEYS.events();

    return eventCache.getOrSet(
      cacheKey,
      () => apiClient.get<EventData[]>('/api/v1/events')
    );
  }

  static async updateEvent(eventId: string, updates: Partial<CreateEventRequest>): Promise<EventData> {
    EventsService.invalidateEventDetailsCache(eventId);
    EventsService.invalidateEventsCache();
    return apiClient.patch<EventData>(`/api/v1/events/${eventId}`, updates);
  }

  static async deleteEvent(eventId: string): Promise<void> {
    EventsService.invalidateEventDetailsCache(eventId);
    EventsService.invalidateEventsCache();
    await apiClient.delete(`/api/v1/events/${eventId}`);
  }

  static async startEvent(eventId: string): Promise<EventData> {
    EventsService.invalidateEventDetailsCache(eventId);
    EventsService.invalidateEventsCache();
    return apiClient.post<EventData>(`/api/v1/events/${eventId}/start`, {});
  }

  static async endEvent(eventId: string): Promise<EventData> {
    EventsService.invalidateEventDetailsCache(eventId);
    EventsService.invalidateEventsCache();
    return apiClient.post<EventData>(`/api/v1/events/${eventId}/end`, {});
  }

  static async loadAuthenticatedImage(imageUrl: string): Promise<Blob> {
    const response = await apiClient.getRaw(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status}`);
    }

    return response.blob();
  }

  static invalidateEventPhotosCache(eventId: string): number {
    return eventCache.invalidateByPrefix(`event:photos:${eventId}:`);
  }

  static invalidateEventDetailsCache(eventId: string): boolean {
    return eventCache.delete(CACHE_KEYS.eventDetails(eventId));
  }

  static invalidateEventsCache(): boolean {
    return eventCache.delete(CACHE_KEYS.events());
  }

  static clearCache(): void {
    eventCache.clear();
  }

  static getCacheStats() {
    return eventCache.getStats();
  }
}
