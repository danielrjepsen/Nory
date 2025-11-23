export const SIZE_CONFIG = {
  small: {
    iconSize: 40,
    iconPadding: 12,
    titleSize: 16,
    descriptionSize: 13,
    padding: 16,
    borderRadius: 16,
    checkSize: 20,
  },
  medium: {
    iconSize: 56,
    iconPadding: 16,
    titleSize: 18,
    descriptionSize: 14,
    padding: 24,
    borderRadius: 20,
    checkSize: 24,
  },
  large: {
    iconSize: 72,
    iconPadding: 20,
    titleSize: 20,
    descriptionSize: 15,
    padding: 32,
    borderRadius: 24,
    checkSize: 28,
  },
} as const;

export type SizeKey = keyof typeof SIZE_CONFIG;

export const DEFAULT_GRADIENT = {
  from: '#EC4899',
  to: '#C9B6E4',
};
