import React from 'react';
import GuestAppBuilder from '@/app/dashboard/_components/appbuilder/GuestAppBuilder';

interface GuestAppStepProps {
  guestApp: {
    config: any;
    components: any[];
  };
  eventName: string;
  selectedTheme: string;
  onChange: (guestApp: { config: any; components: any[] }) => void;
}

export function GuestAppStep({
  guestApp,
  eventName,
  selectedTheme,
  onChange,
}: GuestAppStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        Customize Guest App
      </h2>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed font-normal">
        Configure how your guests will interact with your event
      </p>

      <GuestAppBuilder
        initialConfig={guestApp}
        onConfigChange={onChange}
        eventName={eventName}
        selectedTheme={selectedTheme}
      />
    </div>
  );
}
