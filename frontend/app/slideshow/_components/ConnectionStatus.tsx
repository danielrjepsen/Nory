'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData, Category } from '../_types';
import { Limits } from '../_constants';

interface Props {
  connected: boolean;
  connectionAttempts: number;
  currentController: string | null;
  eventInfo: EventData | null;
  selectedCategory: string | null;
  availableCategories: Category[];
  onReconnect?: () => void;
}

const WRAPPER = 'absolute top-4 left-4 z-50';
const BADGE = 'text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm border-2';
const DOT = 'w-2 h-2 bg-white rounded-full';

function ConnectionStatusInner({
  connected,
  connectionAttempts,
  currentController,
  eventInfo,
  selectedCategory,
  availableCategories,
  onReconnect,
}: Props) {
  const { t } = useTranslation('slideshow');

  const categoryName = selectedCategory
    ? availableCategories.find((c) => c.id === selectedCategory)?.name
    : null;

  const eventName = eventInfo?.name || t('display.fallback.eventName');
  const maxRetries = Limits.MAX_CONNECTION_RETRIES;

  if (currentController) {
    return (
      <div className={WRAPPER}>
        <div className={`${BADGE} bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/50`}>
          <div className="flex items-center gap-2">
            <div className={`${DOT} animate-pulse`} />
            <span className="text-sm font-bold">
              {t('display.connectionStatus.controlledBy', { name: currentController, event: eventName })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (connected) {
    return (
      <div className={WRAPPER}>
        <div className={`${BADGE} bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/50`}>
          <div className="flex items-center gap-2">
            <div className={`${DOT} animate-pulse`} />
            <span className="text-sm font-bold">
              {eventName}{categoryName && ` - ${categoryName}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={WRAPPER}>
      <div className={`${BADGE} bg-gradient-to-r from-red-500 to-orange-500 border-red-400/50`}>
        <div className="flex items-center gap-2">
          <div className={`${DOT} animate-ping`} />
          <span className="text-sm font-bold">
            🔌 {connectionAttempts > 0
              ? t('display.connectionStatus.reconnecting', { current: connectionAttempts, max: maxRetries })
              : t('display.connectionStatus.connecting')}
          </span>
        </div>

        {connectionAttempts >= maxRetries && onReconnect && (
          <div className="mt-2 text-xs">
            <div className="text-red-200 mb-1">{t('display.connectionStatus.maxAttemptsReached')}</div>
            <button onClick={onReconnect} className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors">
              {t('display.connectionStatus.restartConnection')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const ConnectionStatus = memo(ConnectionStatusInner);
