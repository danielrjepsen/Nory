'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Photo, Category, Heart } from '../_types';
import { SlideshowSpeed, Timing } from '../_constants';
import { getMediaType } from '../_utils/media';
import * as eventApi from '../_services/eventApi';

interface Options {
  eventId?: string;
  initialSpeed?: number;
  autoPlay?: boolean;
}

const LOADING_PHOTO: Photo = { id: 'loading', name: 'Loading...', url: '', categoryId: null, type: 'image' };
const HEART_DURATION = 3000;

export function useSlideshow(photos: Photo[], options: Options = {}) {
  const { eventId, initialSpeed = SlideshowSpeed.DEFAULT, autoPlay = true } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(initialSpeed);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastManualRef = useRef(0);
  const videoPlayingRef = useRef(false);

  const currentPhoto = useMemo(() => {
    if (photos.length === 0) return LOADING_PHOTO;
    return photos[Math.min(currentIndex, photos.length - 1)] || LOADING_PHOTO;
  }, [photos, currentIndex]);

  const isCurrentPhotoVideo = useCallback(() => getMediaType(currentPhoto) === 'video', [currentPhoto]);

  useEffect(() => {
    if (hasInitialized || !eventId) return;
    eventApi.fetchEventCategories(eventId).then((categories) => {
      if (categories.length > 0) {
        setAvailableCategories(categories);
        setSelectedCategory(categories[0].id);
        setHasInitialized(true);
      }
    }).catch(() => {});
  }, [eventId, hasInitialized]);

  useEffect(() => {
    setIsLoadingPhotos(false);
    if (photos.length > 0 && currentIndex >= photos.length) setCurrentIndex(0);
  }, [photos, currentIndex]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    if (isCurrentPhotoVideo() || videoPlayingRef.current || !isPlaying || photos.length === 0) return;

    timerRef.current = setTimeout(() => {
      if (Date.now() - lastManualRef.current >= Timing.MANUAL_ACTION_DEBOUNCE) {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }
    }, speed);

    return clearTimer;
  }, [currentIndex, isPlaying, speed, photos.length, isCurrentPhotoVideo, clearTimer]);

  const moveToNext = useCallback(() => {
    lastManualRef.current = Date.now();
    videoPlayingRef.current = false;
    if (photos.length > 0) setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const moveToPrevious = useCallback(() => {
    lastManualRef.current = Date.now();
    videoPlayingRef.current = false;
    if (photos.length > 0) setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const setCategory = useCallback((categoryId: string | null) => {
    if (categoryId) {
      setSelectedCategory(categoryId);
      setCurrentIndex(0);
      setIsLoadingPhotos(true);
      videoPlayingRef.current = false;
    }
  }, []);

  const onVideoStart = useCallback(() => {
    videoPlayingRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const onVideoEnd = useCallback(() => {
    videoPlayingRef.current = false;
    if (isPlaying && photos.length > 0) {
      setTimeout(() => setCurrentIndex((prev) => (prev + 1) % photos.length), Timing.POST_VIDEO_DELAY);
    }
  }, [isPlaying, photos.length]);

  const addHeart = useCallback((heart: Heart) => {
    setHearts((prev) => [...prev, heart]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== heart.id)), HEART_DURATION);
  }, []);

  return {
    currentIndex,
    isPlaying,
    speed,
    selectedCategory,
    currentPhoto,
    availableCategories,
    isLoadingPhotos,
    hearts,
    moveToNext,
    moveToPrevious,
    setPlaying: setIsPlaying,
    setSpeed,
    setCategory,
    onVideoStart,
    onVideoEnd,
    isCurrentPhotoVideo,
    addHeart,
  };
}
