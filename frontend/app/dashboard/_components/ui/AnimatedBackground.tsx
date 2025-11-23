'use client';

import React from 'react';
import { useBackgroundAnimation, UseBackgroundAnimationOptions } from '@/app/dashboard/_hooks/useBackgroundAnimation';

interface AnimatedBackgroundProps extends UseBackgroundAnimationOptions {
  gradient?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function AnimatedBackground({
  gradient = 'linear-gradient(135deg, #0f0f23 0%, #1a1625 100%)',
  className = '',
  style = {},
  children,
  ...animationOptions
}: AnimatedBackgroundProps) {
  const { waves } = useBackgroundAnimation(animationOptions);

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        background: gradient,
        overflow: 'hidden',
        ...style
      }}
    >
      {/* animated bg waves */}
      {waves.map((wave, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${wave.size}px`,
            height: `${wave.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${wave.color} 0%, transparent 70%)`,
            left: `${wave.x}%`,
            top: `${wave.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: wave.opacity,
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {children}
    </div>
  );
}