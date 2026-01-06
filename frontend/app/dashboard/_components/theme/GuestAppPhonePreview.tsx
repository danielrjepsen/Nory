'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemes } from '../../_hooks/useThemes';
import { Theme } from '../../_types/theme';

interface GuestAppPhonePreviewProps {
  eventName: string;
  themeName: string;
}

export function GuestAppPhonePreview({ eventName, themeName }: GuestAppPhonePreviewProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'themes' });
  const { themes, loading } = useThemes();

  if (loading) {
    return (
      <div className="h-[200px] flex items-end justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const theme: Partial<Theme> = themes.find((t) => t.name === themeName) || themes[0] || {};

  const primaryColor = theme.primaryColor || '#ffe951';
  const secondaryColor = theme.secondaryColor || '#f59e0b';
  const accentColor = theme.accentColor || primaryColor;
  const backgroundColor1 = theme.backgroundColor1 || '#ffffff';
  const backgroundColor2 = theme.backgroundColor2 || '#f8f8f8';
  const textPrimary = theme.textPrimary || '#1a1a1a';
  const textSecondary = theme.textSecondary || '#666666';

  return (
    <div className="relative h-[220px] flex items-end justify-center overflow-hidden">
      <div
        className="relative z-10 bg-gray-900 rounded-t-[24px] p-1.5 shadow-2xl transform translate-y-[60px]"
        style={{ width: '200px' }}
      >
        <div
          className="rounded-t-[18px] overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${backgroundColor1} 0%, ${backgroundColor2} 100%)`,
          }}
        >
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-16 h-4 bg-gray-900 rounded-full" />
          </div>

          <div
            className="mx-2 mt-1 rounded-xl px-4 py-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            }}
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'white' }}
            />
            <div
              className="absolute top-1/2 -left-4 w-12 h-12 rounded-full opacity-15"
              style={{ background: accentColor }}
            />

            <div className="relative z-10">
              <h3
                className="text-[13px] font-bold truncate"
                style={{ color: textPrimary }}
              >
                {eventName || t('preview.eventName')}
              </h3>
              <p
                className="text-[9px] mt-0.5 opacity-70"
                style={{ color: textPrimary }}
              >
                {t('preview.welcome')}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mx-2 mt-3 mb-2">
            <div
              className="flex-1 rounded-lg py-2 px-3 text-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <div className="text-[11px] font-bold" style={{ color: primaryColor }}>24</div>
              <div className="text-[7px] opacity-60" style={{ color: textSecondary }}>{t('preview.photos')}</div>
            </div>
            <div
              className="flex-1 rounded-lg py-2 px-3 text-center"
              style={{ backgroundColor: `${secondaryColor}15` }}
            >
              <div className="text-[11px] font-bold" style={{ color: secondaryColor }}>8</div>
              <div className="text-[7px] opacity-60" style={{ color: textSecondary }}>{t('preview.guests')}</div>
            </div>
          </div>

          <div className="mx-2 mb-4">
            <div
              className="w-full py-2.5 rounded-lg text-[9px] font-semibold text-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                color: textPrimary,
              }}
            >
              {t('preview.uploadButton')}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <span
          className="text-[10px] font-semibold px-3 py-1 rounded-full"
          style={{
            backgroundColor: primaryColor,
            color: textPrimary,
          }}
        >
          {theme.displayName || t('preview.defaultTheme')}
        </span>
      </div>
    </div>
  );
}
