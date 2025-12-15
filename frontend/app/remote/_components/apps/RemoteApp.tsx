'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import type { BaseAppProps } from './types';

interface RemoteAppProps extends BaseAppProps {}

export function RemoteApp({ eventId, eventData, eventTheme }: RemoteAppProps) {
  const router = useRouter();
  const { t } = useTranslation('remote');
  const [hasControl, setHasControl] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [activeGallery, setActiveGallery] = useState(0);

  const galleries = ['Ceremony Highlights', 'Reception Moments', 'Party Time'];

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navigatedFromApp', 'true');
      router.push(`/remote/${eventId}`);
    }
  };

  const primaryColor = eventTheme?.primaryColor || '#667EEA';
  const secondaryColor = eventTheme?.secondaryColor || '#764BA2';

  return (
    <>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          background: linear-gradient(180deg, #FDFCFB 0%, #F5F2F0 100%);
          color: #1a1a1a;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <header
        className="fixed top-0 left-0 right-0 z-50 px-5 pt-6 pb-5"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-[500px] mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-white/20 text-white transition-all duration-300 hover:bg-white/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-white text-[17px] font-bold tracking-wide mb-0.5">
              {eventData?.name || t('apps.remote.title')}
            </div>
            <div className="text-white/90 text-xs font-medium">{t('apps.remote.title').toUpperCase()}</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full border border-white/30">
            <div
              className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_0_2px_rgba(52,199,89,0.2)]"
              style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
            />
            <span className="text-[11px] font-semibold text-white uppercase tracking-wide">
              {t('apps.header.live')}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[440px] mx-auto px-5 pt-[110px] pb-10">
        <div className="bg-black rounded-[28px] p-[3px] mb-7 shadow-[0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-[25px] p-6 relative min-h-[200px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.01) 2px, rgba(255, 255, 255, 0.01) 4px)'
            }} />

            <div className="text-center z-10 relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-5 border border-white/10">
                <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
                  {t('apps.remote.nowPlaying')}
                </span>
              </div>
              <div className="text-2xl font-light text-white/95 mb-2 tracking-tight">
                {galleries[activeGallery]}
              </div>
              <div className="text-[13px] text-white/60 font-medium">
                42 photos • 3 videos
              </div>
            </div>

            <div className="absolute bottom-5 right-6 text-xs text-white/40 font-mono">
              2:34 / 5:20
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.04),0_2px_10px_rgba(0,0,0,0.02)] border border-black/[0.03]">
          <button
            onClick={() => setHasControl(!hasControl)}
            className="w-full py-4.5 text-white rounded-[18px] text-[15px] font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 uppercase"
            style={{
              background: hasControl
                ? 'linear-gradient(135deg, #34C759, #30B350)'
                : 'linear-gradient(135deg, #B19CD9, #9F84C7)',
              boxShadow: hasControl
                ? '0 10px 25px rgba(52, 199, 89, 0.25), 0 5px 10px rgba(52, 199, 89, 0.2)'
                : '0 10px 25px rgba(177, 156, 217, 0.25), 0 5px 10px rgba(177, 156, 217, 0.2)',
            }}
          >
            <span>{hasControl ? '✓' : '🎮'}</span>
            <span>{hasControl ? t('apps.remote.inControl') : t('apps.remote.takeControl')}</span>
          </button>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <ControlButton icon="⏮" label={t('apps.remote.previous')} />
            <ControlButton
              icon={isPaused ? '⏸' : '▶️'}
              label={isPaused ? t('apps.remote.pause') : t('apps.remote.play')}
              isPrimary
              onClick={() => setIsPaused(!isPaused)}
            />
            <ControlButton icon="⏭" label={t('apps.remote.next')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <ActionButton icon="❤️" label={t('apps.remote.favorite')} color="red" />
          <ActionButton icon="✨" label={t('apps.remote.addMemory')} color="green" />
        </div>

        <div className="bg-gradient-to-br from-white/90 to-white/95 backdrop-blur border border-black/[0.04] rounded-[20px] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t('apps.remote.sessionCode')}
            </span>
            <span
              className="font-mono text-lg font-bold tracking-[3px]"
              style={{
                background: 'linear-gradient(135deg, #B19CD9, #9F84C7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AR2024
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-2.5 py-5">
          {galleries.map((_, index) => (
            <div
              key={index}
              onClick={() => setActiveGallery(index)}
              className="cursor-pointer transition-all duration-300"
              style={{
                width: activeGallery === index ? '32px' : '8px',
                height: '8px',
                borderRadius: activeGallery === index ? '4px' : '50%',
                background: activeGallery === index
                  ? 'linear-gradient(135deg, #B19CD9, #9F84C7)'
                  : 'rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 text-center border border-black/[0.03] shadow-[0_2px_20px_rgba(167,196,160,0.1)] relative overflow-hidden">
          <div
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(177, 156, 217, 0.05) 0%, transparent 70%)',
              animation: 'rotate 20s linear infinite',
            }}
          />
          <div className="text-[40px] mb-4 drop-shadow relative z-10">👑</div>
          <div className="text-lg font-bold text-gray-900 mb-2 relative z-10">
            {t('apps.remote.photoMaster.title')}
          </div>
          <div className="text-[13px] text-gray-500 leading-relaxed relative z-10">
            {t('apps.remote.photoMaster.description')}
          </div>
        </div>
      </div>
    </>
  );
}

function ControlButton({
  icon,
  label,
  isPrimary = false,
  onClick,
}: {
  icon: string;
  label: string;
  isPrimary?: boolean;
  onClick?: () => void;
}) {
  if (isPrimary) {
    return (
      <button
        onClick={onClick}
        className="aspect-square rounded-[20px] flex flex-col items-center justify-center gap-1.5 text-white"
        style={{
          background: 'linear-gradient(135deg, #B19CD9, #9F84C7)',
          boxShadow: '0 8px 20px rgba(177, 156, 217, 0.25), 0 4px 10px rgba(177, 156, 217, 0.2)',
        }}
      >
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
          {label}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-[20px] flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-white to-gray-100 shadow-[6px_6px_12px_rgba(0,0,0,0.04),-6px_-6px_12px_rgba(255,255,255,1),inset_1px_1px_3px_rgba(255,255,255,0.6)]"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </span>
    </button>
  );
}

function ActionButton({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: 'red' | 'green';
}) {
  const colorStyles = {
    red: {
      background: 'linear-gradient(135deg, #FFE5E5, #FFD5D5)',
      textColor: '#FF3B30',
    },
    green: {
      background: 'linear-gradient(135deg, #E8F5E8, #D8EFD8)',
      textColor: '#34C759',
    },
  };

  const styles = colorStyles[color];

  return (
    <button
      className="py-5 rounded-[20px] flex items-center justify-center gap-3 text-sm font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)]"
      style={{
        background: styles.background,
        color: styles.textColor,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default RemoteApp;
