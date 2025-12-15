'use client';

import React, { memo, useMemo } from 'react';
import type { EventTheme } from '../_types';
import { ParticleConfig, DefaultColors } from '../_constants';

interface ParticleFieldProps {
  theme?: EventTheme | null;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  colorIndex: number;
  duration: number;
  delay: number;
}

function ParticleFieldComponent({ theme }: ParticleFieldProps) {
  const primaryColor = theme?.primaryColor || DefaultColors.primary;
  const secondaryColor = theme?.secondaryColor || DefaultColors.secondary;
  const accentColor = theme?.accentColor || DefaultColors.accent;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: ParticleConfig.COUNT }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: ParticleConfig.SIZES[i % ParticleConfig.SIZES.length],
      colorIndex: i % 4,
      duration:
        ParticleConfig.MIN_ANIMATION_DURATION +
        Math.random() *
          (ParticleConfig.MAX_ANIMATION_DURATION - ParticleConfig.MIN_ANIMATION_DURATION),
      delay: -(Math.random() * 30),
    }));
  }, []);

  const getParticleGradient = (colorIndex: number): string => {
    switch (colorIndex) {
      case 0:
        return `radial-gradient(circle, ${primaryColor}CC 0%, ${primaryColor}00 70%)`;
      case 1:
        return `radial-gradient(circle, ${secondaryColor}99 0%, ${secondaryColor}00 70%)`;
      case 2:
        return 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)';
      default:
        return `radial-gradient(circle, ${accentColor}80 0%, ${accentColor}00 70%)`;
    }
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden z-[1] pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: getParticleGradient(particle.colorIndex),
              filter: 'blur(0.5px)',
              animation: `particleFloat ${particle.duration}s infinite linear`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes particleFloat {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

export const ParticleField = memo(ParticleFieldComponent);
