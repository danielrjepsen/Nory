'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function CreateEventCard() {
    const { t } = useTranslation('dashboard');

    return (
        <Link
            href="/dashboard/events/create"
            className="group relative bg-nory-bg dark:bg-nory-card/50 border-[3px] border-dashed border-nory-border/40 dark:border-nory-border/30 rounded-xl transition-all duration-200 hover:border-solid hover:border-nory-border hover:bg-nory-card dark:hover:bg-nory-card hover:shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] flex flex-col items-center justify-center gap-3.5 min-h-[280px] overflow-hidden"
            aria-label={t('events.createNew')}
        >
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-[20%] w-[200px] h-[200px] rounded-full bg-nory-yellow/15 blur-3xl" />
                <div className="absolute top-0 right-[20%] w-[150px] h-[150px] rounded-full bg-nory-yellow/10 blur-3xl" />
            </div>

            <div className="relative z-10 w-12 h-12 bg-nory-card dark:bg-nory-bg border-[3px] border-nory-border rounded-lg flex items-center justify-center shadow-brutal-sm transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bg-nory-yellow group-hover:rotate-90 group-hover:scale-110 group-hover:shadow-brutal">
                <svg
                    className="w-6 h-6 text-nory-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </div>

            <span className="relative z-10 font-grotesk font-semibold text-sm text-nory-muted group-hover:text-nory-text transition-colors duration-200">
                {t('events.createNew')}
            </span>
        </Link>
    );
}
