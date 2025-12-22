import type { PublicEventData, AppData } from '@/app/_shared/types';

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor1?: string;
  backgroundColor2?: string;
  backgroundColor3?: string;
  textPrimary?: string;
  textSecondary?: string;
  textAccent?: string;
  primaryFont?: string;
  secondaryFont?: string;
  themeName?: string;
  darkBackgroundGradient?: string;
  darkParticleColors?: string;
}

export interface BaseAppProps {
  eventId: string;
  eventData: PublicEventData;
  appData: AppData;
  eventTheme?: EventTheme | null;
}
