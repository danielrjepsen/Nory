import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../_types/theme';

interface CustomThemeCardProps {
  isSelected: boolean;
  onClick: () => void;
  customThemeData?: Partial<Theme>;
}

export function CustomThemeCard({ isSelected, onClick, customThemeData }: CustomThemeCardProps) {
  const { t } = useTranslation('dashboard', { keyPrefix: 'themes' });
  const hasCustomColors = customThemeData?.primaryColor && customThemeData?.secondaryColor;

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer rounded-xl overflow-hidden bg-white border-2 transition-all duration-200 hover:scale-[1.02]"
      style={{
        borderColor: isSelected ? '#3b82f6' : '#d1d5db',
        borderStyle: isSelected ? 'solid' : 'dashed',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected
          ? '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        className="h-[120px] flex items-center justify-center relative"
        style={{
          background: hasCustomColors
            ? `linear-gradient(135deg, ${customThemeData.primaryColor}, ${customThemeData.secondaryColor})`
            : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        }}
      >
        <div
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            animation: isSelected ? 'bounce 0.5s ease' : 'none',
          }}
        >
          🎨
        </div>

        {hasCustomColors && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <div
              className="w-4 h-4 rounded-full border-2 border-white/90 shadow-sm"
              style={{ background: customThemeData.primaryColor }}
            />
            <div
              className="w-4 h-4 rounded-full border-2 border-white/90 shadow-sm"
              style={{ background: customThemeData.secondaryColor }}
            />
            {customThemeData.accentColor && (
              <div
                className="w-4 h-4 rounded-full border-2 border-white/90 shadow-sm"
                style={{ background: customThemeData.accentColor }}
              />
            )}
          </div>
        )}

        <div
          className="absolute top-3 right-3 w-6 h-6 border-2 border-white/90 rounded-full flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            background: isSelected
              ? 'linear-gradient(135deg, #111827, #374151)'
              : 'rgba(255, 255, 255, 0.7)',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            animation: isSelected ? 'checkBounce 0.5s ease' : 'none',
          }}
        >
          {isSelected && (
            <span
              className="text-white text-sm font-bold"
              style={{ animation: 'checkFade 0.3s ease' }}
            >
              ✓
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-base font-semibold text-gray-900 m-0 mb-1">
          {t('custom.title')}
        </h4>
        <p className="text-xs text-gray-600 m-0 leading-snug">
          {t('custom.description')}
        </p>

        <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
          {customThemeData?.primaryColor ? t('custom.configured') : t('custom.configure')}
        </div>
      </div>
    </div>
  );
}
