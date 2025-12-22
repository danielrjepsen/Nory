import styles from './NoryCardLogo.module.css';

interface NoryCardLogoProps {
  size?: 'default' | 'small';
  dark?: boolean;
  className?: string;
}

export function NoryCardLogo({ size = 'default', dark = false, className = '' }: NoryCardLogoProps) {
  const sizeClass = size === 'small' ? styles.small : '';
  const darkClass = dark ? styles.dark : '';

  return (
    <div className={`${styles.logoIllustration} ${sizeClass} ${darkClass} ${className}`}>
      <div className={`${styles.logoCard} ${styles.purple}`}>
        <div className={styles.logoCardInner} />
        <div className={styles.logoCardBottom} />
      </div>
      <div className={`${styles.logoCard} ${styles.yellow}`}>
        <div className={styles.logoCardInner} />
        <div className={styles.logoCardBottom} />
      </div>
      <div className={`${styles.logoCard} ${styles.pink}`}>
        <div className={styles.logoCardInner} />
        <div className={styles.logoCardBottom} />
      </div>
    </div>
  );
}
