'use client';

import { memo } from 'react';
import type { AmbilightAnimation, EventTheme, WavePosition } from '../_types';
import { AmbilightConfig, DefaultColors } from '../_constants';

interface Props {
  animation: AmbilightAnimation;
  theme?: EventTheme | null;
  colors?: string[];
}

function ellipse(wave: WavePosition, ratio: number, color: string, startOpacity: string, midOpacity: string, midStop: number, endStop: number) {
  return `radial-gradient(ellipse ${wave.size}px ${wave.size * ratio}px at ${wave.x}% ${wave.y}%, ${color}${startOpacity} 0%, ${color}${midOpacity} ${midStop}%, transparent ${endStop}%)`;
}

function AmbilightBackgroundInner({ animation, theme, colors }: Props) {
  const primary = colors?.[0] || theme?.primaryColor || DefaultColors.primary;
  const secondary = colors?.[1] || theme?.secondaryColor || DefaultColors.secondary;
  const accent = colors?.[2] || theme?.accentColor || DefaultColors.accent;

  const primaryWaves = [
    ellipse(animation.wave1, 0.7, primary, '80', '40', 30, 70),
    ellipse(animation.wave2, 0.8, secondary, '70', '30', 35, 75),
    ellipse(animation.wave3, 0.6, accent, '60', '20', 40, 80),
  ].join(', ');

  const secondaryWaves = [
    ellipse(animation.wave4, 0.5, primary, '60', '00', 60, 60),
    ellipse(animation.wave5, 0.9, secondary, '50', '00', 65, 65),
  ].join(', ');

  const conicGlow = `conic-gradient(from ${animation.time * 20}deg at 50% 50%, ${primary}30 0deg, ${secondary}25 120deg, ${accent}20 240deg, ${primary}30 360deg)`;

  return (
    <div className="absolute inset-0 -z-30">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e]" />
      <div
        className="absolute inset-0 transition-all duration-75 ease-out opacity-80"
        style={{ background: primaryWaves, filter: `blur(${AmbilightConfig.PRIMARY_BLUR}px) saturate(150%)` }}
      />
      <div
        className="absolute inset-0 transition-all duration-100 ease-out opacity-60"
        style={{ background: secondaryWaves, filter: `blur(${AmbilightConfig.SECONDARY_BLUR}px) saturate(120%)` }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: conicGlow, filter: `blur(${AmbilightConfig.TERTIARY_BLUR}px) saturate(110%)` }}
      />
    </div>
  );
}

export const AmbilightBackground = memo(AmbilightBackgroundInner);
