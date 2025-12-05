'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@/app/dashboard/_components/icons/PlusIcon';

interface EmptyStateProps {
    onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
    const { t } = useTranslation('dashboard');

    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-white/75 backdrop-blur-xl rounded-[26px] p-12 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-center max-w-md">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PlusIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('events.noEvents')}
                </h3>
                <p className="text-base text-gray-600 mb-8">
                    {t('events.noEventsDescription')}
                </p>
                <button
                    onClick={onCreateClick}
                    className="bg-gray-900 text-white border-none rounded-xl px-6 py-3 text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-800"
                    type="button"
                >
                    {t('events.createButton')}
                </button>
            </div>
        </div>
    );
}