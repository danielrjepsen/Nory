'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLocales, localeLabels, type SupportedLocale } from '@/lib/i18n/config';

const FLAG_EMOJIS: Record<SupportedLocale, string> = {
  da: '🇩🇰',
  en: '🇬🇧',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLocale = i18n.language as SupportedLocale;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: SupportedLocale) => {
    i18n.changeLanguage(locale);
    localStorage.setItem('nory-locale', locale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2.5
          bg-nory-card border-2 border-nory-border rounded-[10px]
          font-grotesk font-medium text-sm text-nory-text
          shadow-brutal-sm transition-all duration-150
          hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal
          active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
          ${isOpen ? 'shadow-brutal -translate-x-0.5 -translate-y-0.5' : ''}
        `}
      >
        <span className="text-lg leading-none">{FLAG_EMOJIS[currentLocale]}</span>
        <span className="hidden sm:inline">{localeLabels[currentLocale]}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-nory-card border-2 border-nory-border rounded-[12px] shadow-brutal overflow-hidden min-w-[140px]">
          {supportedLocales.map((locale) => {
            const isActive = currentLocale === locale;
            return (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  font-grotesk text-sm text-left
                  transition-colors duration-100
                  ${isActive
                    ? 'bg-nory-yellow text-nory-black font-semibold'
                    : 'text-nory-text hover:bg-nory-bg'
                  }
                `}
              >
                <span className="text-lg">{FLAG_EMOJIS[locale]}</span>
                <span>{localeLabels[locale]}</span>
                {isActive && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
