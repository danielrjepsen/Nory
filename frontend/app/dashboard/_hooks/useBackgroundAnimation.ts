'use client';

import { useState, useEffect } from 'react';

export interface BackgroundWave {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export interface UseBackgroundAnimationOptions {
  colors?: string[];
  waveCount?: number;
  speed?: number;
  intensity?: number;
}

export function useBackgroundAnimation({
  colors = ['rgba(59, 130, 246, 0.1)', 'rgba(147, 51, 234, 0.1)', 'rgba(16, 185, 129, 0.1)'],
  waveCount = 5,
  speed = 0.01,
  intensity = 40
}: UseBackgroundAnimationOptions = {}) {
  const [time, setTime] = useState(0);
  const [waves, setWaves] = useState<BackgroundWave[]>([]);

  useEffect(() => {
    const initialWaves: BackgroundWave[] = Array.from({ length: waveCount }, (_, i) => ({
      x: 50,
      y: 50,
      size: 600 + i * 100,
      opacity: 0.1 - i * 0.015,
      color: colors[i % colors.length]
    }));
    
    setWaves(initialWaves);
  }, [waveCount, colors.join(',')]);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setTime(prevTime => {
        const newTime = prevTime + speed;
        
        setWaves(prevWaves => prevWaves.map((wave, i) => ({
          ...wave,
          x: 50 + Math.sin(newTime * (0.8 + i * 0.1)) * intensity,
          y: 50 + Math.cos(newTime * (0.6 + i * 0.1)) * (intensity * 0.8),
          size: wave.size + Math.sin(newTime * (0.5 + i * 0.1)) * 50
        })));
        
        return newTime;
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed, intensity]);

  return { waves, time };
}