'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemes } from '@/app/dashboard/_hooks/useThemes';

interface ThemeStepProps {
  value: string;
  onChange: (themeName: string) => void;
}

const THEME_GRADIENTS: Record<string, string> = {
  wedding: 'bg-gradient-to-br from-[#c4b5fd] via-[#a78bfa] to-[#8b5cf6]',
  birthday: 'bg-gradient-to-br from-[#fda4af] via-[#fb7185] to-[#f43f5e]',
  corporate: 'bg-gradient-to-br from-[#7dd3fc] via-[#38bdf8] to-[#0ea5e9]',
  party: 'bg-gradient-to-br from-[#fcd34d] via-[#fbbf24] to-[#f59e0b]',
  'new-year': 'bg-gradient-to-br from-[#c4b5fd] via-[#a78bfa] to-[#ec4899]',
  minimal: 'bg-gradient-to-br from-[#525252] via-[#262626] to-[#171717]',
  baby: 'bg-gradient-to-br from-[#fbcfe8] via-[#f9a8d4] to-[#f472b6]',
  custom: 'bg-gradient-to-br from-[#a7f3d0] via-[#6ee7b7] to-[#34d399]',
};

const THEME_ICONS: Record<string, React.ReactNode> = {
  wedding: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  birthday: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <path d="M12 2v1"/>
      <path d="M8 6V5"/>
      <path d="M16 6V5"/>
      <path d="M4 10h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/>
      <path d="M6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <path d="M12 14v4"/>
      <path d="M8 14v4"/>
      <path d="M16 14v4"/>
    </svg>
  ),
  corporate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  party: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  'new-year': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  baby: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <circle cx="13.5" cy="6.5" r="2.5"/>
      <circle cx="19" cy="17" r="2"/>
      <circle cx="6" cy="12" r="3"/>
      <path d="M12 20.5a8.5 8.5 0 1 0-7.3-4.1"/>
    </svg>
  ),
};

export function ThemeStep({ value, onChange }: ThemeStepProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'eventCreation.theme' });
  const { themes, loading } = useThemes();

  useEffect(() => {
    if (!value && themes.length > 0) {
      onChange(themes[0].name);
    }
  }, [themes, value, onChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-nory-text/20 border-t-nory-text rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-nory-text mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-nory-yellow rounded-sm" />
        {t('title')}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isSelected = value === theme.name;
          const gradient = THEME_GRADIENTS[theme.name] || THEME_GRADIENTS.custom;
          const icon = THEME_ICONS[theme.name] || THEME_ICONS.custom;

          return (
            <button
              key={theme.name}
              type="button"
              onClick={() => onChange(theme.name)}
              className={`group bg-nory-card border-2 rounded-2xl overflow-hidden cursor-pointer transition-all text-left ${
                isSelected
                  ? 'border-nory-border border-[3px] shadow-brutal-sm dark:shadow-none'
                  : 'border-nory-border hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm dark:hover:shadow-none'
              }`}
            >
              <div className={`h-[120px] relative flex items-center justify-center ${gradient}`}>
                <div className="text-white drop-shadow-sm">
                  {icon}
                </div>
                <div
                  className={`absolute top-3 right-3 w-7 h-7 bg-nory-card border-2 border-nory-border rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'opacity-100 scale-100 bg-nory-yellow' : 'opacity-0 scale-75'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-nory-black">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <div className="px-5 py-4 border-t-2 border-nory-border">
                <span className="font-bold text-[0.95rem] text-nory-text">{theme.displayName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
