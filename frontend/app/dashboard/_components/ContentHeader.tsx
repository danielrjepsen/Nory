'use client';

import React from 'react';

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function ContentHeader({ title, subtitle, className = '' }: ContentHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-heading xl:text-heading-xl 2xl:text-heading-2xl text-nory-text font-grotesk">
        {title}
      </h1>
      {subtitle && (
        <p className="text-body xl:text-body-xl text-nory-muted font-grotesk mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
