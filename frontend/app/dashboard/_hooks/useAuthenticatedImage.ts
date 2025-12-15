import { useState, useEffect, useRef, useCallback } from 'react';
import EventsService from '../_services/events';

interface UseAuthenticatedImageOptions {
  photoId: string;
  imageUrl: string;
  enabled?: boolean;
}

interface UseAuthenticatedImageReturn {
  imageSrc: string;
  isLoading: boolean;
  error: boolean;
  imageLoaded: boolean;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export function useAuthenticatedImage({
  photoId,
  imageUrl,
  enabled = true,
}: UseAuthenticatedImageOptions): UseAuthenticatedImageReturn {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const loadImage = useCallback(async () => {
    if (!enabled) return;

    try {
      if (cacheRef.current.has(photoId)) {
        const cachedUrl = cacheRef.current.get(photoId)!;
        setImageSrc(cachedUrl);
        setIsLoading(false);
        setImageLoaded(true);
        return;
      }

      setIsLoading(true);
      setError(false);
      setImageLoaded(false);

      const blob = await EventsService.loadAuthenticatedImage(imageUrl);
      const blobUrl = URL.createObjectURL(blob);

      cacheRef.current.set(photoId, blobUrl);
      setImageSrc(blobUrl);
    } catch (err) {
      console.error('Failed to load authenticated image:', err);
      setError(true);
      setIsLoading(false);
      setImageLoaded(false);
    }
  }, [photoId, imageUrl, enabled]);

  useEffect(() => {
    loadImage();

    return () => {
      cacheRef.current.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
      cacheRef.current.clear();
    };
  }, [loadImage]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setError(true);
    setIsLoading(false);
    setImageLoaded(false);
  }, []);

  return {
    imageSrc,
    isLoading,
    error,
    imageLoaded,
    handleImageLoad,
    handleImageError,
  };
}
