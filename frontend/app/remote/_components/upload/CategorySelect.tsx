'use client';

import { useMemo } from 'react';
import type { Category } from '@/app/_shared/types';
import styles from '../PhotoUploadModal.module.css';

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  label: string;
  noCategory: string;
}

const EXCLUDED_CATEGORIES = ['uncategorized', 'default', 'general', 'misc', 'other'];

export function CategorySelect({
  categories,
  selectedCategoryId,
  onCategoryChange,
  label,
  noCategory,
}: CategorySelectProps) {
  const meaningfulCategories = useMemo(
    () => categories.filter((cat) => !EXCLUDED_CATEGORIES.includes(cat.name.toLowerCase().trim())),
    [categories]
  );

  if (meaningfulCategories.length === 0) {
    return null;
  }

  return (
    <div className={styles.categorySelection}>
      <label className={styles.categoryLabel}>{label}</label>
      <select
        value={selectedCategoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.categorySelect}
      >
        <option value="">{noCategory}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
            {category.isDefault ? ' (Default)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
