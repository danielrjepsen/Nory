'use client';

import React from 'react';
import type { Theme } from '../../services/themes';
import { useThemes } from '../../_hooks/useThemes';
import { ThemeCard } from './ThemeCard';
import { CustomThemeCard } from './CustomThemeCard';

interface ThemeSelectorProps {
  value: string;
  onChange: (theme: string) => void;
  columns?: number;
  onCustomTheme?: () => void;
  customThemeData?: Partial<Theme>;
}

export default function ThemeSelector({
  value,
  onChange,
  columns = 4,
  onCustomTheme,
  customThemeData,
}: ThemeSelectorProps) {
  const { themes, loading, error } = useThemes();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px] text-gray-500">
        Loading themes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className="grid w-full p-4 box-border overflow-visible min-h-fit gap-5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {themes.map((theme) => (
        <ThemeCard
          key={theme.name}
          theme={theme}
          isSelected={value === theme.name}
          onClick={() => onChange(theme.name)}
        />
      ))}

      {onCustomTheme && (
        <CustomThemeCard
          isSelected={value === 'custom'}
          onClick={onCustomTheme}
          customThemeData={customThemeData}
        />
      )}
    </div>
  );
}
