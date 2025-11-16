import React from 'react';

interface PlusIconProps {
    className?: string;
}

export function PlusIcon({ className = 'w-6 h-6' }: PlusIconProps) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}