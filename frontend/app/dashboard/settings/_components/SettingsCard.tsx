'use client';

import React from 'react';

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsCard({ icon, title, description, children }: SettingsCardProps) {
  return (
    <div className="bg-nory-card rounded-card p-6 xl:p-7">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 xl:w-11 xl:h-11 bg-nory-bg rounded-btn flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-card-title xl:text-card-title-xl text-nory-text font-grotesk">
            {title}
          </h2>
          <p className="text-body text-nory-muted font-grotesk mt-0.5">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface SettingsCardEmptyProps {
  icon: React.ReactNode;
  message: string;
}

export function SettingsCardEmpty({ icon, message }: SettingsCardEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 bg-nory-bg rounded-card flex items-center justify-center mb-3 opacity-50">
        {icon}
      </div>
      <span className="text-body text-nory-muted font-grotesk">{message}</span>
    </div>
  );
}
