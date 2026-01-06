'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

function PolaroidIllustration() {
    return (
        <div className="relative w-60 h-44 sm:w-72 sm:h-52 mb-10 group">
            <div
                className="absolute polaroid w-28 sm:w-32 left-0 top-5 -rotate-12 bg-nory-card border-[2.5px] border-nory-border rounded-xl p-2 pb-7 shadow-brutal transition-all duration-400 ease-out group-hover:-rotate-[18deg] group-hover:-translate-x-2.5 group-hover:-translate-y-1.5 z-[1]"
            >
                <div className="w-full aspect-[4/3] rounded-lg flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                    </svg>
                </div>
            </div>

            <div
                className="absolute polaroid w-32 sm:w-36 left-1/2 -translate-x-1/2 top-0 rotate-3 bg-nory-card border-[2.5px] border-nory-border rounded-xl p-2.5 pb-8 shadow-brutal transition-all duration-400 ease-out group-hover:rotate-0 group-hover:-translate-y-2.5 z-[2]"
            >
                <div className="w-full aspect-[4/3] bg-nory-yellow rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-nory-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                </div>
                <div className="absolute -bottom-2.5 -right-2.5 w-7 h-7 sm:w-8 sm:h-8 bg-nory-yellow border-[2.5px] border-nory-border rounded-full flex items-center justify-center shadow-brutal-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                </div>
            </div>

            <div
                className="absolute polaroid w-26 sm:w-[115px] right-0 top-7 rotate-[10deg] bg-nory-card border-[2.5px] border-nory-border rounded-xl p-2 pb-7 shadow-brutal transition-all duration-400 ease-out group-hover:rotate-[16deg] group-hover:translate-x-2.5 group-hover:-translate-y-1.5 z-[1]"
            >
                <div className="w-full aspect-[4/3] rounded-lg flex items-center justify-center bg-gradient-to-br from-[#f093fb] to-[#f5576c]">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

function FeaturePills() {
    const { t } = useTranslation('dashboard');

    const features = [
        {
            key: 'photos',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
            ),
            label: t('events.empty.feature.photos'),
        },
        {
            key: 'slideshow',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                </svg>
            ),
            label: t('events.empty.feature.slideshow'),
        },
        {
            key: 'app',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <path d="M12 18h.01"/>
                </svg>
            ),
            label: t('events.empty.feature.app'),
        },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10 sm:mt-12">
            {features.map((feature) => (
                <div
                    key={feature.key}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-nory-card border-2 border-nory-border rounded-full text-xs sm:text-[13px] font-medium shadow-brutal-sm transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal hover:bg-nory-yellow"
                >
                    <span className="w-4 h-4">{feature.icon}</span>
                    <span className="font-grotesk">{feature.label}</span>
                </div>
            ))}
        </div>
    );
}

export function EmptyState() {
    const { t } = useTranslation('dashboard');

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:py-16">
            <PolaroidIllustration />

            <div className="text-center mb-8">
                <h2 className="font-bricolage font-extrabold text-2xl sm:text-[28px] tracking-tight mb-2.5 text-nory-text">
                    {t('events.empty.title')}
                </h2>
                <p className="text-sm sm:text-[15px] text-nory-muted max-w-[380px] leading-relaxed">
                    {t('events.empty.description')}
                </p>
            </div>

            <Link
                href="/dashboard/events/create"
                className="flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 bg-nory-yellow border-[2.5px] border-nory-border rounded-btn font-grotesk font-semibold text-[15px] sm:text-base shadow-brutal transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                {t('events.empty.cta')}
            </Link>

            <FeaturePills />
        </div>
    );
}
