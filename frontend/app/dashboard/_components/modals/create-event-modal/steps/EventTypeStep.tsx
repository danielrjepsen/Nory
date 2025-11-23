import React from 'react';
import SelectionCard from '@/app/dashboard/_components/ui/SelectionCard';

interface EventTypeStepProps {
  value: 'single' | 'organizer' | '';
  onChange: (value: string) => void;
}

export function EventTypeStep({ value, onChange }: EventTypeStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        What will you use Nory for?
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        Choose the solution that best fits your needs
      </p>

      <SelectionCard
        options={[
          {
            id: 'single',
            icon: '🎉',
            title: 'Single Event',
            description: "I'm planning a wedding, birthday, or other celebration",
            gradient: { from: '#EC4899', to: '#C9B6E4' },
          },
          {
            id: 'organizer',
            icon: '🚀',
            title: 'Event Organizer',
            description: 'I organize multiple events and need a professional solution',
            gradient: { from: '#EC4899', to: '#C9B6E4' },
          },
        ]}
        value={value}
        onChange={onChange}
        columns={1}
        cardStyle="elevated"
        size="medium"
      />
    </div>
  );
}
