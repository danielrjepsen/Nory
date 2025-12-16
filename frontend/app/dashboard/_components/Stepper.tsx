'use client';

import React from 'react';

interface StepperProps {
  steps: readonly string[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, activeStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick || index > activeStep}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                index === activeStep
                  ? 'bg-blue-600 text-white'
                  : index < activeStep
                  ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                  : 'bg-gray-200 text-gray-600'
              } ${!onStepClick || index > activeStep ? 'cursor-default' : ''}`}
            >
              {index < activeStep ? '✓' : index + 1}
            </button>
            <span
              className={`text-sm text-center ${
                index === activeStep
                  ? 'text-blue-600 font-semibold'
                  : index < activeStep
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 ${
                index < activeStep ? 'bg-green-600' : 'bg-gray-200'
              }`}
              style={{ marginTop: '-2rem' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
