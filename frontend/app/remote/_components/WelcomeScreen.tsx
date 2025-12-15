'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  eventId: string;
  eventName: string;
  onNameSubmit: (name: string) => Promise<void>;
}

export function WelcomeScreen({
  eventId,
  eventName,
  onNameSubmit,
}: WelcomeScreenProps) {
  const { t } = useTranslation('remote');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onNameSubmit(name.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('welcome.title')}
          </h1>
          <p className="text-gray-300">
            {t('welcome.joiningEvent')} <span className="font-semibold">{eventName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              {t('welcome.nameLabel')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('welcome.namePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('welcome.joining') : t('welcome.joinButton')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WelcomeScreen;
