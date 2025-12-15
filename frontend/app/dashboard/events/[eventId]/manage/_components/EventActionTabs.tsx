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
      {/* Tab buttons */}
      <div className="flex justify-center gap-2 px-6 py-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {activeTab && activeTabData?.content && (
        <div className="max-w-xl mx-auto p-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activeTabData.content.title}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
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
