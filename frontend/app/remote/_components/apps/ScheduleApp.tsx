'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface ScheduleAppProps extends BaseAppProps {}

export function ScheduleApp({ eventId }: ScheduleAppProps) {
  const { t } = useTranslation('remote');
  const events = [
    { time: '2:00 PM', title: 'Ceremony Begins' },
    { time: '3:00 PM', title: 'Cocktail Hour' },
    { time: '4:00 PM', title: 'Reception' },
    { time: '6:00 PM', title: 'Dinner' },
  ];

  return (
    <>
      <AppHeader title={t('apps.schedule.title').toUpperCase()} icon="📅" eventId={eventId} />
      <AppContainer>
        <div
          className="rounded-2xl p-5 mb-5 text-center text-white"
          style={{
            background: 'linear-gradient(135deg, #667EEA, #764BA2)',
          }}
        >
          <div className="text-xs opacity-90">{t('apps.schedule.upcoming')}</div>
          <div className="text-2xl font-semibold mt-1">2h 15m</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold mb-5 text-center text-[#2F4C39]">
            {t('apps.schedule.title')}
          </h2>

          {events.map((event, index) => (
            <div
              key={index}
              className={`flex gap-4 mb-4 ${index === 0 ? 'opacity-100' : 'opacity-60'}`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                  index === 0
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {event.time.split(':')[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#2F4C39]">
                  {event.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </AppContainer>
    </>
  );
}

export default ScheduleApp;
