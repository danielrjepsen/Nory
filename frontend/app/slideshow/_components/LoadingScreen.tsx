'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EventTheme } from '../_types';
import { DefaultColors } from '../_constants';

interface Props {
  eventName?: string;
  eventTheme?: EventTheme | null;
}

const PARTICLE_COUNT = 40;

const FEATURES = [
  { icon: 'M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3M21,17H3V5H21V17Z', key: 'bigScreen' },
  { icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.5,8L11,12.5L9.5,11L8,12.5L11,15.5L17,9.5L15.5,8Z', key: 'autoPlay' },
  { icon: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z', key: 'hdQuality' },
];

function getColors(theme?: EventTheme | null) {
  return {
    primary: theme?.primaryColor || DefaultColors.primary,
    secondary: theme?.secondaryColor || DefaultColors.secondary,
    accent: theme?.accentColor || DefaultColors.accent,
  };
}

function getParticleStyle(i: number, colors: ReturnType<typeof getColors>) {
  const size = i % 4 === 0 ? '3px' : i % 4 === 1 ? '4px' : '2px';
  const bg = i % 4 === 0
    ? `radial-gradient(circle, ${colors.primary}CC 0%, transparent 70%)`
    : i % 4 === 1
      ? `radial-gradient(circle, ${colors.secondary}99 0%, transparent 70%)`
      : 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)';
  return {
    left: `${Math.random() * 100}%`,
    width: size,
    height: size,
    background: bg,
    animation: `float ${25 + Math.random() * 20}s linear infinite`,
    animationDelay: `${-Math.random() * 30}s`,
  };
}

function LoadingScreenInner({ eventName, eventTheme }: Props) {
  const { t } = useTranslation('slideshow');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const colors = useMemo(() => getColors(eventTheme), [eventTheme]);

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center overflow-hidden relative"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, ${colors.primary}CC 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, ${colors.accent}99 0%, transparent 45%),
            radial-gradient(circle at 40% 40%, ${colors.primary}80 0%, transparent 50%),
            linear-gradient(135deg, #0f0f23 0%, #1a1625 100%)
          `,
        }}
      >
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <div key={i} className="absolute rounded-full" style={getParticleStyle(i, colors)} />
            ))}
          </div>
        )}

        <div
          className="relative z-10 text-center max-w-lg mx-auto p-12 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}33, ${colors.secondary}1A)`,
              border: `1px solid ${colors.primary}4D`,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.9)">
              <path d="M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3M21,17H3V5H21V17M16,9H8V11H16V9M16,12H8V14H16V12Z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white/95 mb-3">
            {eventName || t('display.loadingScreen.defaultTitle')}
          </h1>

          <p className="text-white/70 mb-12">
            <span style={{ color: `${colors.primary}E6` }} className="font-medium">
              {t('display.loadingScreen.preparing')}
            </span>{' '}
            • {t('display.loadingScreen.loadingMemories')}
          </p>

          <div className="mb-8">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full animate-progress"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}CC 0%, ${colors.secondary}99 50%, rgba(255,255,255,0.4) 100%)`,
                }}
              />
            </div>
            <p className="text-white/70 text-sm mt-5">
              {t('display.loadingScreen.loadingMedia')}
              <span className="inline-block w-5 animate-dots">...</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${colors.primary}15`,
                    border: `1px solid ${colors.primary}25`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.8)">
                    <path d={feature.icon} />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">
                  {t(`display.loadingScreen.features.${feature.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float { from { transform: translateY(100vh) rotate(0deg); } to { transform: translateY(-100vh) rotate(360deg); } }
        @keyframes progress { 0% { width: 0%; } 50%, 100% { width: 100%; } }
        .animate-progress { animation: progress 5s ease-out infinite; }
        .animate-dots { animation: dots 2s steps(4, end) infinite; }
        @keyframes dots { 0%, 20% { content: '.'; } 40% { content: '..'; } 60% { content: '...'; } 90%, 100% { content: ''; } }
      `}</style>
    </>
  );
}

export default memo(LoadingScreenInner);
