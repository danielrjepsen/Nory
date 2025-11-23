'use client';

import React from 'react';
import { useFloatingAnimation, UseFloatingAnimationOptions } from '@/app/dashboard/_hooks/useFloatingAnimation';

interface FloatingParticlesProps extends UseFloatingAnimationOptions {
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingParticles({
  className = '',
  style = {},
  ...animationOptions
}: FloatingParticlesProps) {
  const particles = useFloatingAnimation(animationOptions);

  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        ...style
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: particle.type === 'particle' ? '50%' : particle.type === 'star' ? '0' : '50%',
            opacity: particle.opacity,
            clipPath: particle.type === 'star' 
              ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              : 'none',
            boxShadow: particle.type === 'star' ? `0 0 ${particle.size * 2}px ${particle.color}` : 'none',
            filter: particle.type === 'particle' ? 'blur(0.5px)' : 'none',
            animation: particle.type === 'star' 
              ? `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`
              : 'none',
            transition: 'all 0.1s linear'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}