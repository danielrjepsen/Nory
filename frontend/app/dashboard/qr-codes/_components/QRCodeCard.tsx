'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { getEventsUrl } from '@/utils/urls';
import { Button } from '../../_components/Button';
import { StatusBadge } from '../../_components/StatusBadge';
import { Heading, Text } from '../../_components/ui/Typography';
import type { EventData } from '../../_types/events';

interface QRCodeCardProps {
  event: EventData;
}

export function QRCodeCard({ event }: QRCodeCardProps) {
  const { t } = useTranslation('dashboard');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<'guest' | 'slideshow' | null>(null);

  const eventsBaseUrl = getEventsUrl();
  const guestUploadUrl = `${eventsBaseUrl}/remote/${event.id}`;
  const slideshowUrl = `${eventsBaseUrl}/slideshow/${event.id}`;

  useEffect(() => {
    generateQRCode();
  }, [event.id]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, guestUploadUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${event.name}-qr-code.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && canvasRef.current) {
      const imageUrl = canvasRef.current.toDataURL('image/png');
      printWindow.document.write(`
        <html>
          <head>
            <title>${event.name} - QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              h1 { margin-bottom: 10px; font-size: 32px; text-align: center; }
              .subtitle { margin-bottom: 30px; font-size: 18px; color: #666; text-align: center; }
              img { max-width: 400px; margin: 20px 0; }
              .url {
                margin-top: 20px;
                padding: 10px 20px;
                background: #f5f5f5;
                border-radius: 8px;
                font-family: monospace;
                font-size: 14px;
                word-break: break-all;
              }
            </style>
          </head>
          <body>
            <h1>${event.name}</h1>
            <div class="subtitle">${t('qrCodes.scanToUpload')}</div>
            <img src="${imageUrl}" alt="QR Code" />
            <div class="url">${guestUploadUrl}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopy = (type: 'guest' | 'slideshow') => {
    const url = type === 'guest' ? guestUploadUrl : slideshowUrl;
    navigator.clipboard.writeText(url);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Heading as="h3" className="mb-1 truncate">
            {event.name}
          </Heading>
          <Text variant="muted" className="mb-0">
            {event.photoCount} {t('qrCodes.photos')}
          </Text>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* QR Code */}
        <div className="flex-shrink-0">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded-lg p-2 bg-white mx-auto lg:mx-0"
          />
        </div>

        {/* Links and Actions */}
        <div className="flex-1 space-y-4">
          {/* Guest Upload URL */}
          <div>
            <Text variant="small" className="font-medium mb-1">
              {t('qrCodes.guestUploadLink')}
            </Text>
            <div className="p-3 bg-gray-50 rounded-lg font-mono text-xs break-all text-gray-700">
              {guestUploadUrl}
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleCopy('guest')}>
                {copied === 'guest' ? t('qrCodes.copied') : t('qrCodes.copyLink')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(guestUploadUrl, '_blank')}>
                {t('qrCodes.open')}
              </Button>
            </div>
          </div>

          {/* Slideshow URL */}
          <div>
            <Text variant="small" className="font-medium mb-1">
              {t('qrCodes.slideshowLink')}
            </Text>
            <div className="p-3 bg-gray-50 rounded-lg font-mono text-xs break-all text-gray-700">
              {slideshowUrl}
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleCopy('slideshow')}>
                {copied === 'slideshow' ? t('qrCodes.copied') : t('qrCodes.copyLink')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(slideshowUrl, '_blank')}>
                {t('qrCodes.open')}
              </Button>
            </div>
          </div>

          {/* Download/Print Actions */}
          <div className="pt-2 flex gap-3">
            <Button variant="primary" size="sm" onClick={handleDownload}>
              <DownloadIcon />
              {t('qrCodes.download')}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <PrintIcon />
              {t('qrCodes.print')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
