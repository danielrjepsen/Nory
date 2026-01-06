import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import da from './locales/da';
import en from './locales/en';

export const defaultNS = 'common';
export const defaultLocale = 'da';
export const supportedLocales = ['da', 'en'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const localeLabels: Record<SupportedLocale, string> = {
  da: 'Dansk',
  en: 'English',
};

export const namespaces = ['common', 'auth', 'dashboard', 'slideshow', 'remote', 'wizard'] as const;
export type Namespace = (typeof namespaces)[number];

export const resources = {
  da,
  en,
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  defaultNS,
  ns: [...namespaces],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
