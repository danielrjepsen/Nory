'use client';

import React from 'react';

interface ContentCardProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full',
};

export function ContentCard({ children, maxWidth = '4xl', className = '' }: ContentCardProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto py-8 px-4`}>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}
