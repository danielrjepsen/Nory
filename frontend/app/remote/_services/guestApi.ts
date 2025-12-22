import { publicApi } from '@/lib/api';
import type {
  Photo,
  PublicEventData,
  EventApp,
  GuestbookEntry,
  AttendeeStatus,
  RegisterAttendeeRequest,
  RegisterAttendeeResponse,
  UpdateConsentRequest,
} from '@/app/_shared/types';
import type {
  EventTemplateResponse,
  CreateGuestbookEntryData,
  PhotosResponse,
  CategoriesResponse,
} from './types';

export type { EventTemplateResponse, CreateGuestbookEntryData } from './types';

const ENDPOINTS = {
  publicEvent: (eventId: string) => `/api/v1/events/public/${eventId}`,
  eventApps: (eventId: string) => `/api/v1/events/${eventId}/apps`,
  eventTemplate: (eventId: string) => `/api/v1/events/public/${eventId}/template`,
  photos: (eventId: string) => `/api/v1/events/${eventId}/photos`,
  photoCategories: (eventId: string) => `/api/v1/events/${eventId}/photos/categories`,
  attendeeStatus: (eventId: string) => `/api/v1/attendees/events/${eventId}/status`,
  registerAttendee: (eventId: string) => `/api/v1/attendees/events/${eventId}`,
  attendeeConsent: (eventId: string) => `/api/v1/attendees/events/${eventId}/consent`,
  appContent: (eventId: string, appInstanceId: string) =>
    `/api/v1/events/${eventId}/apps/${appInstanceId}/content`,
  analytics: (eventId: string) => `/api/v1/analytics/events/${eventId}/track`,
} as const;

export async function getPublicEvent(eventId: string): Promise<PublicEventData> {
  return publicApi.get<PublicEventData>(ENDPOINTS.publicEvent(eventId));
}

export async function getEventApps(eventId: string): Promise<EventApp[]> {
  return publicApi.get<EventApp[]>(ENDPOINTS.eventApps(eventId));
}

export async function getEventTemplate(
  eventId: string
): Promise<{ template: EventTemplateResponse | null }> {
  return publicApi.get<{ template: EventTemplateResponse | null }>(
    ENDPOINTS.eventTemplate(eventId)
  );
}

export async function getPhotos(eventId: string, limit = 50): Promise<Photo[]> {
  const response = await publicApi.get<PhotosResponse>(ENDPOINTS.photos(eventId), {
    params: { limit },
  });
  return response.photos ?? [];
}

export async function uploadPhoto(
  eventId: string,
  formData: FormData
): Promise<{ success: boolean }> {
  return publicApi.post<{ success: boolean }>(ENDPOINTS.photos(eventId), formData);
}

export async function getPhotoCategories(eventId: string): Promise<CategoriesResponse> {
  return publicApi.get<CategoriesResponse>(ENDPOINTS.photoCategories(eventId));
}

export async function getAttendeeStatus(eventId: string): Promise<AttendeeStatus> {
  return publicApi.get<AttendeeStatus>(ENDPOINTS.attendeeStatus(eventId));
}

export async function registerAttendee(
  eventId: string,
  data: RegisterAttendeeRequest
): Promise<RegisterAttendeeResponse> {
  return publicApi.post<RegisterAttendeeResponse>(ENDPOINTS.registerAttendee(eventId), data);
}

export async function updateAttendeeConsent(
  eventId: string,
  data: UpdateConsentRequest
): Promise<{ success: boolean; message: string }> {
  return publicApi.patch<{ success: boolean; message: string }>(
    ENDPOINTS.attendeeConsent(eventId),
    data
  );
}

export async function getGuestbookEntries(
  eventId: string,
  appInstanceId: string
): Promise<GuestbookEntry[]> {
  return publicApi.get<GuestbookEntry[]>(ENDPOINTS.appContent(eventId, appInstanceId), {
    params: { contentType: 'guestbook', status: 'active' },
  });
}

export async function createGuestbookEntry(
  eventId: string,
  appInstanceId: string,
  data: CreateGuestbookEntryData
): Promise<{ success: boolean; id: string }> {
  return publicApi.post<{ success: boolean; id: string }>(
    ENDPOINTS.appContent(eventId, appInstanceId),
    { contentType: 'guestbook', data }
  );
}

export async function trackEvent(
  eventId: string,
  eventType: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    await publicApi.post(ENDPOINTS.analytics(eventId), { eventType, data });
  } catch {
    // silent
  }
}
