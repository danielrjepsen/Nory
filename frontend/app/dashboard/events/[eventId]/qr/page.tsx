'use client';

import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { useQRCode, useEvent } from '../../../_hooks';
import { LoadingState } from '../manage/_components/LoadingState';
import { ErrorState } from '../manage/_components/ErrorState';

function QRCodeContent() {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events.qrCode' });
  const { event, loading, error, eventId } = useEvent();

  const guestAppUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/remote/${eventId}`
    : '';

  const { qrCodeImageUrl, handleDownload, handlePrint } = useQRCode({
    url: guestAppUrl,
    size: 280,
    eventName: event?.name || '',
  });

  const onPrint = () => handlePrint({ scanText: t('scanToOpen') });

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-6 flex flex-col items-center">
        <h3 className="text-[0.95rem] font-bold mb-4 text-nory-text">{t('shareWithGuests')}</h3>

        <div className="bg-white rounded-xl p-4 mb-4 w-[280px] h-[280px] flex items-center justify-center">
          {qrCodeImageUrl && (
            <img
              src={qrCodeImageUrl}
              alt="QR Code"
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
        </div>

        <p className="text-[0.8rem] text-nory-muted mb-4">
          {t('scanToOpen')}
        </p>

        <div className="flex gap-2.5 w-full">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 bg-nory-bg border-2 border-nory-border text-nory-text rounded-lg text-[0.8rem] font-semibold transition-colors hover:bg-nory-yellow hover:text-nory-black"
          >
            {t('download')}
          </button>
          <button
            onClick={onPrint}
            className="flex-1 py-2.5 bg-nory-yellow border-2 border-nory-border text-nory-black rounded-lg text-[0.8rem] font-semibold transition-colors hover:bg-[#f0dc4a]"
          >
            {t('print')}
          </button>
        </div>
      </div>

      <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-6 flex-1">
        <h3 className="text-[0.95rem] font-bold mb-4 text-nory-text">
          {t('howToUse')}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-nory-yellow border-2 border-nory-border rounded-full flex items-center justify-center text-[0.75rem] font-bold text-nory-black flex-shrink-0">1</span>
            <span className="text-[0.85rem] text-nory-text">{t('instruction1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-nory-yellow border-2 border-nory-border rounded-full flex items-center justify-center text-[0.75rem] font-bold text-nory-black flex-shrink-0">2</span>
            <span className="text-[0.85rem] text-nory-text">{t('instruction2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-nory-yellow border-2 border-nory-border rounded-full flex items-center justify-center text-[0.75rem] font-bold text-nory-black flex-shrink-0">3</span>
            <span className="text-[0.85rem] text-nory-text">{t('instruction3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function EventQRCodePage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="qr">
        <QRCodeContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
