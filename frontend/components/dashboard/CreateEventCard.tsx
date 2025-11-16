import React from 'react';
import { PlusIcon } from '@/components/icons/PlusIcon';

interface CreateEventCardProps {
    onClick: () => void;
}

export function CreateEventCard({ onClick }: CreateEventCardProps) {
    return (
        <button
            onClick={onClick}
            className="group bg-white/75 backdrop-blur-xl rounded-[26px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-2 border-dashed border-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:border-gray-900 flex items-center justify-center min-h-[320px]"
            type="button"
            aria-label="Create new event"
        >
            <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Create New Event
                </h3>
                <p className="text-sm text-gray-600">
                    Start collecting photos for your next event
                </p>
            </div>
        </button>
    );
}