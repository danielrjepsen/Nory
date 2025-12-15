import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { getPhotos, getPhotoCategories, uploadPhoto, trackEvent } from '../_services/guestApi';
import { AnalyticsEvents } from '../_constants/analytics';
import type { UsePhotoManagementReturn } from './types';

export function usePhotoManagement(eventId: string): UsePhotoManagementReturn {
  const queryClient = useQueryClient();
  const enabled = Boolean(eventId);

  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: queryKeys.photos.byEvent(eventId),
    queryFn: () => getPhotos(eventId, 50),
    enabled,
  });

  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.photos.categories(eventId),
    queryFn: () => getPhotoCategories(eventId),
    select: (data) => data.categories ?? [],
    enabled,
  });

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const openPhotoModal = useCallback((index: number) => {
    setSelectedPhotoIndex(index);
    setImageModalOpen(true);
  }, []);

  const closePhotoModal = useCallback(() => {
    setImageModalOpen(false);
    setSelectedPhotoIndex(null);
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || !photos.length) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  }, [selectedPhotoIndex, photos.length]);

  const previousPhoto = useCallback(() => {
    if (selectedPhotoIndex === null || !photos.length) return;
    setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1);
  }, [selectedPhotoIndex, photos.length]);

  const uploadMutation = useMutation({
    mutationFn: async ({ files, categoryId }: { files: File[]; categoryId: string }) => {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryId', categoryId);
        await uploadPhoto(eventId, formData);
      }
      return files.length;
    },
    onSuccess: async (uploadCount) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.photos.byEvent(eventId) });
      trackEvent(eventId, AnalyticsEvents.PhotoUploaded, {
        count: uploadCount,
        categoryId: selectedCategoryId,
      });
    },
  });

  useEffect(() => {
    const defaultCategory = categories.find((cat) => cat.isDefault);
    if (defaultCategory && !selectedCategoryId) {
      setSelectedCategoryId(defaultCategory.id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (!imageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPhoto();
      else if (e.key === 'ArrowLeft') previousPhoto();
      else if (e.key === 'Escape') closePhotoModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageModalOpen, nextPhoto, previousPhoto, closePhotoModal]);

  const refreshPhotos = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.photos.byEvent(eventId) });
  }, [queryClient, eventId]);

  const uploadPhotos = useCallback(async () => {
    if (!selectedFiles.length || !eventId) return;
    await uploadMutation.mutateAsync({ files: selectedFiles, categoryId: selectedCategoryId });
    setSelectedFiles([]);
    setShowUploadModal(false);
  }, [selectedFiles, eventId, selectedCategoryId, uploadMutation]);

  return {
    photos,
    categories,
    photosLoading,
    uploading: uploadMutation.isPending,
    selectedPhotoIndex,
    imageModalOpen,
    selectedFiles,
    selectedCategoryId,
    showUploadModal,
    setSelectedFiles,
    setSelectedCategoryId,
    setShowUploadModal,
    refreshPhotos,
    uploadPhotos,
    openPhotoModal,
    closePhotoModal,
    nextPhoto,
    previousPhoto,
  };
}
