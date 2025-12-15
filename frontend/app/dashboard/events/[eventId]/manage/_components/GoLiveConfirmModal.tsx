'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EventData } from '../../../../_types/events';
import { Button } from '../../../../_components/Button';

interface GoLiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: EventData;
  loading: boolean;
}

export function GoLiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  event,
  loading,
}: GoLiveConfirmModalProps) {
  const { t } = useTranslation('dashboard');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {t('events.manage.goLiveModal.title', { name: event.name })}
        </h2>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {t('events.manage.goLiveModal.description')}
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {t('events.manage.goLiveModal.notYet')}
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 px-5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('events.manage.goLiveModal.goingLive') : t('events.manage.goLiveModal.goLive')}
          </button>
        </div>
      </div>
    </div>
  );
}
