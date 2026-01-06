import type { Photo, ApiPhoto, MediaType } from '../_types';
import { VideoExtensions, VideoMimeTypes, Config } from '../_constants';

const isVideo = (filename: string) => VideoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));

const fullUrl = (url: string) => url.startsWith('http') ? url : `${Config.apiBaseUrl}${url}`;

export function getMediaType(photo: { name?: string; type?: string; mimeType?: string }): MediaType {
  if (photo.type === 'video') return 'video';
  if (photo.mimeType?.startsWith('video/')) return 'video';
  if (photo.name && isVideo(photo.name)) return 'video';
  return 'image';
}

export function getMimeType(filename: string): string {
  const lower = filename.toLowerCase();
  for (const [ext, mime] of Object.entries(VideoMimeTypes)) {
    if (lower.endsWith(ext)) return mime;
  }
  return isVideo(filename) ? 'video/mp4' : 'image/jpeg';
}

export function transformApiPhoto(apiPhoto: ApiPhoto): Photo {
  const name = apiPhoto.originalFileName || '';
  return {
    id: apiPhoto.id,
    name,
    url: fullUrl(apiPhoto.imageUrl),
    categoryId: apiPhoto.categoryId,
    type: isVideo(name) ? 'video' : 'image',
    uploadedAt: apiPhoto.createdAt,
    mimeType: getMimeType(name),
  };
}

export function transformApiPhotos(apiPhotos: ApiPhoto[]): Photo[] {
  return apiPhotos.map(transformApiPhoto);
}
