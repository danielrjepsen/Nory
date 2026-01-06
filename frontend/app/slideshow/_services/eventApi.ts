import { publicApi } from '@/lib/api/public';
import type { ApiPhoto, EventData, EventTheme, Category } from '../_types';
import { Limits } from '../_constants';

const Endpoints = {
  photos: (id: string) => `/api/v1/events/${id}/photos`,
  categories: (id: string) => `/api/v1/events/${id}/photos/categories`,
  eventPublic: (id: string) => `/api/v1/events/public/${id}`,
  templatePublic: (id: string) => `/api/v1/events/public/${id}/template`,
  template: (id: string) => `/api/v1/events/${id}/template`,
} as const;

interface Options {
  signal?: AbortSignal;
  preview?: boolean;
}

interface PhotosResponse {
  photos: ApiPhoto[];
}

interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

interface ThemeResponse {
  template?: EventTheme;
}

export async function fetchEventPhotos(eventId: string, categoryId?: string, options?: Options): Promise<ApiPhoto[]> {
  const res = await publicApi.get<PhotosResponse>(Endpoints.photos(eventId), {
    params: { limit: Limits.PHOTOS_PER_FETCH, categoryId, preview: options?.preview },
    signal: options?.signal,
  });
  return res.photos || [];
}

export async function fetchEventData(eventId: string, options?: Options): Promise<EventData> {
  return publicApi.get<EventData>(Endpoints.eventPublic(eventId), {
    params: { preview: options?.preview },
    signal: options?.signal,
  });
}

export async function fetchEventTheme(eventId: string, options?: Options): Promise<EventTheme | null> {
  try {
    const res = await publicApi.get<ThemeResponse>(Endpoints.templatePublic(eventId), { signal: options?.signal });
    if (res.template) return res.template;
  } catch { }

  try {
    const res = await publicApi.get<ThemeResponse>(Endpoints.template(eventId), { signal: options?.signal });
    if (res.template) return res.template;
  } catch { }

  return null;
}

export async function fetchEventCategories(eventId: string, options?: Options): Promise<Category[]> {
  const res = await publicApi.get<CategoriesResponse>(Endpoints.categories(eventId), { signal: options?.signal });
  return res.success && res.categories ? [...res.categories].sort((a, b) => a.sortOrder - b.sortOrder) : [];
}
