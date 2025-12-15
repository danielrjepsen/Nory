'use client';

import React, { useState, useEffect } from 'react';
import { useThemes } from '../../_hooks/useThemes';
import { getDarkBackground, getThemeColors, getDefaultTheme } from '../../_utils/themeHelpers';
import AnimatedBackground from '../ui/AnimatedBackground';
import FloatingParticles from '../ui/FloatingParticles';
import { PreviewCard } from './PreviewCard';
import { Theme } from '../../_types/theme';

interface ThemePreviewProps {
  eventName: string;
  eventDescription: string;
  startsAt: string;
  themeName: string;
  style?: React.CSSProperties;
  customThemeData?: Partial<Theme>;
}

export default function ThemePreview({
  eventName,
  eventDescription,
  startsAt,
  themeName,
  style = {},
  customThemeData,
}: ThemePreviewProps) {
  const { themes, loading } = useThemes();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading) {
    return (
      <div
        className="h-full w-full flex items-center justify-center p-10 text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ...style,
        }}
      >
        Loading preview...
      </div>
    );
  }

  // Use custom theme if selected, otherwise find from presets
  const selectedTheme =
    themeName === 'custom' && customThemeData
      ? (customThemeData as Theme)
      : themes.find((t) => t.name === themeName) || themes[0] || getDefaultTheme();

  if (!selectedTheme) {
    return (
      <div
        className="h-full w-full flex items-center justify-center p-10 text-gray-500"
        style={{ background: '#f3f4f6', ...style }}
      >
        Theme not found
      </div>
    );
  }

  const darkBg = getDarkBackground(selectedTheme);
  const themeColors = getThemeColors(selectedTheme);

  return (
    <AnimatedBackground
      gradient={darkBg}
      colors={themeColors}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        ...style,
      }}
    >
      <FloatingParticles colors={themeColors} particleCount={40} types={['particle', 'star']} />

      <PreviewCard
        eventName={eventName}
        eventDescription={eventDescription}
        startsAt={startsAt}
        theme={selectedTheme}
      />
    </AnimatedBackground>
  );
}
