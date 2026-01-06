import { getApiUrl } from '@/utils/urls';

export const Config = {
  apiBaseUrl: getApiUrl(),
} as const;

export const SlideshowSpeed = {
  FAST: 2000,
  NORMAL: 5000,
  SLOW: 8000,
  DEFAULT: 5000,
} as const;

export const Timing = {
  POST_VIDEO_DELAY: 1000,
  MANUAL_ACTION_DEBOUNCE: 800,
  INITIAL_SYNC_DELAY: 10_000,
  AUTO_SYNC_INTERVAL: 15 * 60 * 1000,
  ANIMATION_FRAME: 16,
} as const;

export const HeartAnimation = {
  MIN_DURATION: 7000,
  MAX_DURATION: 8000,
  MAX_DELAY: 300,
  MIN_SCALE: 0.9,
  MAX_SCALE: 1.2,
  PERSISTENCE: 12_000,
} as const;

export const AmbilightConfig = {
  PRIMARY_BLUR: 120,
  SECONDARY_BLUR: 200,
  TERTIARY_BLUR: 300,
  ANIMATION_SPEED: 0.01,
} as const;

export const Limits = {
  MAX_ACTIVITIES: 20,
  MAX_PROCESSED_HEARTS: 100,
  PHOTOS_PER_FETCH: 100,
  MAX_CONNECTION_RETRIES: 20,
} as const;

export const VideoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.ogv', '.3gp', '.flv', '.wmv', '.m4v'] as const;

export const VideoMimeTypes: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
};

export const AmbilightPalettes = {
  goldenHour: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42'],
  royalBlue: ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6'],
  forestMist: ['#064e3b', '#065f46', '#047857', '#059669'],
  oceanDepth: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9'],
  lavenderDream: ['#581c87', '#7c3aed', '#8b5cf6', '#a78bfa'],
  roseGold: ['#BE5A83', '#E91E63', '#FF6B9D', '#FF8E9E'],
  minimalistChic: ['#0f172a', '#1e293b', '#334155', '#475569'],
  weddingElegance: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
} as const;

export const DefaultColors = {
  primary: '#B19CD9',
  secondary: '#9F84C7',
  accent: '#E8B4FF',
  background: '#0f0f23',
} as const;

export const MediaDisplay = {
  VIDEO_MAX_WIDTH: 'min(92vw, 1600px)',
  VIDEO_MAX_HEIGHT: 'min(85vh, 1100px)',
  IMAGE_MAX_WIDTH: 'min(95vw, 1800px)',
  IMAGE_MAX_HEIGHT: 'min(90vh, 1200px)',
} as const;

export const ParticleConfig = {
  COUNT: 40,
  MIN_ANIMATION_DURATION: 25,
  MAX_ANIMATION_DURATION: 45,
  SIZES: [2, 3, 4],
} as const;
