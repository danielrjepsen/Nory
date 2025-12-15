'use client';

import { memo, type ReactNode, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { EventTheme } from '../_types';

type Status = 'draft' | 'ended' | 'error' | 'no-photos' | 'preview';

interface Props {
  status: Status;
  eventName?: string;
  eventTheme?: EventTheme | null;
  errorMessage?: string;
  endedAt?: string;
  isPreview?: boolean;
  onRetry?: () => void;
  onRefresh?: () => void;
  children?: ReactNode;
}

const BTN = 'px-6 py-3 rounded-lg font-bold transition-colors text-white';
const BADGE = 'bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2 inline-block';

const STATUS_CONFIG: Record<Status, { emoji: string; animate?: string }> = {
  draft: { emoji: '🚧' },
  ended: { emoji: '🏁' },
  error: { emoji: '❌' },
  'no-photos': { emoji: '📷', animate: 'animate-bounce' },
  preview: { emoji: '👁️' },
};

function getBackground(theme?: EventTheme | null): CSSProperties {
  const [p, s, a] = theme
    ? [theme.primaryColor + '80', theme.secondaryColor + '70', theme.accentColor + '60']
    : ['rgba(177,156,217,0.3)', 'rgba(159,132,199,0.3)', 'rgba(232,180,255,0.2)'];
  return {
    background: `radial-gradient(circle at 20% 80%,${p} 0%,transparent 50%),radial-gradient(circle at 80% 20%,${s} 0%,transparent 50%),radial-gradient(circle at 40% 40%,${a} 0%,transparent 50%),linear-gradient(135deg,#0f0f23 0%,#1a1625 100%)`,
  };
}

function EventStatusScreenInner({ status, eventName, eventTheme, errorMessage, endedAt, isPreview, onRetry, onRefresh, children }: Props) {
  const { t } = useTranslation('slideshow');

  if (status === 'preview') return <PreviewBadge />;

  const config = STATUS_CONFIG[isPreview && status === 'draft' ? 'preview' : status];
  const prefix = `display.status.${status}`;

  const title = (() => {
    if (status === 'draft') return t(isPreview ? 'display.status.preview.title' : `${prefix}.title`);
    if (status === 'no-photos') return eventName ? t(`${prefix}.title`, { event: eventName }) : t(`${prefix}.titleGeneric`);
    return t(`${prefix}.title`);
  })();

  const description = (() => {
    if (status === 'draft') return t(isPreview ? 'display.status.preview.description' : `${prefix}.description`);
    if (status === 'ended' && endedAt) return <>{t(`${prefix}.description`)}<p className="text-lg opacity-60 mt-4">{t(`${prefix}.endedAt`, { date: new Date(endedAt).toLocaleDateString() })}</p></>;
    if (status === 'error') return errorMessage;
    if (status === 'no-photos') return errorMessage || t(`${prefix}.waiting`);
    return t(`${prefix}.description`);
  })();

  const actions = (() => {
    if (status === 'error' && onRetry) return <button onClick={onRetry} className={`${BTN} bg-blue-600 hover:bg-blue-700`}>{t(`${prefix}.retry`)}</button>;
    if (status === 'no-photos') {
      return (
        <div className="flex gap-3 justify-center flex-wrap">
          {errorMessage && onRetry && <button onClick={onRetry} className={`${BTN} bg-blue-600 hover:bg-blue-700`}>{t(`${prefix}.retry`)}</button>}
          {onRefresh && <button onClick={onRefresh} className={`${BTN} bg-green-600 hover:bg-green-700`}>{t(errorMessage ? `${prefix}.refresh` : `${prefix}.checkNew`)}</button>}
        </div>
      );
    }
    return null;
  })();

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={getBackground(eventTheme)}>
      <div className="relative z-10 text-center text-white max-w-2xl px-6">
        {isPreview && status !== 'draft' && <div className={`${BADGE} mb-4`}><p className="text-yellow-300 font-semibold text-sm">{t('display.status.preview.title')}</p></div>}
        {isPreview && status === 'draft' && <div className={`${BADGE} py-3 mb-4`}><p className="text-yellow-300 font-semibold">{t('display.status.preview.badge')}</p></div>}
        <div className={`text-8xl mb-6 ${config.animate || ''}`}>{config.emoji}</div>
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          {description && <p className="text-xl opacity-75">{description}</p>}
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}

const PreviewBadge = memo(function PreviewBadge() {
  const { t } = useTranslation('slideshow');
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-yellow-500/90 border border-yellow-400 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-yellow-100 font-semibold text-sm">{t('display.status.preview.notLive')}</p>
      </div>
    </div>
  );
});

export const EventStatusScreen = memo(EventStatusScreenInner);
export { PreviewBadge };
