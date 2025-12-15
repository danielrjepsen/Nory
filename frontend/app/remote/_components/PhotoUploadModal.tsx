'use client';

import { useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/app/_shared/types';
import type { EventTheme } from '../_hooks/types';

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

const EXCLUDED_CATEGORIES = ['uncategorized', 'default', 'general', 'misc', 'other'];

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const meaningfulCategories = useMemo(
    () => categories.filter((cat) => !EXCLUDED_CATEGORIES.includes(cat.name.toLowerCase().trim())),
    [categories]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      onFilesChange(files);
    },
    [onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      onFilesChange([...selectedFiles, ...files]);
    },
    [onFilesChange, selectedFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      fileInputRef.current?.click();
      return;
    }
    await onUpload();
  }, [selectedFiles.length, onUpload]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!isOpen) return null;

  const primary = eventTheme?.primaryColor || '#7877C6';
  const secondary = eventTheme?.secondaryColor || '#FF77C6';
  const accent = eventTheme?.accentColor || '#E8B4FF';

  return (
    <>
      <div className={`modal ${isOpen ? 'show' : ''}`} onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-modal" onClick={onClose}>
              &times;
            </button>
            <h3 className="modal-title">{t('gallery.uploadModal.title')}</h3>
            <p className="modal-subtitle">{t('gallery.uploadModal.subtitle')}</p>
            <div className="step-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>

          <div className="modal-body">
            <div className="upload-zone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={openFileDialog}>
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                {selectedFiles.length > 0
                  ? t('gallery.uploadModal.filesSelected', { count: selectedFiles.length })
                  : t('gallery.uploadModal.dragDrop')}
              </div>
              <div className="upload-hint">
                {selectedFiles.length > 0
                  ? selectedFiles.map((f) => f.name).join(', ')
                  : t('gallery.uploadModal.selectMultiple')}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {meaningfulCategories.length > 0 && (
              <div className="category-selection">
                <label className="category-label">{t('gallery.uploadModal.selectCategory')}</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="category-select"
                >
                  <option value="">{t('gallery.uploadModal.noCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {category.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading
                ? t('common.uploading')
                : selectedFiles.length > 0
                  ? t('common.upload')
                  : t('common.selectFiles')}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 20% 80%, ${primary}20 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${secondary}20 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${accent}15 0%, transparent 50%),
            rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          z-index: 9999;
        }
        .modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          width: 90%;
          max-width: 520px;
          max-height: 85vh;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 32px 64px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
            0 8px 32px ${primary}20;
          animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal-header {
          text-align: center;
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
          padding: 24px 60px 24px 24px;
        }
        .modal-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%);
          pointer-events: none;
        }
        .close-modal {
          position: absolute;
          top: 16px;
          right: 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 28px;
          font-weight: bold;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          line-height: 1;
        }
        .close-modal:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        .modal-title {
          color: rgba(255, 255, 255, 0.95);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          position: relative;
          z-index: 1;
        }
        .modal-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 0 0 24px 0;
          position: relative;
          z-index: 1;
        }
        .step-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        .dot.active {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }
        .modal-body {
          padding: 30px;
          max-height: 60vh;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.02);
        }
        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .upload-zone:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .upload-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .upload-hint {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }
        .category-selection {
          margin-top: 20px;
          padding: 0 20px;
        }
        .category-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
        .category-select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          font-size: 14px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .category-select:focus {
          border-color: ${primary};
        }
        .modal-footer {
          padding: 24px 30px;
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          background: rgba(0, 0, 0, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn {
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 14px;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }
        .btn-primary {
          background: linear-gradient(135deg, ${primary}, ${secondary});
          color: white;
          box-shadow: 0 4px 15px ${primary}40;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${primary}60;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.7) translateY(100px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
