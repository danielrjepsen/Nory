'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface ListsAppProps extends BaseAppProps {}

export function ListsApp({ eventId }: ListsAppProps) {
  const { t } = useTranslation('remote');
  const items = ['Wedding Cake', 'Champagne Glasses', 'Photo Album', 'Flower Arrangements'];
  const claiming = true;

  return (
    <>
      <AppHeader title={t('apps.lists.title').toUpperCase()} icon="📝" eventId={eventId} />
      <AppContainer>
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold mb-5 text-center text-[#2F4C39]">
            {t('apps.lists.title')}
          </h2>

          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-3 mb-2 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4.5 h-4.5 rounded ${
                    index === 0 ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
                <span className="text-sm text-[#2F4C39]">{item}</span>
              </div>
              {claiming && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    index === 0
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index === 0 ? t('apps.lists.claimed') : t('apps.lists.available')}
                </span>
              )}
            </div>
          ))}
        </div>
      </AppContainer>
    </>
  );
}

export default ListsApp;
