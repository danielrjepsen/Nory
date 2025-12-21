'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface CustomApiAppProps extends BaseAppProps {}

export function CustomApiApp({ eventId, appData }: CustomApiAppProps) {
  const { t } = useTranslation('remote');
  const config = appData?.config || {};
  const endpoint = (config.endpoint as string) || '';
  const method = (config.method as string) || 'GET';
  const refresh = (config.refresh as number) || 60;

  return (
    <>
      <AppHeader title={t('apps.custom.title').toUpperCase()} icon="⚡" eventId={eventId} />
      <AppContainer>
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold mb-5 text-center text-[#2F4C39]">
            {t('apps.custom.subtitle')}
          </h2>

          <div className="bg-[#1A1A1A] text-emerald-500 p-4 rounded-lg font-mono text-xs mb-4">
            <div className="text-gray-500 mb-1">// {t('apps.custom.configTitle')}</div>
            <div>{'{'}</div>
            <div className="pl-4">
              <div>"endpoint": "{endpoint || 'not configured'}",</div>
              <div>"method": "{method}",</div>
              <div>"refresh": {refresh},</div>
              <div>"status": "ready"</div>
            </div>
            <div>{'}'}</div>
          </div>

          <div
            className={`p-3 rounded-lg text-center text-sm text-white ${
              endpoint ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          >
            {endpoint ? `✓ ${t('apps.custom.connected')}` : `⚠️ ${t('apps.custom.configureEndpoint')}`}
          </div>
        </div>
      </AppContainer>
    </>
  );
}

export default CustomApiApp;
