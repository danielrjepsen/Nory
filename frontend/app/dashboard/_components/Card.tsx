'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-nory-card border-3 border-nory-border rounded-card p-8 shadow-brutal ${className}`}>
      {children}
    </div>
  );
}
