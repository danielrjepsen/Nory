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

export function Toggle({
    label,
    description,
    icon,
    checked,
    onChange,
    disabled = false,
    className = '',
}: ToggleProps) {
    return (
        <div
            className={`flex items-center gap-3 p-4 xl:p-5 rounded-btn border-2 transition-all duration-150 ${checked
                ? 'bg-nory-bg border-nory-border'
                : 'bg-nory-bg border-transparent hover:border-nory-border'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
            onClick={() => !disabled && onChange(!checked)}
        >
            {icon && (
                <div className="w-9 h-9 rounded-btn flex items-center justify-center flex-shrink-0 bg-nory-card">
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div
                    className={`font-semibold text-[0.9rem] font-grotesk ${checked ? 'text-nory-black' : 'text-nory-text'
                        }`}
                >
                    {label}
                </div>
                {description && (
                    <div
                        className={`text-[0.75rem] font-grotesk ${checked ? 'text-nory-black/60' : 'text-nory-muted'
                            }`}
                    >
                        {description}
                    </div>
                )}
            </div>
            <div className={`w-11 h-6 bg-nory-card border-2 border-nory-border rounded-full relative flex-shrink-0 ${checked ? 'bg-nory-yellow' : ''}`}>
                <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-150 ${checked ? 'left-[22px] bg-nory-text' : 'left-0.5 bg-nory-muted'
                        }`}
                />
            </div>
        </div>
    );
}

export default Toggle;
