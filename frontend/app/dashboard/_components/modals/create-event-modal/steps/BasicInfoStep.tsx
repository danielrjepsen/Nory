import React from 'react';
import { Input, Textarea } from '../../../form';

interface BasicInfoStepProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoStep({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: BasicInfoStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        What's your event?
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        Tell us the basic details about your event
      </p>

      <Input
        label="Event Name *"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="e.g., Sarah's Birthday Party"
        fullWidth
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Tell your guests what this event is about..."
        rows={4}
        hint="This will be visible to your guests on the event page"
        fullWidth
      />
    </div>
  );
}
