import React from 'react';
import { Toggle } from '../../../form';

interface SettingsStepProps {
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
}

export function SettingsStep({ isPublic, onPublicChange }: SettingsStepProps) {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Event Settings
          </h3>
          <p className="text-sm text-gray-600">
            Configure how your event works
          </p>
        </div>

        <Toggle
          label="Public Event"
          description="When enabled, guests can find your event via search. When disabled, your event is invite-only."
          checked={isPublic}
          onChange={onPublicChange}
        />
      </div>
    </div>
  );
}
