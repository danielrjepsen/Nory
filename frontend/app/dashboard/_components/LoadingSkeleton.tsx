import React from 'react';

export function LoadingSkeleton() {
    return (
        <div className="bg-nory-card rounded-card overflow-hidden animate-pulse">
            <div className="h-[160px] grid grid-cols-3 gap-1.5 p-3">
                <div className="rounded-img bg-nory-bg" />
                <div className="rounded-img bg-nory-bg" />
                <div className="rounded-img bg-nory-bg" />
            </div>

            <div className="px-6 py-5 pb-6">
                <div className="w-14 h-5 bg-nory-bg rounded-badge mb-2.5" />
                <div className="w-4/5 h-5 bg-nory-bg rounded-[4px] mb-3" />
                <div className="flex justify-between items-center">
                    <div className="w-2/5 h-3.5 bg-nory-bg rounded-[4px]" />
                    <div className="w-16 h-3.5 bg-nory-bg rounded-[4px]" />
                </div>
            </div>
        </div>
    );
}