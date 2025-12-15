'use client';

import { useEffect, useState, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Heart } from '../_types';

interface AnimatingHeart extends Heart {
  animationKey: string;
  randomX: number;
  randomDelay: number;
  randomDuration: number;
  randomScale: number;
}

interface Props {
  hearts: Heart[];
}

const BASE_DURATION = 7000;
const DURATION_VARIANCE = 1000;
const MAX_PROCESSED = 100;

function createAnimatingHeart(heart: Heart): AnimatingHeart {
  return {
    ...heart,
    animationKey: `${heart.id}-${Date.now()}`,
    randomX: Math.random() * 70 + 15,
    randomDelay: Math.random() * 300,
    randomDuration: BASE_DURATION + Math.random() * DURATION_VARIANCE,
    randomScale: 0.9 + Math.random() * 0.3,
  };
}

function HeartAnimationsInner({ hearts }: Props) {
  const { t } = useTranslation('slideshow');
  const [animating, setAnimating] = useState<AnimatingHeart[]>([]);
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const processed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hearts?.length) return;

    hearts.forEach((heart) => {
      if (processed.current.has(heart.id)) return;
      processed.current.add(heart.id);

      const animHeart = createAnimatingHeart(heart);
      setAnimating((prev) => [...prev, animHeart]);

      const duration = animHeart.randomDuration + animHeart.randomDelay + 500;
      const timeout = setTimeout(() => {
        setAnimating((prev) => prev.filter((h) => h.animationKey !== animHeart.animationKey));
        timeouts.current.delete(heart.id);
        processed.current.delete(heart.id);
      }, duration);

      timeouts.current.set(heart.id, timeout);
    });

    if (processed.current.size > MAX_PROCESSED) processed.current.clear();
  }, [hearts]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current.clear();
      processed.current.clear();
    };
  }, []);

  if (!animating.length) return null;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {animating.map((heart, i) => (
          <div
            key={heart.animationKey}
            className="absolute animate-heart-float"
            style={{
              left: `${heart.randomX}%`,
              bottom: 0,
              animationDelay: `${heart.randomDelay}ms`,
              animationDuration: `${heart.randomDuration}ms`,
              transform: `scale(${heart.randomScale})`,
              zIndex: 1000 + i,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2" style={{ filter: 'drop-shadow(0 0 10px rgba(255,105,180,0.8)) drop-shadow(0 0 20px rgba(255,105,180,0.4))' }}>
                ❤️
              </div>
              <div className="bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-white px-4 py-2 rounded-full shadow-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm animate-pulse">💖</span>
                  <span className="font-bold text-sm">{heart.userName || t('display.fallback.userName')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes heart-float {
          0% { transform: translateY(0) translateX(0) scale(0.3) rotate(0deg); opacity: 0; }
          10% { transform: translateY(-80px) translateX(-15px) scale(1) rotate(-5deg); opacity: 1; }
          25% { transform: translateY(-200px) translateX(20px) scale(1.1) rotate(5deg); opacity: 1; }
          50% { transform: translateY(-350px) translateX(-25px) scale(1.05) rotate(-3deg); opacity: 1; }
          75% { transform: translateY(-500px) translateX(30px) scale(1) rotate(8deg); opacity: 1; }
          90% { transform: translateY(-600px) translateX(-20px) scale(0.9) rotate(-5deg); opacity: 0.8; }
          100% { transform: translateY(-700px) translateX(40px) scale(0.5) rotate(15deg); opacity: 0; }
        }
        .animate-heart-float { animation: heart-float var(--duration, 7s) ease-out forwards; position: absolute; pointer-events: none; will-change: transform, opacity; }
      `}</style>
    </>
  );
}

export default memo(HeartAnimationsInner);
