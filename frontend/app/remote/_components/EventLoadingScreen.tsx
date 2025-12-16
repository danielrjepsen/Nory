'use client';

import { useTranslation } from 'react-i18next';
import type { PublicEventData } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/types';
import { BackgroundParticles } from './BackgroundParticles';
import { NoryLogo } from '@/components/icons/NoryLogo';

interface EventLoadingScreenProps {
  eventTheme: EventTheme | null;
  eventData?: PublicEventData | null;
}

function generateBackground(theme: EventTheme | null): string {
  if (!theme) return '';
  const { primaryColor, secondaryColor, accentColor, backgroundColor1 = '#0f0f23' } = theme;
  return `
    radial-gradient(circle at 20% 80%, ${primaryColor}4D 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${secondaryColor}4D 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, ${accentColor}33 0%, transparent 50%),
    linear-gradient(135deg, ${backgroundColor1} 0%, #1a1625 100%)
  `.trim();
}

function generateProgressGradient(theme: EventTheme | null): string {
  if (theme) {
    return `linear-gradient(90deg, ${theme.primaryColor}CC 0%, ${theme.secondaryColor}99 50%, rgba(255, 255, 255, 0.4) 100%)`;
  }
  return 'linear-gradient(90deg, rgba(255, 119, 198, 0.8) 0%, rgba(120, 119, 198, 0.6) 50%, rgba(255, 255, 255, 0.4) 100%)';
}

function formatDate(date?: string): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function EventLoadingScreen({ eventTheme, eventData }: EventLoadingScreenProps) {
  const { t } = useTranslation('remote');

  const primaryColor = eventTheme?.primaryColor || 'rgba(255, 119, 198, 0.9)';
  const logoGradient = eventTheme
    ? `linear-gradient(135deg, ${eventTheme.primaryColor}33, ${eventTheme.secondaryColor}1A)`
    : 'linear-gradient(135deg, rgba(255, 119, 198, 0.2), rgba(120, 119, 198, 0.1))';
  const logoBorder = eventTheme
    ? `1px solid ${eventTheme.primaryColor}4D`
    : '1px solid rgba(255, 119, 198, 0.3)';
  const logoShadow = eventTheme
    ? `0 20px 40px ${eventTheme.primaryColor}1A, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
    : '0 20px 40px rgba(255, 119, 198, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';

  const isWedding = eventData?.name?.toLowerCase().includes('wedding') ||
    eventData?.name?.toLowerCase().includes('bryllup');

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: generateBackground(eventTheme) || undefined }}
    >
      <BackgroundParticles eventTheme={eventTheme} isMounted />

      <div className="text-center z-10 relative max-w-[580px] py-[70px] px-[50px] bg-white/[0.02] backdrop-blur-[40px] rounded-[32px] border border-white/[0.08] shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all duration-500">
        <div
          className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center relative overflow-hidden transition-all duration-500"
          style={{ background: logoGradient, border: logoBorder, boxShadow: logoShadow }}
        >
          <NoryLogo fill="rgba(255, 255, 255, 0.9)" />
        </div>

        <h1 className="text-white/95 text-4xl font-bold mb-3 opacity-0 tracking-tight leading-tight animate-fade-in-up [animation-delay:0.5s]">
          {eventData?.name || t('common.loadingEvent')}
        </h1>

        <p className="text-white/70 text-base mb-12 opacity-0 leading-relaxed animate-fade-in-up [animation-delay:0.7s]">
          <span className="font-medium" style={{ color: `${primaryColor}E6` }}>
            {formatDate(eventData?.startsAt) || t('common.loadingDate')}
          </span>
          {' • '}
          {eventData ? t('common.preparingMemories') : t('common.loadingEventDetails')}
        </p>

        <div className="mb-8 opacity-0 animate-fade-in-up [animation-delay:0.9s]">
          <div className="w-full h-1 bg-white/5 rounded-xl overflow-hidden relative backdrop-blur-sm">
            <div
              className="h-full rounded-xl w-0 relative animate-progress"
              style={{ background: generateProgressGradient(eventTheme) }}
            />
          </div>
          <div className="text-white/70 text-sm mt-5 opacity-0 animate-fade-in-up [animation-delay:1.1s]">
            {isWedding ? t('common.loadingWeddingGallery') : t('common.loadingGallery')}
            <span className="inline-block w-5 animate-dots">...</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 5s ease-out infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
        .animate-dots {
          animation: dots 2s steps(4, end) infinite;
        }
      `}</style>
    </div>
  );
}
