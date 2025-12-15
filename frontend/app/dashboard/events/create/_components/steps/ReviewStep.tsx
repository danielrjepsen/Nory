'use client';

import { Box } from '../../../../_components/ui/Box';
import { Heading, Text } from '../../../../_components/ui/Typography';
import { Button, Alert } from '../../../../_components';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface ReviewStepProps {
  formData: EventFormData;
  onEdit: (stepIndex: number) => void;
}

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  return (
    <Box className="border border-gray-200 rounded-lg p-4">
      <Box className="flex justify-between items-start mb-3">
        <Heading as="h3" className="mb-0">{title}</Heading>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </Box>
      {children}
    </Box>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <Box>
      <Text variant="muted" className="mb-0">{label}</Text>
      <Text className="font-medium">{value}</Text>
    </Box>
  );
}

export function ReviewStep({ formData, onEdit }: ReviewStepProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box className="space-y-6">
      <Box>
        <Heading>Review & Create</Heading>
        <Text variant="muted">
          Review your event details before creating
        </Text>
      </Box>

      <ReviewSection title="Event Details" onEdit={() => onEdit(0)}>
        <Box className="space-y-2">
          <ReviewItem label="Name" value={formData.name || 'Not set'} />
          {formData.description && (
            <ReviewItem label="Description" value={formData.description} />
          )}
          <ReviewItem label="Start Date" value={formatDate(formData.startDate)} />
          {formData.endDate && (
            <ReviewItem label="End Date" value={formatDate(formData.endDate)} />
          )}
          <ReviewItem
            label="Privacy"
            value={formData.isPublic ? 'Public - Anyone with link' : 'Private - Invited guests only'}
          />
        </Box>
      </ReviewSection>

      <ReviewSection title="Theme" onEdit={() => onEdit(1)}>
        <Box className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-600" />
          <Box>
            <Text className="font-medium capitalize">{formData.selectedTheme}</Text>
            <Text variant="muted">Selected theme</Text>
          </Box>
        </Box>
      </ReviewSection>

      <ReviewSection title="Guest App" onEdit={() => onEdit(1)}>
        <Text variant="muted">
          {formData.guestApp.components.length > 0
            ? `${formData.guestApp.components.length} component(s) configured`
            : 'Default configuration'}
        </Text>
      </ReviewSection>

      <Alert variant="warning">
        <Text className="font-medium mb-1">Ready to create</Text>
        <Text variant="small">
          Once created, you'll be able to upload photos and share your event with guests.
        </Text>
      </Alert>
    </Box>
  );
}
