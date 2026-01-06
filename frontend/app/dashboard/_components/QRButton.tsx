'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface QRButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function QRButton({ onClick, className = '' }: QRButtonProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className={`flex justify-center ${className}`}>
      <button
        onClick={onClick}
        className="w-12 h-12 border-brutal rounded-[10px] bg-[#fffef9] flex items-center justify-center transition-all duration-150 shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal hover:bg-[#ffe951] group focus:outline-none"
        aria-label={t('events.viewQRCode')}
      >
        <svg
          width="24"
          height="24"
          fill="currentColor"
          className="text-[#1a1a1a]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
        </svg>
      </button>
    </div>
  );
}
