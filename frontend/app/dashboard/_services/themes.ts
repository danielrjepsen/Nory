import { Theme, ThemePreset } from "../_types/theme";
import { getApiUrl } from "@/utils/urls";

interface ThemePresetsResponse {
  success: boolean;
  presets: ThemePreset[];
}

interface ThemeResponse {
  success: boolean;
  theme: Theme;
  message?: string;
}

const THEME_ICONS: Record<string, string> = {
  wedding: '💍',
  birthday: '🎂',
  corporate: '💼',
  'new-year': '🎆',
  baby: '👶',
  custom: '🎨',
};

class ThemeService {
  private cache: ThemePreset[] | null = null;
  private cacheTime: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async getThemePresets(): Promise<Theme[]> {
    if (this.cache && Date.now() - this.cacheTime < this.CACHE_TTL) {
      return this.cache;
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/v1/themes/presets`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch theme presets');
      }

      const data: ThemePresetsResponse = await response.json();

      if (data.success && data.presets) {
        const themesWithIcons = data.presets.map(theme => ({
          ...theme,
          icon: THEME_ICONS[theme.name] || '🎨',
        }));

        this.cache = themesWithIcons;
        this.cacheTime = Date.now();
        return themesWithIcons;
      }

      return [];
    } catch (error) {
      console.error('Error fetching theme presets:', error);
      return [];
    }
  }

  async getTheme(name: string): Promise<Theme | undefined> {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/themes/${name}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return undefined;
      }

      const data: ThemeResponse = await response.json();

      if (data.success && data.theme) {
        return {
          ...data.theme,
          icon: THEME_ICONS[data.theme.name] || '🎨',
        };
      }

      return undefined;
    } catch (error) {
      console.error('Error fetching theme:', error);
      return undefined;
    }
  }

  async saveCustomTheme(theme: Partial<Theme>): Promise<Theme> {
    const response = await fetch(`${getApiUrl()}/api/v1/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(theme),
    });

    if (!response.ok) {
      throw new Error('Failed to save theme');
    }

    const data: ThemeResponse = await response.json();
    this.cache = null;

    return data.theme;
  }

  clearCache(): void {
    this.cache = null;
    this.cacheTime = 0;
  }
}

export const themeService = new ThemeService();
