'use client';

import { useTranslation } from 'react-i18next';
import { AppHeader, AppContainer } from '../layout';
import type { BaseAppProps } from './types';

interface GalleryAppProps extends BaseAppProps {}

export function GalleryApp({ eventId }: GalleryAppProps) {
  const { t } = useTranslation('remote');
  const heights = [80, 120, 100, 90, 110, 70];

  return (
    <>
      <AppHeader title={t('apps.gallery.title').toUpperCase()} icon="🖼️" eventId={eventId} />
      <AppContainer>
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold mb-5 text-center text-[#2F4C39]">
            {t('apps.gallery.title')}
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {heights.map((height, index) => (
              <div
                key={index}
                className="rounded-lg bg-gradient-to-br from-gray-200 to-gray-100"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
      </AppContainer>
    </>
  );
}

export default GalleryApp;
