'use client';

import React from 'react';

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function ContentHeader({ title, subtitle, className = '' }: ContentHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
