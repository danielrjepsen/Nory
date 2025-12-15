'use client';

import { Box } from '../../../../_components/ui/Box';
import { Heading, Label } from '../../../../_components/ui/Typography';
import { Input, Textarea, Checkbox } from '../../../../_components/ui/Input';
import { DateTimePicker } from '../../../../_components';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface EventDetailsStepProps {
  formData: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
}

export function EventDetailsStep({ formData, onChange }: EventDetailsStepProps) {
  return (
    <Box className="space-y-6">
      <Heading>Event Information</Heading>

      <Box>
        <Label htmlFor="name" required>Event Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Sarah & John's Wedding"
          required
        />
      </Box>

      <Box>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Join us for a celebration of love..."
          rows={3}
        />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimePicker
          id="startDate"
          label="Start Date & Time"
          value={formData.startDate}
          onChange={(value) => onChange('startDate', value)}
          required
        />
        <DateTimePicker
          id="endDate"
          label="End Date & Time"
          value={formData.endDate}
          onChange={(value) => onChange('endDate', value)}
          min={formData.startDate}
        />
      </Box>

      <Box>
        <Checkbox
          checked={formData.isPublic}
          onChange={(e) => onChange('isPublic', e.target.checked)}
          label="Public Event"
          description={formData.isPublic
            ? 'Anyone with the link can access'
            : 'Only invited guests can access'}
        />
      </Box>
    </Box>
  );
}
