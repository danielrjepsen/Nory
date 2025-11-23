import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface ScheduleStepProps {
  startDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  isMultiDay: boolean;
}

export function ScheduleStep({ startDate, onDateSelect, isMultiDay }: ScheduleStepProps) {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Event Schedule
          </h3>
          <p className="text-sm text-gray-600">
            When does your event take place?
          </p>
        </div>

        <div>
          <label className="block mb-3 text-sm font-semibold text-gray-700">
            Select Date *
          </label>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <DayPicker
              mode="single"
              selected={startDate}
              onSelect={onDateSelect}
              disabled={{ before: new Date() }}
              className="font-sans"
            />
          </div>

          {startDate && (
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              ✓ Selected: {format(startDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
