import { apiClient } from './api';
import { eventCache } from './cache';
import type { EventData, EventPhoto } from '../_types/events';

const CACHE_KEYS = {
  eventPhotos: (eventId: string, limit: number) => `event:photos:${eventId}:${limit}`,
  eventDetails: (eventId: string) => `event:details:${eventId}`,
  events: () => `events`,
} as const;

export class EventsService {
  static async getEventPhotos(eventId: string, limit = 6): Promise<EventPhoto[]> {
    const cacheKey = CACHE_KEYS.eventPhotos(eventId, limit);

    return eventCache.getOrSet(cacheKey, async () => {
      const response = await apiClient.get<EventPhoto[]>(
        `/api/v1/events/${eventId}/photos/dashboard`,
        { params: { limit } }
      );
      return response.slice(0, limit);
    });
  }

  static async getEventDetails(eventId: string): Promise<EventData> {
    const cacheKey = CACHE_KEYS.eventDetails(eventId);

    return eventCache.getOrSet(
      cacheKey,
      () => apiClient.get<EventData>(`/api/v1/events/${eventId}`)
    );
  }

  static async getEvents(): Promise<EventData[]> {
    const cacheKey = CACHE_KEYS.events();

    return eventCache.getOrSet(
      cacheKey,
      () => apiClient.get<EventData[]>(`/api/v1/organizations/events`)
    );
  }

  /**
   * Load authenticated image 
   * (returns blob URL)
   */
  static async loadAuthenticatedImage(cdnUrl: string): Promise<Blob> {
    const response = await apiClient.getRaw(cdnUrl, { method: 'GET' });

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
