'use client';

import React from 'react';
import Link from 'next/link';
import type { PublicEvent } from '../_services/publicEvents';

interface EventCardProps {
  event: PublicEvent;
  featured?: boolean;
  isLatest?: boolean;
}

function formatDateParts(dateString: string | null): { day: string; month: string } | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = date.getDate().toString();
  const month = date.toLocaleDateString('da-DK', { month: 'short' }).replace('.', '');
  return { day, month };
}

export function EventCard({ event, featured = false, isLatest = false }: EventCardProps) {
  const dateParts = formatDateParts(event.startsAt);

  return (
    <Link
      href={`/remote/${event.id}`}
      className={`
        block bg-nory-white border-3 border-nory-black rounded-[20px] overflow-hidden
        shadow-[5px_5px_0_#1a1a1a] transition-all duration-200 no-underline text-inherit
        hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#1a1a1a]
        ${featured ? 'col-span-full lg:col-span-7 row-span-2' : 'col-span-full lg:col-span-5'}
      `}
    >
      <div className={`relative overflow-hidden ${featured ? 'min-h-[280px]' : 'min-h-[180px]'}`}>
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center min-h-[inherit]">
          <span className={featured ? 'text-8xl' : 'text-6xl'}>🎉</span>
        </div>

        {dateParts && (
          <div className="absolute top-4 left-4 bg-nory-white border-2 border-nory-black rounded-[10px] px-3.5 py-2.5 text-center shadow-[2px_2px_0_#1a1a1a]">
            <div className="font-mono text-xl font-bold leading-none">{dateParts.day}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mt-0.5">{dateParts.month}</div>
          </div>
        )}

        {isLatest && (
          <div className="absolute top-4 right-4 bg-nory-yellow border-2 border-nory-black rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide">
            Nyeste
          </div>
        )}
      </div>

      <div className={`border-t-2 border-nory-black bg-nory-white ${featured ? 'p-6 lg:p-7' : 'p-5 lg:p-6'}`}>
        <h3 className={`font-bold tracking-tight mb-1 ${featured ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
          {event.name}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <span>0 billeder</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate max-w-[120px]">{event.location}</span>
            </div>
          )}

          <div className="ml-auto w-8 h-8 bg-nory-gray rounded-lg flex items-center justify-center transition-colors group-hover:bg-nory-yellow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14"/>
              <path d="M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
