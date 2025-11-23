import React from 'react';
import { format, setMinutes, setHours } from 'date-fns';
import type { Theme } from '../../../services/themes';

interface ReviewStepProps {
  name: string;
  description: string;
  startDate: Date | undefined;
  startTime: string;
  isPublic: boolean;
  selectedTheme: string;
  themes: Theme[];
}

export function ReviewStep({
  name,
  description,
  startDate,
  startTime,
  isPublic,
  selectedTheme,
  themes,
}: ReviewStepProps) {
  const combineDateAndTime = (date: Date | undefined, time: string): Date | null => {
    if (!date) return null;
    const [hours, minutes] = time.split(':').map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Review & Create
          </h3>
          <p className="text-sm text-gray-600">
            Review your event details and create your event
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <span className="text-sm text-gray-500 font-medium">Name:</span>
            <span className="text-sm text-gray-900 ml-2">
              {name || 'Untitled Event'}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500 font-medium">Description:</span>
            <span className="text-sm text-gray-900 ml-2">
              {description || 'No description provided'}
            </span>
          </div>

          {startDate && (
            <div>
              <span className="text-sm text-gray-500 font-medium">Start:</span>
              <span className="text-sm text-gray-900 ml-2">
                {format(
                  combineDateAndTime(startDate, startTime) || new Date(),
                  'PPpp'
                )}
              </span>
            </div>
          )}

          <div>
            <span className="text-sm text-gray-500 font-medium">Visibility:</span>
            <span className="text-sm text-gray-900 ml-2">
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500 font-medium">Theme:</span>
            <span className="text-sm text-gray-900 ml-2">
              {themes.find((t) => t.name === selectedTheme)?.displayName || 'Wedding'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
