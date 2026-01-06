'use client';

import { useMemo, useCallback } from 'react';

interface UseQRCodeOptions {
  url: string;
  size?: number;
  eventName: string;
}

interface PrintOptions {
  scanText: string;
}

export function useQRCode({ url, size = 140, eventName }: UseQRCodeOptions) {
  // Use external QR code API for reliable cross-device rendering
  const qrCodeImageUrl = useMemo(() => {
    if (!url) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=1a1a1a&margin=8`;
  }, [url, size]);

  const handleDownload = useCallback(async () => {
    if (!qrCodeImageUrl || !eventName) return;

    try {
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${eventName}-qr-code.png`;
      link.href = downloadUrl;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  }, [qrCodeImageUrl, eventName]);

  const handlePrint = useCallback(({ scanText }: PrintOptions) => {
    if (!qrCodeImageUrl || !eventName) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

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
              font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
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
          <div class="subtitle">${scanText}</div>
          <img src="${qrCodeImageUrl}" alt="QR Code" />
          <div class="url">${url}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [eventName, url, qrCodeImageUrl]);

  return {
    qrCodeImageUrl,
    handleDownload,
    handlePrint,
  };
}
