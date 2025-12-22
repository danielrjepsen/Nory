'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { componentRegistry, type ComponentInstance } from './componentRegistry';
import { ComponentModal } from './ComponentModal';
import { ComponentIcon } from './ComponentIcons';

interface GuestAppBuilderProps {
  eventName?: string;
  onConfigChange?: (config: any) => void;
  initialConfig?: any;
  selectedTheme?: string;
}

interface FeatureToggle {
  id: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const THEME_COLORS = [
  { id: 'yellow', color: '#ffe951' },
  { id: 'pink', color: '#ff6b9d' },
  { id: 'purple', color: '#a855f7' },
  { id: 'blue', color: '#3b82f6' },
  { id: 'green', color: '#22c55e' },
  { id: 'orange', color: '#f97316' },
];

const GuestAppBuilder: React.FC<GuestAppBuilderProps> = ({
  eventName: propEventName,
  onConfigChange,
  initialConfig,
}) => {
  const { t } = useTranslation('dashboard', { keyPrefix: 'guestApp' });
  const hasUserInteracted = useRef(false);

  const [eventName, setEventName] = useState(propEventName || '');
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialConfig?.event?.welcome || ''
  );
  const [selectedColor, setSelectedColor] = useState(
    initialConfig?.theme?.color || 'yellow'
  );
  const [features, setFeatures] = useState<FeatureToggle[]>([
    {
      id: 'upload',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      ),
      enabled: initialConfig?.features?.upload ?? true,
    },
    {
      id: 'comments',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      enabled: initialConfig?.features?.comments ?? true,
    },
    {
      id: 'likes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      enabled: initialConfig?.features?.likes ?? false,
    },
  ]);

  const [installedApps, setInstalledApps] = useState<ComponentInstance[]>(
    initialConfig?.components || []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);

  useEffect(() => {
    setEventName(propEventName);
  }, [propEventName]);

  useEffect(() => {
    if (hasUserInteracted.current && onConfigChange) {
      const config = {
        version: '1.0.0',
        event: {
          name: eventName,
          welcome: welcomeMessage,
        },
        theme: {
          color: selectedColor,
        },
        features: features.reduce((acc, f) => ({ ...acc, [f.id]: f.enabled }), {}),
        components: installedApps,
        timestamp: initialConfig?.timestamp || new Date().toISOString(),
      };
      onConfigChange(config);
    }
  }, [eventName, welcomeMessage, selectedColor, features, installedApps]);

  const handleWelcomeChange = (value: string) => {
    hasUserInteracted.current = true;
    setWelcomeMessage(value);
  };

  const handleColorChange = (colorId: string) => {
    hasUserInteracted.current = true;
    setSelectedColor(colorId);
  };

  const toggleFeature = (featureId: string) => {
    hasUserInteracted.current = true;
    setFeatures(prev =>
      prev.map(f => f.id === featureId ? { ...f, enabled: !f.enabled } : f)
    );
  };

  const openSlotModal = (slotIndex: number) => {
    setCurrentSlot(slotIndex);
    setSelectedComponentType(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentSlot(null);
    setSelectedComponentType(null);
  };

  const selectComponentType = (type: string) => {
    setSelectedComponentType(type);
  };

  const addComponent = () => {
    if (!selectedComponentType || currentSlot === null) return;

    const component = componentRegistry[selectedComponentType];
    if (!component) return;

    const config = {
      type: selectedComponentType,
      meta: { ...component.meta },
      properties: {} as { [key: string]: any },
      data: [],
      render: { ...component.render },
    };
    component.schema.properties.forEach((prop) => {
      if (prop.default !== undefined) {
        config.properties[prop.key] = prop.default;
      }
    });

    const newApp: ComponentInstance = {
      id: `${selectedComponentType}_${Date.now()}`,
      slot: currentSlot,
      config,
    };

    hasUserInteracted.current = true;
    setInstalledApps((prev) => [...prev, newApp]);
    closeModal();
  };

  const removeApp = (slotIndex: number) => {
    hasUserInteracted.current = true;
    setInstalledApps((prev) => prev.filter((app) => app.slot !== slotIndex));
  };

  const currentColor = THEME_COLORS.find(c => c.id === selectedColor)?.color || '#ffe951';

  const renderSlot = (index: number) => {
    const app = installedApps.find((a) => a.slot === index);

    if (app) {
      return (
        <div
          key={index}
          className="relative aspect-square bg-nory-card rounded-md border-2 border-nory-border flex flex-col items-center justify-center cursor-pointer transition-all duration-150 hover:shadow-brutal-sm group"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <ComponentIcon type={app.config.meta.icon} className="w-5 h-5 text-nory-text" />
          </div>
          <p className="text-[0.5rem] font-semibold text-nory-text font-grotesk text-center mt-1 px-1 truncate w-full">
            {app.config.properties.title || t(`components.${app.config.type}.name`)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeApp(index);
            }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[0.6rem] border border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      );
    }

    return (
      <div
        key={index}
        onClick={() => openSlotModal(index)}
        className="aspect-square bg-nory-bg rounded-md border-2 border-dashed border-nory-border/20 flex items-center justify-center cursor-pointer transition-all duration-150 hover:border-nory-border hover:bg-nory-card"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-nory-muted">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[260px_1fr] gap-10">
      <div className="phone-mockup bg-nory-text rounded-[32px] p-2.5 shadow-brutal">
        <div className="phone-screen bg-white rounded-[24px] overflow-hidden" style={{ aspectRatio: '9/18' }}>
          <div
            className="phone-header py-8 px-4 pb-5"
            style={{ backgroundColor: currentColor }}
          >
            <div className="text-[1.1rem] font-bold text-black font-grotesk mb-0.5">
              {eventName || t('builder.eventNameDefault')}
            </div>
            <div className="text-[0.7rem] text-black/60 font-grotesk">
              {welcomeMessage || t('builder.welcomeDefault')}
            </div>
          </div>
          <div className="phone-grid p-3 grid grid-cols-3 gap-1.5">
            {[...Array(6)].map((_, i) => renderSlot(i))}
          </div>
        </div>
      </div>

      <div className="customize-panel flex flex-col gap-7">
        <div className="customize-section">
          <label className="block text-xs font-semibold text-nory-muted uppercase tracking-wider mb-3 font-grotesk">
            {t('builder.themeColor')}
          </label>
          <div className="flex gap-2">
            {THEME_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorChange(color.id)}
                className={`w-10 h-10 rounded-btn border-2 transition-all duration-150 ${
                  selectedColor === color.id
                    ? 'border-nory-border shadow-brutal-sm'
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: color.color }}
                title={t(`colors.${color.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="customize-section">
          <label className="block text-xs font-semibold text-nory-muted uppercase tracking-wider mb-3 font-grotesk">
            {t('builder.welcomeMessage')}
          </label>
          <input
            type="text"
            value={welcomeMessage}
            onChange={(e) => handleWelcomeChange(e.target.value)}
            placeholder={t('builder.welcomeMessagePlaceholder')}
            className="w-full px-4 py-3 bg-nory-card border-2 border-nory-border rounded-btn font-grotesk text-nory-text transition-all duration-150 focus:outline-none focus:shadow-brutal-sm placeholder:text-nory-muted"
          />
        </div>

        <div className="customize-section">
          <label className="block text-xs font-semibold text-nory-muted uppercase tracking-wider mb-3 font-grotesk">
            {t('builder.features')}
          </label>
          <div className="flex flex-col gap-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className={`flex items-center justify-between p-4 rounded-btn border-2 transition-all duration-150 ${
                  feature.enabled
                    ? 'bg-nory-yellow border-nory-border'
                    : 'bg-nory-bg border-transparent hover:border-nory-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-nory-card rounded-lg border-2 border-nory-border flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className={`font-semibold text-sm font-grotesk ${feature.enabled ? 'text-nory-black' : 'text-nory-text'}`}>
                    {t(`features.${feature.id}`)}
                  </span>
                </div>
                <div
                  className={`w-11 h-6 rounded-full border-2 border-nory-border relative transition-all duration-150 bg-nory-card`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-150 ${
                      feature.enabled
                        ? 'left-[22px] bg-nory-text'
                        : 'left-0.5 bg-nory-muted'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ComponentModal
        isOpen={modalOpen}
        selectedComponentType={selectedComponentType}
        themeColors={{ primaryColor: currentColor, secondaryColor: currentColor }}
        onClose={closeModal}
        onSelectType={selectComponentType}
        onAdd={addComponent}
      />
    </div>
  );
};

export default GuestAppBuilder;
