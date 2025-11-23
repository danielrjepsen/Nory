// Theme types
export interface Theme {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  primaryFont: string;
  secondaryFont?: string;
  backgroundColor1?: string;
  backgroundColor2?: string;
  backgroundColor3?: string;
  textPrimary?: string;
  textSecondary?: string;
  textAccent?: string;
  darkBackgroundGradient?: string;
  darkParticleColors?: string;
}

const THEME_PRESETS: Theme[] = [
  {
    name: 'wedding',
    displayName: 'Wedding',
    description: 'Elegant and romantic theme for weddings',
    icon: '💍',
    primaryColor: '#EC4899',
    secondaryColor: '#C9B6E4',
    accentColor: '#FCD34D',
    primaryFont: 'Playfair Display, serif',
    secondaryFont: 'Inter, sans-serif',
  },
  {
    name: 'birthday',
    displayName: 'Birthday',
    description: 'Fun and colorful theme for birthdays',
    icon: '🎂',
    primaryColor: '#F59E0B',
    secondaryColor: '#EC4899',
    accentColor: '#8B5CF6',
    primaryFont: 'Poppins, sans-serif',
  },
  {
    name: 'corporate',
    displayName: 'Corporate',
    description: 'Professional theme for business events',
    icon: '💼',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    primaryFont: 'Inter, sans-serif',
  },
  {
    name: 'party',
    displayName: 'Party',
    description: 'Vibrant theme for celebrations',
    icon: '🎉',
    primaryColor: '#A855F7',
    secondaryColor: '#EC4899',
    accentColor: '#F59E0B',
    primaryFont: 'Rubik, sans-serif',
  },
];

class ThemeService {
  /**
   * Get all available theme presets
   */
  async getThemePresets(): Promise<Theme[]> {
    // TODO: Replace with actual API call
    return Promise.resolve(THEME_PRESETS);
  }

  /**
   * Get a specific theme by name
   */
  async getTheme(name: string): Promise<Theme | undefined> {
    // TODO: Replace with actual API call
    return Promise.resolve(THEME_PRESETS.find(t => t.name === name));
  }

  /**
   * Save a custom theme
   */
  async saveCustomTheme(theme: Partial<Theme>): Promise<Theme> {
    // TODO: Implement API call to save custom theme
    return Promise.resolve(theme as Theme);
  }
}

export const themeService = new ThemeService();
