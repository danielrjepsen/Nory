'use client';

import React from 'react';

interface FooterProps {
  instanceName?: string;
}

export function Footer({ instanceName = 'Nory' }: FooterProps) {
  return (
    <footer className="bg-nory-black text-white py-12 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-nory-yellow rounded-lg p-1.5">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon points="0,0 48,0 48,48 0,48" fill="#1a1a1a"/>
              <polygon points="0,0 48,48 0,48" fill="#ffe951"/>
              <polygon points="52,0 72,0 100,24 72,48 52,48" fill="#1a1a1a"/>
              <polygon points="0,76 28,52 28,100 0,100" fill="#1a1a1a"/>
              <polygon points="52,52 100,52 100,100 52,100" fill="#1a1a1a"/>
              <polygon points="100,52 100,100 52,52" fill="#ffe951"/>
            </svg>
          </div>
          <span className="text-lg font-semibold">{instanceName}</span>
        </div>

        <div className="text-sm text-white/50">
          Drevet af{' '}
          <a href="https://github.com" className="text-nory-yellow font-semibold no-underline hover:underline">
            NORY
          </a>
          {' · Self-hosted fotodeling'}
        </div>
      </div>
    </footer>
  );
}
