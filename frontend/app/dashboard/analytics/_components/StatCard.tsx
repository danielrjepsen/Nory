'use client';

import React from 'react';
import { formatNumber } from '../../_services/analytics';

interface StatCardProps {
  title: string;
  value: number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  changeLabel?: string;
  featured?: boolean;
}

export function StatCard({ title, value, change, changeLabel, featured = false }: StatCardProps) {
  return (
    <div
      className={`
        border-[3px] border-nory-border rounded-xl p-6 shadow-brutal
        transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg
        ${featured ? 'bg-nory-yellow' : 'bg-nory-card'}
      `}
    >
      <span className="text-xs font-bold uppercase tracking-wide text-nory-text block mb-3">
        {title}
      </span>
      <div className="font-grotesk text-[52px] font-extrabold leading-none mb-4 text-nory-text">
        {formatNumber(value)}
      </div>
      {change && (
        <span
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold
            border-2 border-nory-border
            ${change.isPositive ? 'bg-[#7BED9F]' : 'bg-[#ff7675]'} text-nory-black
          `}
        >
          {change.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {change.value}% {changeLabel}
        </span>
      )}
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="18,15 12,9 6,15" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}
