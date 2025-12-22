'use client';

import React from 'react';
import { formatNumber } from '../../_services/analytics';

interface MiniStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export function MiniStatCard({ title, value, icon }: MiniStatCardProps) {
  return (
    <div className="bg-nory-card border-[3px] border-nory-border rounded-xl py-5 px-6 flex items-center justify-between shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-nory-muted uppercase tracking-wide mb-1.5">
          {title}
        </span>
        <span className="font-grotesk text-4xl font-extrabold leading-none text-nory-text">
          {formatNumber(value)}
        </span>
      </div>
      <div className="w-12 h-12 rounded-[10px] bg-nory-card border-[3px] border-nory-border flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}
