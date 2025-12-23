'use client';

import React from 'react';
import Link from 'next/link';
import type { PublicEvent } from '../_services/publicEvents';

interface HeroProps {
  instanceName?: string;
  instanceDescription?: string;
  events: PublicEvent[];
  totalPhotos?: number;
  totalParticipants?: number;
}

export function Hero({
  instanceName = 'Nory',
  instanceDescription = 'Dit fælles fotoalbum hvor alle billeder fra begivenheder samles.',
  events,
  totalPhotos = 0,
  totalParticipants = 0,
}: HeroProps) {
  const latestEvent = events[0];

  return (
    <section className="mt-[70px] grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-70px)]">
      <div className="flex flex-col justify-center p-8 lg:p-16 bg-nory-white order-1 lg:order-none">
        <div className="inline-flex items-center gap-2 bg-nory-yellow text-nory-black px-4 py-2 border-2 border-nory-black rounded-full font-mono text-xs font-bold uppercase tracking-wide mb-6 w-fit shadow-[2px_2px_0_#1a1a1a]">
          <span>📸</span>
          <span>{events.length} begivenheder</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
          <span className="block text-xl lg:text-2xl font-medium text-gray-500 tracking-normal mb-1">
            Velkommen til
          </span>
          {instanceName}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed max-w-md mb-8">
          {instanceDescription}
        </p>

        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="font-mono text-3xl lg:text-4xl font-bold leading-none">{totalPhotos}</span>
            <span className="text-sm text-gray-500 mt-1">Billeder</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl lg:text-4xl font-bold leading-none">{totalParticipants}</span>
            <span className="text-sm text-gray-500 mt-1">Deltagere</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl lg:text-4xl font-bold leading-none">{events.length}</span>
            <span className="text-sm text-gray-500 mt-1">Events</span>
          </div>
        </div>
      </div>

      <div className="bg-nory-black relative overflow-hidden h-[50vh] lg:h-auto order-0 lg:order-none">
        <div className="grid grid-cols-2 grid-rows-2 h-full gap-[3px] p-[3px]">
          <div className="row-span-2 bg-gray-800">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <span className="text-6xl">📸</span>
            </div>
          </div>
          <div className="bg-gray-700">
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
          </div>
          <div className="bg-gray-600">
            <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <span className="text-4xl">🎊</span>
            </div>
          </div>
        </div>

        {latestEvent && (
          <div className="absolute bottom-4 lg:bottom-8 left-4 lg:left-8 right-4 lg:right-8 bg-nory-white border-3 border-nory-black rounded-2xl p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0_#1a1a1a]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-sm lg:text-base">Seneste begivenhed</h4>
                <p className="text-xs lg:text-sm text-gray-500">{latestEvent.name}</p>
              </div>
            </div>
            <Link
              href={`/remote/${latestEvent.id}`}
              className="px-5 py-2.5 bg-nory-black text-nory-white rounded-[10px] text-sm font-semibold no-underline transition-all hover:bg-nory-yellow hover:text-nory-black whitespace-nowrap"
            >
              Se album →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
