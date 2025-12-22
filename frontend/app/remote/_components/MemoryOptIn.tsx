'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MemoryOptInProps {
  eventId: string;
  onOptInSuccess: (email: string) => Promise<void>;
}

export function MemoryOptIn({ eventId, onOptInSuccess }: MemoryOptInProps) {
  const { t } = useTranslation('remote');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-4 my-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✨</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-sm">
              {t('welcome.memoryOptIn.title')}
            </h3>
            <p className="text-gray-600 text-xs mt-1">
              {t('welcome.memoryOptIn.description')}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryOptIn;
