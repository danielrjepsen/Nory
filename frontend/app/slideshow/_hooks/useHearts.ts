'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Heart, AnimatingHeart } from '../_types';
import { HeartAnimation, Limits } from '../_constants';

interface UseHeartsReturn {
  animatingHearts: AnimatingHeart[];
  addHeart: (heart: Heart) => void;
  clearHearts: () => void;
}

function createAnimatingHeart(heart: Heart): AnimatingHeart {
  const randomX = Math.random() * 70 + 15; // 15% to 85% of screen width
  const randomDelay = Math.random() * HeartAnimation.MAX_DELAY;
  const randomDuration =
    HeartAnimation.MIN_DURATION +
    Math.random() * (HeartAnimation.MAX_DURATION - HeartAnimation.MIN_DURATION);
  const randomScale =
    HeartAnimation.MIN_SCALE +
    Math.random() * (HeartAnimation.MAX_SCALE - HeartAnimation.MIN_SCALE);

  return {
    ...heart,
    animationKey: `${heart.id}-${Date.now()}`,
    startTime: Date.now(),
    randomX,
    randomDelay,
    randomDuration,
    randomScale,
  };
}

export function useHearts(): UseHeartsReturn {
  const [animatingHearts, setAnimatingHearts] = useState<AnimatingHeart[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const processedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
      processedIdsRef.current.clear();
    };
  }, []);

  const addHeart = useCallback((heart: Heart) => {
    if (processedIdsRef.current.has(heart.id)) {
      return;
    }

    processedIdsRef.current.add(heart.id);

    const animatingHeart = createAnimatingHeart(heart);
    setAnimatingHearts((prev) => [...prev, animatingHeart]);

    const totalDuration = animatingHeart.randomDuration + animatingHeart.randomDelay + 500;
    const timeout = setTimeout(() => {
      setAnimatingHearts((prev) =>
        prev.filter((h) => h.animationKey !== animatingHeart.animationKey)
      );
      timeoutsRef.current.delete(heart.id);
      processedIdsRef.current.delete(heart.id);
    }, totalDuration);

    timeoutsRef.current.set(heart.id, timeout);

    if (processedIdsRef.current.size > Limits.MAX_PROCESSED_HEARTS) {
      processedIdsRef.current.clear();
    }
  }, []);

  const clearHearts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    processedIdsRef.current.clear();
    setAnimatingHearts([]);
  }, []);

  return {
    animatingHearts,
    addHeart,
    clearHearts,
  };
}
