import { useMemo } from 'react';
import type { EventTheme } from '../_hooks/types';

interface BackgroundParticlesProps {
  eventTheme: EventTheme | null;
  isMounted: boolean;
}

const PARTICLE_COUNT = 40;
const PARTICLE_SIZES = [3, 4, 2, 3];

const DEFAULT_GRADIENTS = [
  'radial-gradient(circle, rgba(255, 119, 198, 0.8) 0%, rgba(255, 119, 198, 0) 70%)',
  'radial-gradient(circle, rgba(120, 119, 198, 0.6) 0%, rgba(120, 119, 198, 0) 70%)',
  'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
  'radial-gradient(circle, rgba(255, 204, 119, 0.5) 0%, rgba(255, 204, 119, 0) 70%)',
];

function getThemedGradient(theme: EventTheme, variant: number): string {
  const gradients = [
    `radial-gradient(circle, ${theme.primaryColor}CC 0%, ${theme.primaryColor}00 70%)`,
    `radial-gradient(circle, ${theme.secondaryColor}99 0%, ${theme.secondaryColor}00 70%)`,
    'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
    `radial-gradient(circle, ${theme.accentColor}80 0%, ${theme.accentColor}00 70%)`,
  ];
  return gradients[variant];
}

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: (i * 2.5) % 100,
    duration: 25 + (i % 20),
    delay: -(i % 30),
    variant: i % 4,
  }));
}

export function BackgroundParticles({ eventTheme, isMounted }: BackgroundParticlesProps) {
  const particles = useMemo(generateParticles, []);

  if (!isMounted) return null;

  return (
    <div className="absolute w-full h-full overflow-hidden z-[1] pointer-events-none">
      {particles.map((p) => {
        const size = PARTICLE_SIZES[p.variant];
        const background = eventTheme
          ? getThemedGradient(eventTheme, p.variant)
          : DEFAULT_GRADIENTS[p.variant];

        return (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.left}%`,
              width: size,
              height: size,
              background,
              filter: 'blur(0.5px)',
              animation: `modernFloat ${p.duration}s infinite linear`,
              animationDelay: `${p.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
