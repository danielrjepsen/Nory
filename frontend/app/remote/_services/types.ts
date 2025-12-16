import type { Photo, Category } from '@/app/_shared/types';

export interface EventTemplateResponse {
  name: string;
  displayName?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor1?: string;
  backgroundColor2?: string;
  backgroundColor3?: string;
  textPrimary?: string;
  textSecondary?: string;
  textAccent?: string;
  primaryFont?: string;
  secondaryFont?: string;
  darkBackgroundGradient?: string;
  darkParticleColors?: string;
}

export interface CreateGuestbookEntryData {
  name: string;
  message: string;
  email?: string;
  hasPhoto: boolean;
}

export interface PhotosResponse {
  photos: Photo[];
  totalCount: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}
