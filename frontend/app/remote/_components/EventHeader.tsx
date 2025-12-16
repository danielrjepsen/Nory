'use client';

import { useTranslation } from 'react-i18next';
import type { PublicEventData } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/types';

interface EventHeaderProps {
  eventData: PublicEventData;
  eventTheme: EventTheme | null;
  onUploadClick: () => void;
}

const TAGLINES: Record<string, string> = {
  wedding: 'Join us in celebrating love',
  birthday: 'Join us for a special celebration',
  corporate: 'Welcome to our professional event',
  'new-year': 'Ring in the new year with us',
  baby: 'Celebrating our bundle of joy',
};

function formatEventDate(date: string | undefined): string {
  if (!date) return 'DATE TBD';
  return new Date(date).toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();
}

export function EventHeader({ eventData, eventTheme, onUploadClick }: EventHeaderProps) {
  const { t } = useTranslation('remote');

  const tagline = TAGLINES[eventTheme?.themeName || ''] || 'Join us for this special occasion';
  const primaryColor = eventTheme?.primaryColor || 'rgba(255, 119, 198, 0.9)';
  const gradientBg = eventTheme
    ? `linear-gradient(135deg, ${eventTheme.primaryColor}, ${eventTheme.secondaryColor})`
    : 'linear-gradient(135deg, rgba(120, 119, 198, 0.8), rgba(255, 119, 198, 0.8))';

  return (
    <>
      <div className="text-center py-10 px-8 relative overflow-hidden flex items-center justify-center">
        <div>
          <div
            className="text-sm font-medium mb-4 opacity-0 tracking-wider uppercase animate-fade-in-up"
            style={{ color: `${primaryColor}E6`, animationDelay: '0.3s' }}
          >
            {formatEventDate(eventData?.startsAt)}
          </div>

          <h1
            className="text-4xl font-bold mb-3 opacity-0 tracking-tight leading-tight text-white/95 animate-fade-in-up"
            style={{
              fontFamily: eventTheme?.primaryFont || "'Playfair Display', serif",
              animationDelay: '0.5s',
            }}
          >
            {eventData.name || 'Event Gallery'}
          </h1>

          <p
            className="text-base text-white/70 mb-6 opacity-0 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            {tagline}
          </p>

          <button
            className="text-white border-none py-3 px-6 rounded-full text-sm font-semibold cursor-pointer opacity-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
            style={{ background: gradientBg, animationDelay: '0.9s' }}
            onClick={onUploadClick}
          >
            {t('gallery.uploadButton')}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
