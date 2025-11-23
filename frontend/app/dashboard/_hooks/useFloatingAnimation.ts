'use client';

import { useState, useEffect } from 'react';

export interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  type: 'particle' | 'star' | 'orb';
}

export interface UseFloatingAnimationOptions {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  sizeRange?: [number, number];
  types?: Array<'particle' | 'star' | 'orb'>;
}

export function useFloatingAnimation({
  particleCount = 30,
  colors = ['rgba(255, 255, 255, 0.6)', 'rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.5)'],
  speed = 1,
  sizeRange = [2, 6],
  types = ['particle', 'star']
}: UseFloatingAnimationOptions = {}) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    const initialParticles: FloatingParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * speed,
      opacity: 0.3 + Math.random() * 0.7,
      type: types[Math.floor(Math.random() * types.length)]
    }));

    setParticles(initialParticles);
  }, [particleCount, colors.join(','), speed, sizeRange.join(','), types.join(',')]);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -10 ? 110 : particle.y - particle.speed * 0.1,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id.charCodeAt(0)) * 0.05
      })));
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return particles;
}