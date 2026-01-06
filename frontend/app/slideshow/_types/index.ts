export type MediaType = 'image' | 'video';

export interface Photo {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly categoryId: string | null;
  readonly type: MediaType;
  readonly mimeType?: string;
  readonly thumbnailUrl?: string;
  readonly duration?: number;
  readonly uploadedAt?: string;
}

export interface ApiPhoto {
  readonly id: string;
  readonly imageUrl: string;
  readonly originalFileName: string;
  readonly uploadedBy: string;
  readonly categoryId: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly createdAt: string;
}

export type EventStatus = 'draft' | 'live' | 'ended' | 'archived';

export interface EventData {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly startsAt?: string;
  readonly endsAt?: string;
  readonly status: EventStatus;
  readonly isPublic: boolean;
  readonly isPreview?: boolean;
}

export interface EventTheme {
  readonly id?: string;
  readonly name?: string;
  readonly themeName?: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly accentColor: string;
  readonly backgroundColor1?: string;
  readonly backgroundColor2?: string;
  readonly backgroundColor3?: string;
  readonly primaryFont?: string;
  readonly secondaryFont?: string;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly sortOrder: number;
  readonly isDefault: boolean;
}

export interface Heart {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly userName: string;
  readonly timestamp: number;
}

export interface AnimatingHeart extends Heart {
  readonly animationKey: string;
  readonly startTime: number;
  readonly randomX: number;
  readonly randomDelay: number;
  readonly randomDuration: number;
  readonly randomScale: number;
}

export type ActivityType = 'system' | 'upload' | 'heart' | 'playback' | 'speed' | 'category';

export interface Activity {
  readonly id: string;
  readonly type: ActivityType;
  readonly message: string;
  readonly userName: string;
  readonly timestamp: number;
}

export interface SlideshowState {
  readonly currentIndex: number;
  readonly isPlaying: boolean;
  readonly speed: number;
  readonly selectedCategory: string | null;
}

export interface SlideshowControls {
  readonly moveToNext: () => void;
  readonly moveToPrevious: () => void;
  readonly setPlaying: (playing: boolean) => void;
  readonly setSpeed: (speed: number) => void;
  readonly setCategory: (categoryId: string | null) => void;
}

export type RemoteCommandType = 'next' | 'previous' | 'play' | 'pause' | 'speed' | 'category';

export interface RemoteCommand {
  readonly type: RemoteCommandType;
  readonly payload?: unknown;
  readonly controllerId: string;
  readonly userName: string;
  readonly timestamp: number;
}

export interface WavePosition {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

export interface AmbilightAnimation {
  readonly time: number;
  readonly wave1: WavePosition;
  readonly wave2: WavePosition;
  readonly wave3: WavePosition;
  readonly wave4: WavePosition;
  readonly wave5: WavePosition;
}
