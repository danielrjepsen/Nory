import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

const SKELETON_COUNT = 4;

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 w-full max-w-[1200px] mx-auto">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <LoadingSkeleton key={index} />
      ))}
    </div>
  );
}