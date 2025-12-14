// Shared types barrel export

// Re-export dashboard types that are commonly used
export type {
  EventData,
  EventPhoto,
  EventStatus,
  EventAnalytics,
  CreateEventRequest,
} from '@/app/dashboard/_types/events';

export type { Theme, ThemePreset } from '@/app/dashboard/_types/theme';

// Export guest-specific types
export * from './guest';
