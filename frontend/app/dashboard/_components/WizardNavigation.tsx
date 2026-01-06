'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface WizardNavigationProps {
    onBack: () => void;
    onNext: () => void;
    onCancel: () => void;
    onSubmit?: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canProceed: boolean;
    loading?: boolean;
    submitLabel?: string;
    nextLabel?: string;
    backLabel?: string;
    cancelLabel?: string;
}

export function WizardNavigation({
    onBack,
    onNext,
    onCancel,
    onSubmit,
    isFirstStep,
    isLastStep,
    canProceed,
    loading = false,
    submitLabel,
    nextLabel,
    backLabel,
    cancelLabel,
}: WizardNavigationProps) {
    const { t } = useTranslation('common');

    const back = backLabel ?? t('back');
    const next = nextLabel ?? t('next');
    const cancel = cancelLabel ?? t('cancel');
    const submit = submitLabel ?? t('createEvent');
    return (
        <div className="flex justify-between items-center pt-6 mt-8 border-t-2 border-nory-border/30">
            <button
                type="button"
                onClick={onBack}
                disabled={isFirstStep || loading}
                className={`
                    flex items-center gap-2 px-5 py-3
                    bg-nory-card border-2 border-nory-border rounded-btn
                    font-grotesk font-semibold text-[0.85rem] text-nory-text
                    transition-all duration-100
                    ${isFirstStep || loading ? 'opacity-30 cursor-not-allowed' : 'hover:bg-nory-bg'}
                `}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                </svg>
                {back}
            </button>

            <div className="flex gap-3 items-center">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-5 py-3 font-grotesk font-semibold text-[0.85rem] text-nory-muted hover:text-nory-black transition-colors"
                >
                    {cancel}
                </button>

                {isLastStep ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canProceed || loading}
                        className={`
                            flex items-center gap-2 px-7 py-3
                            bg-nory-yellow border-2 border-nory-border rounded-btn
                            font-grotesk font-bold text-[0.9rem] text-nory-black
                            shadow-brutal transition-all duration-100
                            ${!canProceed || loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg'}
                        `}
                    >
                        {loading ? (
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <>
                                {submit}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`
                            flex items-center gap-2 px-7 py-3
                            bg-nory-yellow border-2 border-nory-border rounded-btn
                            font-grotesk font-bold text-[0.9rem] text-nory-black
                            shadow-brutal transition-all duration-100
                            ${!canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg'}
                        `}
                    >
                        {next}
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
