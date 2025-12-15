'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import { queryKeys } from '@/lib/query';
import {
  getGuestbookEntries,
  createGuestbookEntry,
  type CreateGuestbookEntryData,
} from '../../_services/guestApi';
import type { BaseAppProps } from './types';

interface GuestbookAppProps extends BaseAppProps {
  appInstanceId?: string;
}

export function GuestbookApp({ eventId, appData, appInstanceId }: GuestbookAppProps) {
  const { t } = useTranslation('remote');
  const queryClient = useQueryClient();
  const instanceId = appInstanceId || appData?.id || '';

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const entriesQuery = useQuery({
    queryKey: queryKeys.guestbook.entries(eventId, instanceId),
    queryFn: () => getGuestbookEntries(eventId, instanceId),
    enabled: Boolean(eventId && instanceId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGuestbookEntryData) =>
      createGuestbookEntry(eventId, instanceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guestbook.entries(eventId, instanceId),
      });
      setName('');
      setMessage('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !instanceId) return;

    await createMutation.mutateAsync({
      name: name.trim(),
      message: message.trim(),
      hasPhoto: false,
    });
  };

  const entries = entriesQuery.data ?? [];

  return (
    <>
      <AppHeader title={t('apps.guestbook.title').toUpperCase()} icon="📖" eventId={eventId} />
      <AppContainer>
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-6">
          <h2 className="text-xl font-bold mb-5 text-center text-[#2F4C39]">
            {t('apps.guestbook.writeMessage')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={t('apps.guestbook.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                disabled={createMutation.isPending}
              />
            </div>
            <div>
              <textarea
                placeholder={t('apps.guestbook.messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                disabled={createMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !name.trim() || !message.trim()}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #667EEA, #764BA2)',
              }}
            >
              {createMutation.isPending ? t('apps.guestbook.sending') : t('apps.guestbook.sendMessage')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold mb-4 text-[#2F4C39]">
            {t('apps.guestbook.title')} ({entries.length})
          </h3>

          {entriesQuery.isLoading ? (
            <div className="text-center py-8 text-gray-400">{t('common.loading')}</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">{t('apps.guestbook.beFirst')}</div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[#2F4C39]">{entry.name}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{entry.message}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppContainer>
    </>
  );
}

export default GuestbookApp;
