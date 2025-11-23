import React from 'react';

const PHOTO_SKELETON_COUNT = 6;

export function LoadingSkeleton() {
    return (
        <div className="bg-white/75 backdrop-blur-xl rounded-[26px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] min-h-[320px] animate-pulse">
            {/* head status badge and menu */}
            <div className="flex justify-between mb-5">
                <div className="w-[60px] h-6 bg-gray-200 rounded-xl" />
                <div className="w-6 h-6 bg-gray-200 rounded" />
            </div>

            {/* event info */}
            <div className="mb-6">
                <div className="w-4/5 h-6 bg-gray-200 rounded mb-2" />
                <div className="w-3/5 h-4 bg-gray-200 rounded mb-1" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>

            {/* photo grid */}
            <div className="grid grid-cols-3 gap-2 mb-5">
                {Array.from({ length: PHOTO_SKELETON_COUNT }).map((_, index) => (
                    <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg"
                    />
                ))}
            </div>
        </div>
    );
}