import { useState, useEffect } from 'react';
import type { Theme } from '../services/themes';

const DEFAULT_THEME: Partial<Theme> = {
  name: 'custom',
  displayName: 'Custom Theme',
  description: 'Your personalized color palette',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
  backgroundColor1: '#f8fafc',
  backgroundColor2: '#f1f5f9',
  backgroundColor3: '#e2e8f0',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textAccent: '#3b82f6',
  primaryFont: 'Inter',
  secondaryFont: 'Inter',
};

export function useCustomTheme(initialTheme?: Partial<Theme>) {
  const [themeData, setThemeData] = useState<Partial<Theme>>(DEFAULT_THEME);

  useEffect(() => {
    if (initialTheme) {
      setThemeData({ ...DEFAULT_THEME, ...initialTheme });
    }
  }, [initialTheme]);

  const updateColor = (field: keyof Theme, value: string) => {
    setThemeData((prev) => ({ ...prev, [field]: value }));
  };

  const resetTheme = () => {
    setThemeData(DEFAULT_THEME);
  };

  return {
    themeData,
    updateColor,
    resetTheme,
  };
}
