'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Photo, EventTheme, AmbilightAnimation, WavePosition } from '../_types';
import { AmbilightConfig, AmbilightPalettes, DefaultColors, Timing } from '../_constants';

type PaletteKey = keyof typeof AmbilightPalettes;

interface Options {
  theme?: EventTheme | null;
  enabled?: boolean;
}

const INITIAL_ANIMATION: AmbilightAnimation = {
  time: 0,
  wave1: { x: 20, y: 80, size: 800 },
  wave2: { x: 80, y: 20, size: 900 },
  wave3: { x: 40, y: 40, size: 700 },
  wave4: { x: 60, y: 70, size: 1000 },
  wave5: { x: 30, y: 30, size: 600 },
};

const DEFAULT_COLORS = [DefaultColors.primary, DefaultColors.secondary, DefaultColors.accent, DefaultColors.primary];

function calcWave(time: number, freq: number, phase: number, amp: number, baseSize: number, variance: number): WavePosition {
  return {
    x: 50 + Math.sin(time * freq) * amp,
    y: 50 + Math.cos(time * (freq - 0.1) + phase) * amp,
    size: baseSize + Math.sin(time * freq * 0.5 + phase) * variance,
  };
}

function getThemeColors(theme?: EventTheme | null): string[] {
  if (!theme) return DEFAULT_COLORS;
  return [theme.primaryColor, theme.secondaryColor, theme.accentColor, theme.backgroundColor1 || theme.primaryColor];
}

export function useAmbilight(_photo: Photo | null, options: Options = {}) {
  const { theme, enabled = true } = options;

  const [animation, setAnimation] = useState<AmbilightAnimation>(INITIAL_ANIMATION);
  const [customPalette, setCustomPalette] = useState<string[] | null>(null);

  const colors = useMemo(() => customPalette ?? getThemeColors(theme), [customPalette, theme]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      setAnimation((prev) => {
        const time = prev.time + AmbilightConfig.ANIMATION_SPEED;
        return {
          time,
          wave1: calcWave(time, 0.8, 0, 40, 800, 200),
          wave2: calcWave(time, 0.7, Math.PI, 45, 900, 250),
          wave3: calcWave(time, 0.9, Math.PI / 2, 30, 700, 150),
          wave4: calcWave(time, 0.4, Math.PI / 4, 35, 1000, 300),
          wave5: calcWave(time, 1.1, Math.PI / 3, 25, 600, 100),
        };
      });
    }, Timing.ANIMATION_FRAME);

    return () => clearInterval(intervalId);
  }, [enabled]);

  const setTheme = useCallback((name: PaletteKey) => {
    setCustomPalette([...AmbilightPalettes[name]]);
  }, []);

  const setRandomTheme = useCallback(() => {
    const keys = Object.keys(AmbilightPalettes) as PaletteKey[];
    setCustomPalette([...AmbilightPalettes[keys[Math.floor(Math.random() * keys.length)]]]);
  }, []);

  return { colors, animation, setTheme, setRandomTheme };
}
