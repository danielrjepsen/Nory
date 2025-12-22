'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCardProps {
  eventId: string;
  eventName: string;
  guestAppUrl: string;
}

export function QRCodeCard({ eventId, eventName, guestAppUrl }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [guestAppUrl]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, guestAppUrl, {
        width: 140,
        margin: 2,
        color: {
          dark: '#1a1a1a',
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
            <div class="subtitle">Scan for at uploade billeder</div>
            <img src="${imageUrl}" alt="QR Code" />
            <div class="url">${guestAppUrl}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-nory-black dark:bg-nory-card rounded-2xl p-5 text-nory-white dark:border-2 dark:border-nory-border text-center">
      <h3 className="text-[0.95rem] font-bold mb-3.5 dark:text-nory-text">Del med gæster</h3>

      <div className="w-[140px] h-[140px] bg-nory-white rounded-[10px] mx-auto mb-3.5 flex items-center justify-center p-2.5">
        <canvas ref={canvasRef} />
      </div>

      <p className="text-[0.7rem] text-white/50 dark:text-nory-muted mb-3.5">
        Scan for at åbne gæste-appen
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-nory-white dark:bg-nory-bg text-nory-black dark:text-nory-text rounded-lg text-xs font-semibold transition-colors hover:bg-nory-yellow hover:text-nory-black"
        >
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 py-2.5 bg-nory-yellow text-nory-black rounded-lg text-xs font-semibold transition-colors hover:bg-[#f0dc4a]"
        >
          Print
        </button>
      </div>
    </div>
  );
}
