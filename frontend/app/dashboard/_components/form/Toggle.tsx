'use client';

import React from 'react';

interface ToggleProps {
    label: string;
    description?: string;
    icon?: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export default function Toggle({
    label,
    description,
    icon,
    checked,
    onChange,
    disabled = false,
    className = ''
}: ToggleProps) {
    return (
        <div
            className={`
                flex items-center justify-between p-4
                rounded-btn border-2 transition-all duration-150
                ${checked ? 'bg-nory-yellow border-nory-border' : 'bg-nory-bg border-transparent'}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-nory-border'}
                ${className}
            `}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-8 h-8 bg-nory-card rounded-lg flex items-center justify-center flex-shrink-0">
                        {icon}
                    </div>
                )}
                <span className={`font-semibold text-[0.9rem] font-grotesk ${checked ? 'text-nory-black' : 'text-nory-text'}`}>
                    {label}
                </span>
            </div>

            <div
                className={`
                    relative w-11 h-6 rounded-full border-2 border-nory-border
                    transition-all duration-150 flex-shrink-0 ml-3 bg-nory-card
                `}
            >
                <div
                    className={`
                        absolute top-0.5 w-4 h-4 rounded-full
                        transition-all duration-150
                        ${checked ? 'left-5 bg-nory-text' : 'left-0.5 bg-nory-muted'}
                    `}
                />
            </div>
        </div>
    );
}
