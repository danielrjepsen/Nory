import React from 'react';
import { Theme } from '../../_types/theme';

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
}

export function ThemeCard({ theme, isSelected, onClick }: ThemeCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer rounded-[20px] overflow-hidden bg-white border-2 border-transparent transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
      style={{
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #e2e8f0, #f1f5f9) border-box',
        transform: isSelected ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isSelected
          ? '0 20px 40px rgba(0,0,0,0.1)'
          : '0 4px 6px rgba(0, 0, 0, 0.07)',
      }}
    >
      {/* Theme preview */}
      <div
        className="h-[120px] flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        }}
      >
        <div
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            animation: isSelected ? 'bounce 0.5s ease' : 'none',
          }}
        >
          {theme.icon}
        </div>

        {/* Color palette previewer */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {[theme.primaryColor, theme.secondaryColor, theme.accentColor].map((color, idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-full border-2 border-white/90 shadow-sm"
              style={{ background: color }}
            />
          ))}
        </div>

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

      {/* Theme info */}
      <div className="p-5">
        <h4
          className="text-lg font-bold mb-1 m-0 transition-all duration-300"
          style={{
            color: isSelected ? 'transparent' : '#1e293b',
            background: isSelected ? 'linear-gradient(135deg, #111827, #374151)' : 'none',
            WebkitBackgroundClip: isSelected ? 'text' : 'initial',
            WebkitTextFillColor: isSelected ? 'transparent' : 'initial',
            backgroundClip: isSelected ? 'text' : 'initial',
            fontFamily: theme.primaryFont,
          }}
        >
          {theme.displayName}
        </h4>
        <p className="text-sm text-gray-500 m-0 leading-snug">
          {theme.description}
        </p>
      </div>
    </div>
  );
}
