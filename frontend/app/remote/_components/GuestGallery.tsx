'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { EventHeader } from './EventHeader';
import { GalleryHeader } from './GalleryHeader';
import { PhotoUploadModal } from './PhotoUploadModal';
import { ImageModal } from './ImageModal';
import { PhotoGrid } from './PhotoGrid';
import { MemoryOptIn } from './MemoryOptIn';
import { getApiUrl } from '@/utils/urls';
import type { PublicEventData, EventApp } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/types';
import type { UsePhotoManagementReturn } from '../_hooks/types';

export interface GuestGalleryProps {
  eventData: PublicEventData;
  eventTheme: EventTheme | null;
  apps: EventApp[];
  photoManagement: UsePhotoManagementReturn;
  onMemoryOptInSuccess: () => Promise<void>;
}

export function GuestGallery({
  eventData,
  eventTheme,
  apps,
  photoManagement,
  onMemoryOptInSuccess,
}: GuestGalleryProps) {
  const { t } = useTranslation('remote');
  const {
    photos,
    categories,
    photosLoading,
    uploading,
    showUploadModal,
    selectedFiles,
    selectedCategoryId,
    imageModalOpen,
    selectedPhotoIndex,
    setShowUploadModal,
    setSelectedFiles,
    setSelectedCategoryId,
    uploadPhotos,
    openPhotoModal,
    closePhotoModal,
    nextPhoto,
    previousPhoto,
  } = photoManagement;

  const handleOpenUpload = useCallback(() => setShowUploadModal(true), [setShowUploadModal]);
  const handleCloseUpload = useCallback(() => setShowUploadModal(false), [setShowUploadModal]);

  const navigateToApp = useCallback((appComponent: string) => {
    window.location.href = `/remote/${eventData.id}/${appComponent}`;
  }, [eventData.id]);

  return (
    <>
      <EventHeader
        eventData={eventData}
        eventTheme={eventTheme}
        onUploadClick={handleOpenUpload}
      />

      <MemoryOptIn eventId={eventData.id} onOptInSuccess={onMemoryOptInSuccess} />

      {apps.length > 0 && (
        <div className="apps-section">
          <p className="apps-header">{t('gallery.quickFeatures')}</p>
          <div className="apps-grid">
            {apps.map((app) => (
              <div
                key={app.id}
                className="app"
                onClick={() => navigateToApp(app.appType.component)}
              >
                <div className="app-icon" style={{ background: app.appType.color }} />
                <span className="app-label">{app.appType.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="gallery">
        <GalleryHeader eventData={eventData} photosCount={photos.length} />
        <PhotoGrid
          photos={photos}
          photosLoading={photosLoading}
          apiBaseUrl={getApiUrl()}
          eventStatus={eventData.status}
          eventTheme={eventTheme}
          onImageClick={openPhotoModal}
        />
      </div>

      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={handleCloseUpload}
        categories={categories}
        selectedFiles={selectedFiles}
        selectedCategoryId={selectedCategoryId}
        uploading={uploading}
        onFilesChange={setSelectedFiles}
        onCategoryChange={setSelectedCategoryId}
        onUpload={uploadPhotos}
        eventTheme={eventTheme}
      />

      <ImageModal
        isOpen={imageModalOpen}
        photos={photos}
        selectedIndex={selectedPhotoIndex}
        onClose={closePhotoModal}
        onNext={nextPhoto}
        onPrevious={previousPhoto}
        apiBaseUrl={getApiUrl()}
      />

      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          overflow-y: auto !important;
          height: auto !important;
          min-height: 100vh;
        }
        .gallery {
          background: white;
          border-radius: 24px 24px 0 0;
          padding: 40px 20px 0;
          box-shadow: 0 -5px 30px rgba(0,0,0,0.03);
          margin-top: 30px;
          min-height: calc(100vh - 500px);
          padding-bottom: 0;
        }
        .gallery-header {
          text-align: center;
          margin-bottom: 35px;
        }
        .gallery-title {
          font-size: 28px;
          font-weight: 400;
          color: #2F4C39;
          margin-bottom: 8px;
        }
        .gallery-subtitle {
          font-size: 13px;
          color: #8E8E93;
          font-style: italic;
        }
        @media (max-width: 640px) {
          .gallery {
            padding: 30px 15px 0;
            margin-top: 20px;
            min-height: calc(100vh - 400px);
          }
        }
      `}</style>
    </>
  );
}
