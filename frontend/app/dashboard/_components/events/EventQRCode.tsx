'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { getEventsUrl } from '@/utils/urls';

interface EventQRCodeProps {
  eventId: string;
  eventName: string;
  size?: number;
  showActions?: boolean;
}

export function EventQRCode({ eventId, eventName, size = 300, showActions = true }: EventQRCodeProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events' });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<'guest' | 'slideshow' | null>(null);

  const eventsBaseUrl = getEventsUrl();
  const guestUploadUrl = `${eventsBaseUrl}/remote/${eventId}`;
  const slideshowUrl = `${eventsBaseUrl}/slideshow/${eventId}`;

  useEffect(() => {
    generateQRCode();
  }, [eventId, size]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, guestUploadUrl, {
        width: size,
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
      link.download = `${eventName}-qr-code.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && canvasRef.current) {
      const imageUrl = canvasRef.current.toDataURL('image/png');
      const scanToUploadText = t('qrCode.scanToUpload');
      printWindow.document.write(`
        <html>
          <head>
            <title>${eventName} - QR Code</title>
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
            <h1>${eventName}</h1>
            <div class="subtitle">${scanToUploadText}</div>
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

  const buttonStyle = (variant: 'primary' | 'secondary' = 'secondary') => ({
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: variant === 'primary' ? '#3b82f6' : '#f3f4f6',
    color: variant === 'primary' ? 'white' : '#374151',
  });

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            background: 'white',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          {t('qrCode.guestUploadLink')}
        </label>
        <div
          style={{
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            wordBreak: 'break-all',
            color: '#374151',
          }}
        >
          {guestUploadUrl}
        </div>
        {showActions && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button style={buttonStyle()} onClick={() => handleCopy('guest')}>
              {copied === 'guest' ? t('manage.links.copied') : t('manage.links.copy')}
            </button>
            <button style={buttonStyle()} onClick={() => window.open(guestUploadUrl, '_blank')}>
              {t('manage.links.open')}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          {t('qrCode.slideshowLink')}
        </label>
        <div
          style={{
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            wordBreak: 'break-all',
            color: '#374151',
          }}
        >
          {slideshowUrl}
        </div>
        {showActions && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button style={buttonStyle()} onClick={() => handleCopy('slideshow')}>
              {copied === 'slideshow' ? t('manage.links.copied') : t('manage.links.copy')}
            </button>
            <button style={buttonStyle()} onClick={() => window.open(slideshowUrl, '_blank')}>
              {t('manage.links.open')}
            </button>
          </div>
        )}
      </div>

      {showActions && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button style={buttonStyle('primary')} onClick={handleDownload}>
            <DownloadIcon /> {t('qrCode.downloadQR')}
          </button>
          <button style={buttonStyle()} onClick={handlePrint}>
            <PrintIcon /> {t('qrCode.print')}
          </button>
        </div>
      )}
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
