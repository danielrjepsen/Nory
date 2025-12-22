'use client';

import React from 'react';
import { type EventTab } from '../_hooks';
import { Button } from '../../../../_components/Button';

interface EventActionTabsProps {
  tabs: EventTab[];
  activeTab: string | null;
  onTabChange: (tabId: string | null) => void;
}

export function EventActionTabs({ tabs, activeTab, onTabChange }: EventActionTabsProps) {
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="mb-8">
      <div className="flex justify-center gap-2 px-6 py-4 border-b border-nory-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-nory-yellow text-nory-black'
                : 'bg-nory-bg text-nory-text hover:bg-nory-border/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && activeTabData?.content && (
        <div className="max-w-xl mx-auto p-6">
          <div className="bg-nory-bg rounded-2xl p-6">
            <h3 className="text-lg font-bold text-nory-text mb-2">
              {activeTabData.content.title}
            </h3>
            <p className="text-sm text-nory-muted mb-5">
              {activeTabData.content.description}
            </p>

            {activeTabData.content.customContent}

            <div className="flex gap-3 flex-wrap">
              {activeTabData.content.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === 'primary' ? 'primary' : 'outline'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
