'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface PollsAppProps extends BaseAppProps {}

export function PollsApp({ eventId }: PollsAppProps) {
  const { t } = useTranslation('remote');
  const question = "What's your favorite moment?";
  const options = ['First Dance', 'Ceremony', 'Speeches'];
  const percentages = [45, 30, 25];

  return (
    <>
      <AppHeader title={t('apps.polls.title').toUpperCase()} icon="📊" eventId={eventId} />
      <AppContainer>
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold mb-2 text-center text-[#2F4C39]">
            {t('apps.polls.title')}
          </h2>

          <p className="text-base mb-6 text-center text-[#2F4C39]">{question}</p>

          {options.map((option, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-[#2F4C39]">{option}</span>
                <span className="text-xs text-gray-400">
                  {percentages[index]}%
                </span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${percentages[index]}%`,
                    background: 'linear-gradient(90deg, #667EEA, #764BA2)',
                  }}
                />
              </div>
            </div>
          ))}

          <div className="text-center text-xs text-gray-400 mt-5">
            23 votes • Live updating
          </div>
        </div>
      </AppContainer>
    </>
  );
}

export default PollsApp;
