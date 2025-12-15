import { Theme } from '../_types/theme';
import { darkenColor, addAlpha } from './colorUtils';

export function getDarkBackground(theme: Partial<Theme>): string {
  if (theme.darkBackgroundGradient) {
    return theme.darkBackgroundGradient;
  }

  if (theme.primaryColor && theme.secondaryColor) {
    const darkPrimary = darkenColor(theme.primaryColor, 0.85);
    const darkSecondary = darkenColor(theme.secondaryColor, 0.85);
    return `linear-gradient(135deg, ${darkPrimary} 0%, ${darkSecondary} 100%)`;
  }

  return 'linear-gradient(135deg, #0f0f23 0%, #1a1625 50%, #2d1b69 100%)';
}

export function getThemeColors(theme: Partial<Theme>): string[] {
  if (theme.primaryColor && theme.secondaryColor) {
    return [
      addAlpha(theme.primaryColor, '40'),
      addAlpha(theme.secondaryColor, '30'),
      addAlpha(theme.accentColor || theme.primaryColor, '20'),
      'rgba(255, 255, 255, 0.6)',
      'rgba(255, 255, 255, 0.4)',
    ];
  }
  return ['rgba(255, 255, 255, 0.6)', 'rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.5)'];
}

export function getDefaultTheme(): Theme {
  return {
    name: 'default',
    displayName: 'Default',
    description: 'Default theme',
    icon: '🎨',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    primaryFont: 'Inter',
  };
}
