'use client';

import { Box } from '../../../../_components/ui/Box';
import { Heading, Text } from '../../../../_components/ui/Typography';
import GuestAppBuilder from '../../../../_components/appbuilder/GuestAppBuilder';
import { EventFormData } from '../../../../_hooks/useEventForm';

interface GuestAppStepProps {
  formData: EventFormData;
  onChange: (field: keyof EventFormData, value: any) => void;
}

export function GuestAppStep({ formData, onChange }: GuestAppStepProps) {
  const handleGuestAppChange = (guestApp: { config: any; components: any[] }) => {
    onChange('guestApp', guestApp);
  };

  return (
    <Box>
      <Heading>Guest App</Heading>
      <Text variant="muted" className="mb-6">
        Customize the experience for your guests
      </Text>

      <GuestAppBuilder
        initialConfig={formData.guestApp}
        onConfigChange={handleGuestAppChange}
        eventName={formData.name}
        selectedTheme={formData.selectedTheme}
      />
    </Box>
  );
}
