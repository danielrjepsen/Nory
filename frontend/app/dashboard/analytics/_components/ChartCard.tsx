'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TimePeriod = 'week' | 'month' | 'year';

interface ChartData {
  label: string;
  value: number;
}

interface ChartCardProps {
  title?: string;
  data?: {
    week: ChartData[];
    month: ChartData[];
    year: ChartData[];
  };
}

const EMPTY_DATA = { week: [], month: [], year: [] };

export function ChartCard({ title, data }: ChartCardProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'analytics' });
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartData = (data ?? EMPTY_DATA)[period];
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const average = chartData.length > 0 ? Math.round(total / chartData.length) : 0;

  const highestIndex = chartData.findIndex((d) => d.value === maxValue);
  const displayTitle = title ?? t('chart.title');

  return (
    <div className="bg-nory-card border-[3px] border-nory-border rounded-xl p-6 h-full shadow-brutal">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg font-bold font-grotesk text-nory-text">{displayTitle}</h3>
        <div className="flex border-[3px] border-nory-border rounded-lg overflow-hidden shadow-[3px_3px_0_#1a1a1a]">
          {(['week', 'month', 'year'] as const).map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-4 py-2 text-[13px] font-semibold transition-colors
                ${i < 2 ? 'border-r-[3px] border-nory-border' : ''}
                ${period === p ? 'bg-nory-yellow' : 'bg-nory-card hover:bg-nory-bg'}
              `}
            >
              {t(`chart.periods.${p}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px] flex items-end justify-between px-4 mb-4 border-b-[3px] border-nory-border">
        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-nory-muted">
            {t('chart.noData')}
          </div>
        ) : (
          chartData.map((item, index) => {
            const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const isActive = index === highestIndex;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={`${period}-${index}`}
                className="flex flex-col items-center gap-2.5 flex-1"
              >
                <div className="relative h-[160px] w-full flex items-end justify-center">
                  <span
                    className={`
                      absolute -top-6 left-1/2 -translate-x-1/2 font-grotesk text-[13px] font-bold
                      transition-opacity duration-150 text-nory-text
                      ${isActive || isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    {item.value}
                  </span>
                  <div
                    className={`
                      w-10 rounded-t-md transition-all duration-200 cursor-pointer
                      ${isActive
                        ? 'bg-nory-yellow border-[3px] border-nory-border border-b-0'
                        : isHovered
                          ? 'bg-[#333]'
                          : 'bg-nory-black hover:bg-[#333]'
                      }
                    `}
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </div>
                <span className="text-[13px] font-semibold text-nory-muted">
                  {item.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-between items-baseline pt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-nory-muted">{t('chart.total')}:</span>
          <span className="font-grotesk text-[28px] font-extrabold text-nory-text">{total}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-nory-muted">{t('chart.average')}:</span>
          <span className="font-grotesk text-[28px] font-extrabold text-nory-text">{average}</span>
        </div>
      </div>
    </div>
  );
}
