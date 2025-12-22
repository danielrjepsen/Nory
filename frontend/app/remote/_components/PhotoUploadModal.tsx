'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/types';
import { UploadZone, CategorySelect } from './upload';
import styles from './PhotoUploadModal.module.css';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedFiles: File[];
  selectedCategoryId: string;
  uploading: boolean;
  onFilesChange: (files: File[]) => void;
  onCategoryChange: (categoryId: string) => void;
  onUpload: () => Promise<void>;
  eventTheme?: EventTheme | null;
}

export function PhotoUploadModal({
  isOpen,
  onClose,
  categories,
  selectedFiles,
  selectedCategoryId,
  uploading,
  onFilesChange,
  onCategoryChange,
  onUpload,
  eventTheme,
}: PhotoUploadModalProps) {
  const { t } = useTranslation('remote');

  const handleUpload = useCallback(async () => {
    await onUpload();
  }, [onUpload]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  const primary = eventTheme?.primaryColor || '#7877C6';
  const secondary = eventTheme?.secondaryColor || '#FF77C6';
  const accent = eventTheme?.accentColor || '#E8B4FF';

  const themeVars = {
    '--modal-primary': primary,
    '--modal-secondary': secondary,
    '--modal-accent': `${accent}15`,
    '--modal-primary-glow': `${primary}20`,
  } as React.CSSProperties;

  const buttonLabel = uploading
    ? t('common.uploading')
    : selectedFiles.length > 0
      ? t('common.upload')
      : t('common.selectFiles');

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} style={themeVars}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <h3 className={styles.title}>{t('gallery.uploadModal.title')}</h3>
          <p className={styles.subtitle}>{t('gallery.uploadModal.subtitle')}</p>
          <div className={styles.stepDots}>
            <span className={`${styles.dot} ${styles.dotActive}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </header>

        <div className={styles.body}>
          <UploadZone
            selectedFiles={selectedFiles}
            onFilesChange={onFilesChange}
            dragDropText={t('gallery.uploadModal.dragDrop')}
            selectMultipleText={t('gallery.uploadModal.selectMultiple')}
            filesSelectedText={t('gallery.uploadModal.filesSelected', { count: selectedFiles.length })}
          />

          <CategorySelect
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={onCategoryChange}
            label={t('gallery.uploadModal.selectCategory')}
            noCategory={t('gallery.uploadModal.noCategory')}
          />
        </div>

        <footer className={styles.footer}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleUpload}
            disabled={uploading}
          >
            {buttonLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
