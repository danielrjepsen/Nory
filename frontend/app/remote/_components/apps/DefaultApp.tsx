'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface DefaultAppProps extends BaseAppProps {}

export function DefaultApp({ eventId, appData }: DefaultAppProps) {
  const { t } = useTranslation('remote');

  return (
    <>
      <AppHeader
        title={appData?.name?.toUpperCase() || 'APP'}
        icon={appData?.icon || '📱'}
        eventId={eventId}
      />
      <AppContainer>
        <div className="bg-white rounded-3xl p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="text-5xl mb-5">{appData?.icon || '📱'}</div>
          <h1 className="text-2xl font-bold mb-3 text-[#2F4C39]">
            {appData?.name || 'App'}
          </h1>
          <p className="text-gray-400 mb-6">{t('apps.default.comingSoon')}</p>
        </div>
      </AppContainer>
    </>
  );
}

export default DefaultApp;
