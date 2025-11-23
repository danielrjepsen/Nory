'use client';

import React from 'react';
import type { Theme } from '../../services/themes';
import { useCustomTheme } from '../../_hooks/useCustomTheme';
import { ColorPicker } from '../form/ColorPicker';
import { ThemeEditorPreview } from './ThemeEditorPreview';

interface CustomThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Partial<Theme>) => void;
  initialTheme?: Partial<Theme>;
}

export default function CustomThemeEditor({
  isOpen,
  onClose,
  onSave,
  initialTheme,
}: CustomThemeEditorProps) {
  const { themeData, updateColor } = useCustomTheme(initialTheme);

  const handleSave = () => {
    onSave(themeData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              🎨 Custom Theme Editor
            </h2>
            <p className="text-sm text-gray-600 m-0">
              Create your perfect color palette for your event
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-none bg-gray-100 text-gray-600 cursor-pointer flex items-center justify-center text-lg transition-all duration-200 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">

          {/* Color configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Color Configuration</h3>

            <div className="flex flex-col gap-5">
              <ColorPicker
                label="Primary Color"
                value={themeData.primaryColor}
                onChange={(value) => updateColor('primaryColor', value)}
              />

              <ColorPicker
                label="Secondary Color"
                value={themeData.secondaryColor}
                onChange={(value) => updateColor('secondaryColor', value)}
              />

              <ColorPicker
                label="Accent Color"
                value={themeData.accentColor}
                onChange={(value) => updateColor('accentColor', value)}
              />

              <ColorPicker
                label="Background Color 1"
                value={themeData.backgroundColor1}
                onChange={(value) => updateColor('backgroundColor1', value)}
              />

              <ColorPicker
                label="Background Color 2"
                value={themeData.backgroundColor2}
                onChange={(value) => updateColor('backgroundColor2', value)}
              />
            </div>
          </div>

          <ThemeEditorPreview theme={themeData} />
        </div>

        <div className="px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 border-none rounded-lg text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${themeData.primaryColor}, ${themeData.secondaryColor})`,
            }}
          >
            Save Custom Theme
          </button>
        </div>
      </div>
    </div>
  );
}
