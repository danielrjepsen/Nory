import React from 'react';
import type { Theme } from '../../services/themes';

interface PreviewCardProps {
  eventName: string;
  eventDescription: string;
  startsAt: string;
  theme: Partial<Theme>;
}

export function PreviewCard({ eventName, eventDescription, startsAt, theme }: PreviewCardProps) {
  const backgroundColor1 = theme.backgroundColor1 || '#ffffff';
  const backgroundColor2 = theme.backgroundColor2 || '#f3f4f6';
  const textPrimary = theme.textPrimary || '#111827';
  const textSecondary = theme.textSecondary || '#6b7280';
  const textAccent = theme.textAccent || theme.primaryColor || '#3b82f6';
  const primaryFont = theme.primaryFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Inter, sans-serif';

  return (
    <div className="max-w-[400px] w-full bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10 relative z-10">
      <div
        className="px-8 pt-10 pb-8 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor1} 0%, ${backgroundColor2} 100%)`,
          color: textPrimary,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${theme.primaryColor}1A 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${theme.secondaryColor}0D 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div
            className="text-xs font-medium uppercase tracking-wider mb-4 opacity-70"
            style={{ color: textAccent }}
          >
            {startsAt
              ? new Date(startsAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'September 14, 2025'}
          </div>

          <h1
            className="text-[28px] font-bold mb-2 tracking-tight"
            style={{ color: textPrimary, fontFamily: primaryFont }}
          >
            {eventName || 'Your Event Name'}
          </h1>

          <p className="text-sm opacity-60 font-normal m-0" style={{ color: textSecondary }}>
            {eventDescription || 'Join us in celebrating this special moment'}
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#fafbfc]">
        <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed m-0">
          Welcome to our special event. Share your favorite moments using the features below.
        </p>

        <button
          className="w-full px-6 py-4 text-white border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          Upload Media
        </button>
      </div>
    </div>
  );
}
