'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getEventsUrl } from '@/utils/urls';

interface Props {
  eventId: string;
  size?: number;
  shakeIntervalMs?: number;
}

const DEFAULT_SIZE = 120;
const SHAKE_INTERVAL = 30000;
const SHAKE_DURATION = 1000;

const CONTAINER = 'relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4 transition-all duration-300 hover:scale-105';

function QRCodeDisplayInner({ eventId, size = DEFAULT_SIZE, shakeIntervalMs = SHAKE_INTERVAL }: Props) {
  const { t } = useTranslation('slideshow');
  const [shouldShake, setShouldShake] = useState(false);

  const guestUrl = useMemo(() => `${getEventsUrl()}/remote/${eventId}`, [eventId]);
  const qrCodeUrl = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(guestUrl)}`, [guestUrl, size]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldShake(true);
      const timeout = setTimeout(() => setShouldShake(false), SHAKE_DURATION);
      return () => clearTimeout(timeout);
    }, shakeIntervalMs);
    return () => clearInterval(interval);
  }, [shakeIntervalMs]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-400/30 rounded-2xl blur-md animate-pulse" />

        <div className={`${CONTAINER} ${shouldShake ? 'animate-shake' : ''}`}>
          <div className="text-yellow-300 text-sm font-bold text-center mb-2 uppercase tracking-wide drop-shadow-lg">
            {t('display.qrCode.title')}
          </div>

          <div className="bg-white rounded-xl p-2 mb-2">
            <img
              src={qrCodeUrl}
              alt={t('display.qrCode.alt')}
              className="w-24 h-24 mx-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="text-white text-xs font-semibold text-center">
            {t('display.qrCode.upload')}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

export const QRCodeDisplay = memo(QRCodeDisplayInner);
