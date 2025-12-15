import { apiClient } from '@/lib/api';
import type { Theme, ThemePreset } from '../_types/theme';

const Endpoints = {
  presets: '/api/v1/themes/presets',
  theme: (name: string) => `/api/v1/themes/${name}`,
  themes: '/api/v1/themes',
} as const;

const ICONS: Record<string, string> = {
  wedding: '💍',
  birthday: '🎂',
  corporate: '💼',
  'new-year': '🎆',
  baby: '👶',
  custom: '🎨',
};

interface PresetsResponse {
  success: boolean;
  presets: ThemePreset[];
}

interface ThemeResponse {
  success: boolean;
  theme: Theme;
}

let cache: ThemePreset[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

const addIcon = <T extends { name: string }>(theme: T): T & { icon: string } => ({
  ...theme,
  icon: ICONS[theme.name] || '🎨',
});

export async function getThemePresets(): Promise<Theme[]> {
  if (cache && Date.now() - cacheTime < CACHE_TTL) return cache;

  try {
    const res = await apiClient.get<PresetsResponse>(Endpoints.presets);
    if (res.success && res.presets) {
      cache = res.presets.map(addIcon);
      cacheTime = Date.now();
      return cache;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getTheme(name: string): Promise<Theme | undefined> {
  try {
    const res = await apiClient.get<ThemeResponse>(Endpoints.theme(name));
    return res.success && res.theme ? addIcon(res.theme) : undefined;
  } catch {
    return undefined;
  }
}

export async function saveCustomTheme(theme: Partial<Theme>): Promise<Theme> {
  const res = await apiClient.post<ThemeResponse>(Endpoints.themes, theme);
  cache = null;
  return res.theme;
}

export function clearCache(): void {
  cache = null;
  cacheTime = 0;
}
