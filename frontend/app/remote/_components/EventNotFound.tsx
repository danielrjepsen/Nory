'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface EventNotFoundProps {
  error: string;
  eventId: string;
}

export function EventNotFound({ error, eventId }: EventNotFoundProps) {
  const { t } = useTranslation('remote');

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center space-y-8 px-6 max-w-md">
        <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
          <span className="text-5xl">❌</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            {t('common.eventNotFound.title')}
          </h1>
          <p className="text-gray-300 leading-relaxed">
            {t('common.eventNotFound.description')}
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
              <p className="text-red-300 text-sm font-mono">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">
            {t('common.eventNotFound.eventId')}:
            <span className="font-mono text-gray-300 ml-2">{eventId}</span>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>← {t('common.eventNotFound.goBack')}</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>🏠 {t('common.home')}</span>
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          {t('common.eventNotFound.helpText')}
        </p>
      </div>
    </div>
  );
}
