'use client';

import React from 'react';
import { formatNumber } from '../../_services/analytics';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, icon, color = '#3b82f6' }: StatCardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              margin: '0 0 8px 0',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
            }}
          >
            {formatNumber(value)}
          </p>
        </div>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
