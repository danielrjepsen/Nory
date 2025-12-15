import React from 'react';
import { Theme } from '../../_types/theme';

interface ThemeEditorPreviewProps {
  theme: Partial<Theme>;
}

export function ThemeEditorPreview({ theme }: ThemeEditorPreviewProps) {
  const colorPalette = [
    { name: 'Primary', color: theme.primaryColor },
    { name: 'Secondary', color: theme.secondaryColor },
    { name: 'Accent', color: theme.accentColor },
    { name: 'BG1', color: theme.backgroundColor1 },
    { name: 'BG2', color: theme.backgroundColor2 },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Live Preview</h3>

      {/* Guest App Preview */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <div className="max-w-[300px] w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 mx-auto">
          {/* Header with theme colors */}
          <div
            className="px-5 py-6 text-center text-white"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
            }}
          >
            <div className="text-[10px] font-medium uppercase mb-2 opacity-70">
              September 14, 2025
            </div>
            <h1 className="text-xl font-bold mb-1 m-0">Your Event Name</h1>
            <p className="text-xs opacity-60 m-0">Join us in celebrating this special moment</p>
          </div>

          {/* Content section */}
          <div className="p-5 bg-[#fafbfc]">
            <p className="text-gray-500 text-xs text-center mb-4 m-0">
              Welcome to our special event
            </p>

            <button
              className="w-full px-4 py-3 text-white border-none rounded-lg text-sm font-semibold cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              Upload Media
            </button>
          </div>
        </div>
      </div>

      {/* Color Palette Display */}
      <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3 m-0">Color Palette</h4>
        <div className="flex gap-2 flex-wrap">
          {colorPalette.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-md border-2 border-white shadow-sm"
                style={{ background: item.color }}
              />
              <span className="text-[10px] text-gray-600 font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
