import { apiClient } from '@/lib/api';
import { eventCache, analyticsCache } from './cache';
import type { CreateEventRequest, EventData, EventPhoto } from '../_types/events';

const Endpoints = {
  events: '/api/v1/events',
  event: (id: string) => `/api/v1/events/${id}`,
  photos: (id: string) => `/api/v1/events/${id}/photos/dashboard`,
  attendees: (id: string) => `/api/v1/events/${id}/attendees`,
  analytics: (id: string) => `/api/v1/events/${id}/analytics`,
  start: (id: string) => `/api/v1/events/${id}/start`,
  end: (id: string) => `/api/v1/events/${id}/end`,
} as const;

const CacheKeys = {
  events: 'events',
  event: (id: string) => `event:${id}`,
  photos: (id: string, limit: number) => `photos:${id}:${limit}`,
} as const;

interface PhotosResponse {
  photos: EventPhoto[];
  totalCount: number;
}

export interface EventAttendee {
  id: string;
  name: string;
  email: string | null;
  hasPhotoRevealConsent: boolean;
  registeredAt: string;
}

export interface EventAttendeeListResponse {
  attendees: EventAttendee[];
  totalCount: number;
}

export async function getEvents(): Promise<EventData[]> {
  return eventCache.getOrSet(CacheKeys.events, () => apiClient.get<EventData[]>(Endpoints.events));
}

export async function getEventDetails(eventId: string): Promise<EventData> {
  return eventCache.getOrSet(CacheKeys.event(eventId), () => apiClient.get<EventData>(Endpoints.event(eventId)));
}

export async function getEventPhotos(eventId: string, limit = 6): Promise<EventPhoto[]> {
  return eventCache.getOrSet(CacheKeys.photos(eventId, limit), async () => {
    const res = await apiClient.get<PhotosResponse>(Endpoints.photos(eventId), { params: { limit } });
    return (res.photos || []).slice(0, limit);
  });
}

export async function getEventAttendees(eventId: string): Promise<EventAttendeeListResponse> {
  return apiClient.get<EventAttendeeListResponse>(Endpoints.attendees(eventId));
}

export interface EventAnalyticsResponse {
  photoCount: number;
  guestCount: number;
  visitCount: number;
}

export async function getEventAnalytics(eventId: string): Promise<EventAnalyticsResponse> {
  try {
    return await apiClient.get<EventAnalyticsResponse>(Endpoints.analytics(eventId));
  } catch {
    const event = await getEventDetails(eventId);
    return {
      photoCount: event.photoCount || event.analytics?.totalPhotosUploaded || 0,
      guestCount: event.analytics?.totalGuestAppOpens || 0,
      visitCount: event.analytics?.totalQrScans || 0,
    };
  }
}

export async function createEvent(event: CreateEventRequest): Promise<EventData> {
  return apiClient.post<EventData>(Endpoints.events, event);
}

export async function updateEvent(eventId: string, updates: Partial<CreateEventRequest>): Promise<EventData> {
  invalidateEvent(eventId);
  return apiClient.patch<EventData>(Endpoints.event(eventId), updates);
}

export async function deleteEvent(eventId: string): Promise<void> {
  invalidateEvent(eventId);
  await apiClient.delete(Endpoints.event(eventId));
}

export async function startEvent(eventId: string): Promise<EventData> {
  invalidateEvent(eventId);
  return apiClient.post<EventData>(Endpoints.start(eventId), {});
}

export async function endEvent(eventId: string): Promise<EventData> {
  invalidateEvent(eventId);
  return apiClient.post<EventData>(Endpoints.end(eventId), {});
}

export async function loadAuthenticatedImage(imageUrl: string): Promise<Blob> {
  const res = await apiClient.getRaw(imageUrl);
  if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
  return res.blob();
}

export function invalidateEvent(eventId: string): void {
  eventCache.delete(CacheKeys.events);
  eventCache.delete(CacheKeys.event(eventId));
  eventCache.invalidateByPrefix(`photos:${eventId}:`);
  // Also clear analytics cache to refresh dashboard overview
  analyticsCache.delete('dashboard:overview');
  analyticsCache.invalidateByPrefix(`summary:${eventId}:`);
}

export function clearCache(): void {
  eventCache.clear();
}
