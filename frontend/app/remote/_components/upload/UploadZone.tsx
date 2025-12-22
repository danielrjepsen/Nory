'use client';

import { useRef, useCallback } from 'react';
import styles from '../PhotoUploadModal.module.css';

interface UploadZoneProps {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  dragDropText: string;
  selectMultipleText: string;
  filesSelectedText: string;
}

export function UploadZone({
  selectedFiles,
  onFilesChange,
  dragDropText,
  selectMultipleText,
  filesSelectedText,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={styles.uploadZone}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <div className={styles.uploadIcon}>📸</div>
      <div className={styles.uploadText}>
        {selectedFiles.length > 0 ? filesSelectedText : dragDropText}
      </div>
      <div className={styles.uploadHint}>
        {selectedFiles.length > 0
          ? selectedFiles.map((f) => f.name).join(', ')
          : selectMultipleText}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className={styles.hiddenInput}
        onChange={handleFileSelect}
      />
    </div>
  );
}
