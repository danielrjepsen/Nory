'use client';

import { useEffect, type ReactNode } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { type EventTheme, DEFAULT_THEME } from '../_hooks/types';

interface ThemeWrapperProps {
  eventTheme: EventTheme | null;
  isMounted: boolean;
  children: ReactNode;
}

const CSS_VARS = ['--theme-primary', '--theme-secondary', '--theme-accent'] as const;

function generateBackground(theme: EventTheme): string {
  return `
    radial-gradient(circle at 20% 80%, ${theme.primaryColor}4D 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${theme.secondaryColor}4D 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, ${theme.accentColor}33 0%, transparent 50%),
    linear-gradient(135deg, #0f0f23 0%, #1a1625 100%)
  `.trim();
}

export function ThemeWrapper({ eventTheme, isMounted, children }: ThemeWrapperProps) {
  useEffect(() => {
    const theme = eventTheme ?? DEFAULT_THEME;
    const root = document.documentElement;

    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);

    document.body.style.background = generateBackground(theme);
    document.body.style.color = 'white';

    return () => {
      CSS_VARS.forEach((v) => root.style.removeProperty(v));
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [eventTheme]);

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles eventTheme={eventTheme} isMounted={isMounted} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}