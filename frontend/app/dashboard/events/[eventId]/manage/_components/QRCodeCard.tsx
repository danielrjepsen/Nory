'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQRCode } from '../../../../_hooks';

interface QRCodeCardProps {
  eventName: string;
  guestAppUrl: string;
}

export function QRCodeCard({ eventName, guestAppUrl }: QRCodeCardProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events.qrCode' });
  const { qrCodeImageUrl, handleDownload, handlePrint } = useQRCode({
    url: guestAppUrl,
    size: 140,
    eventName,
  });

  const onPrint = () => handlePrint({ scanText: t('scanToOpen') });

  return (
    <div className="bg-nory-black dark:bg-nory-card rounded-2xl p-5 text-nory-white dark:border-2 dark:border-nory-border text-center">
      <h3 className="text-[0.95rem] font-bold mb-3.5 dark:text-nory-text">{t('shareWithGuests')}</h3>

      <div className="w-[140px] h-[140px] bg-nory-white rounded-[10px] mx-auto mb-3.5 flex items-center justify-center p-1">
        {qrCodeImageUrl && (
          <img
            src={qrCodeImageUrl}
            alt="QR Code"
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>

      <p className="text-[0.7rem] text-white/50 dark:text-nory-muted mb-3.5">
        {t('scanToOpen')}
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-nory-white dark:bg-nory-bg text-nory-black dark:text-nory-text rounded-lg text-xs font-semibold transition-colors hover:bg-nory-yellow hover:text-nory-black"
        >
          {t('download')}
        </button>
        <button
          onClick={onPrint}
          className="flex-1 py-2.5 bg-nory-yellow text-nory-black rounded-lg text-xs font-semibold transition-colors hover:bg-[#f0dc4a]"
        >
          {t('print')}
        </button>
      </div>
    </div>
  );
}
