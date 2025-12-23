'use client';

import React from 'react';
import { EventCard } from './EventCard';
import type { PublicEvent } from '../_services/publicEvents';

interface EventsSectionProps {
  events: PublicEvent[];
}

export function EventsSection({ events }: EventsSectionProps) {
  if (events.length === 0) {
    return (
      <section className="bg-nory-gray py-20 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-1">Alle begivenheder</h2>
            <p className="text-gray-500">Ingen begivenheder at vise endnu</p>
          </div>

          <div className="bg-nory-white border-3 border-nory-black rounded-[20px] p-12 text-center shadow-[5px_5px_0_#1a1a1a]">
            <div className="w-16 h-16 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎈</span>
            </div>
            <p className="text-gray-500">Opret et event og marker det som offentligt for at vise det her</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-nory-gray py-20 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">Alle begivenheder</h2>
            <p className="text-gray-500">Udforsk vores fælles minder</p>
          </div>

          <div className="hidden sm:flex gap-1 bg-nory-white border-2 border-nory-black rounded-[10px] p-1">
            <button className="p-2 bg-nory-black text-nory-white rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button className="p-2 rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              featured={index === 0 && events.length > 1}
              isLatest={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
