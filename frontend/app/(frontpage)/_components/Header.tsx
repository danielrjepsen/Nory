'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  instanceName?: string;
}

export function Header({ instanceName = 'NORY' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-12 py-5 bg-nory-white border-b-2 border-nory-black">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-10 h-10 bg-nory-yellow border-2 border-nory-black rounded-[10px] p-1.5 shadow-[2px_2px_0_#1a1a1a]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon points="0,0 48,0 48,48 0,48" fill="#1a1a1a"/>
            <polygon points="0,0 48,48 0,48" fill="#ffe951"/>
            <polygon points="52,0 72,0 100,24 72,48 52,48" fill="#1a1a1a"/>
            <polygon points="0,76 28,52 28,100 0,100" fill="#1a1a1a"/>
            <polygon points="52,52 100,52 100,100 52,100" fill="#1a1a1a"/>
            <polygon points="100,52 100,100 52,52" fill="#ffe951"/>
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight">{instanceName}</span>
      </Link>

      <Link
        href="/login"
        className="flex items-center gap-2 px-5 py-2.5 bg-nory-black text-nory-white border-2 border-nory-black rounded-[10px] text-sm font-semibold no-underline transition-all hover:bg-nory-yellow hover:text-nory-black"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        Log ind
      </Link>
    </header>
  );
}
