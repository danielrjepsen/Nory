'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  currentIndex: number;
  totalPhotos: number;
  categoryName?: string | null;
  eventName?: string;
  isLoading?: boolean;
}

const WRAPPER = 'fixed bottom-6 left-6 z-40';
const GLASS = 'bg-gradient-to-br from-white/25 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 min-w-[140px] relative overflow-hidden transition-all duration-300 hover:scale-105 hover:from-white/30 hover:to-white/10';
const GLASS_LOADING = 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 min-w-[140px]';

function PhotoCounterInner({ currentIndex, totalPhotos, categoryName, eventName, isLoading = false }: Props) {
  const { t } = useTranslation('slideshow');

  if (isLoading || totalPhotos === 0) {
    return (
      <div className={WRAPPER}>
        <div className={GLASS_LOADING}>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-3">
              <div className="w-full h-full border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <div className="text-white/70 text-sm font-medium">{t('display.photoCounter.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  const displayIndex = currentIndex + 1;
  const displayCategory = categoryName || t('display.photoCounter.allPhotos');
  const progressPercent = (displayIndex / totalPhotos) * 100;

  return (
    <div className={WRAPPER}>
      <div className="group relative">
        <div className={GLASS}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />

          <div className="relative text-center">
            {eventName && (
              <div className="text-white/90 text-sm font-medium mb-2 truncate max-w-[120px]">{eventName}</div>
            )}

            <div className="text-white text-xl font-bold mb-2 tracking-wide truncate max-w-[120px]">{displayCategory}</div>

            <div className="text-4xl font-black mb-1 tracking-tight">
              <span className="text-blue-300">{displayIndex}</span>
              <span className="text-white/60 text-2xl font-medium mx-1">/</span>
              <span className="text-white text-2xl font-bold">{totalPhotos}</span>
            </div>

            <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="text-white/70 text-xs font-medium mt-2 uppercase tracking-wider">
              {t('display.photoCounter.photos')}
            </div>
          </div>

          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="absolute inset-0 bg-black/10 rounded-2xl blur-xl transform translate-y-2 -z-10" />
      </div>
    </div>
  );
}

export const PhotoCounter = memo(PhotoCounterInner);
