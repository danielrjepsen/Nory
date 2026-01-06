'use client';

import React from 'react';

interface Step {
    label: string;
    title: string;
}

interface WizardStepperProps {
    steps: Step[];
    activeStep: number;
    onStepClick?: (stepIndex: number) => void;
}

export function WizardStepper({ steps, activeStep, onStepClick }: WizardStepperProps) {
    return (
        <div className="flex border-2 border-nory-border rounded-[14px] overflow-hidden">
            {steps.map((step, index) => {
                const isCompleted = index < activeStep;
                const isActive = index === activeStep;
                const canClick = onStepClick && index < activeStep;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => canClick && onStepClick(index)}
                        disabled={!canClick}
                        className={`
                            flex-1 flex items-center gap-3 px-5 py-4
                            transition-all duration-150
                            ${index < steps.length - 1 ? 'border-r-2 border-nory-border' : ''}
                            ${isCompleted ? 'bg-nory-text dark:bg-nory-card' : isActive ? 'bg-nory-yellow' : 'bg-nory-bg'}
                            ${canClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}
                        `}
                    >
                        <div
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                font-mono font-bold text-[0.85rem] flex-shrink-0
                                border-2 border-nory-border
                                ${isCompleted ? 'bg-nory-yellow' : 'bg-nory-card'}
                            `}
                        >
                            {isCompleted ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span
                                className={`
                                    text-[0.7rem] font-semibold uppercase tracking-wide
                                    ${isCompleted ? 'text-nory-bg dark:text-nory-muted' : isActive ? 'text-nory-black' : 'text-nory-muted'}
                                `}
                            >
                                {step.label}
                            </span>
                            <span
                                className={`
                                    text-[0.95rem] font-bold
                                    ${isCompleted ? 'text-nory-card dark:text-nory-text' : isActive ? 'text-nory-black' : 'text-nory-text'}
                                `}
                            >
                                {step.title}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
