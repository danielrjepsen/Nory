'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { EventQRCode } from './EventQRCode';

interface EventQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export function EventQRModal({ isOpen, onClose, eventId, eventName }: EventQRModalProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'events' });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#1a1a1a]/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fffef9] rounded-[10px] border-brutal shadow-brutal p-6 w-full max-w-[440px] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a1a] m-0 font-grotesk">
              {t('qrCode.title')}
            </h2>
            <p className="text-sm text-[#1a1a1a]/60 mt-1 font-grotesk">
              {eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-[#fffef9] border-2 border-[#1a1a1a] rounded-[8px] cursor-pointer text-[#1a1a1a] transition-all duration-150 hover:bg-[#ffe951] hover:shadow-brutal-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <EventQRCode eventId={eventId} eventName={eventName} size={280} />
      </div>
    </div>
  );
}
