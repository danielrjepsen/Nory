'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { themeService } from '../../services/themes';
import { componentRegistry, type ComponentInstance } from './componentRegistry';
import { AppSlot } from './AppSlot';
import { ComponentModal } from './ComponentModal';

interface GuestAppBuilderProps {
  eventName?: string;
  onConfigChange?: (config: any) => void;
  initialConfig?: any;
  selectedTheme?: string;
}

const GuestAppBuilder: React.FC<GuestAppBuilderProps> = ({
  eventName: propEventName = 'Your Event Name',
  onConfigChange,
  initialConfig,
  selectedTheme = 'wedding',
}) => {
  const { t } = useTranslation('dashboard');
  const initialApps = initialConfig?.components || [];

  const [installedApps, setInstalledApps] = useState<ComponentInstance[]>(initialApps);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [componentConfig, setComponentConfig] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [eventName, setEventName] = useState(propEventName);
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialConfig?.event?.welcome || 'Welcome to our special day'
  );
  const [themePresets, setThemePresets] = useState<{
    [key: string]: { primaryColor: string; secondaryColor: string; accentColor: string };
  }>({});
  const hasUserInteracted = useRef(false);

  // Update config when changes are made
  useEffect(() => {
    if (hasUserInteracted.current && onConfigChange) {
      const config = {
        version: '1.0.0',
        event: {
          name: eventName,
          welcome: welcomeMessage,
        },
        components: installedApps,
        timestamp: initialConfig?.timestamp || new Date().toISOString(),
      };
      onConfigChange(config);
    }
  }, [eventName, welcomeMessage, installedApps]);

  // Update event name when prop changes
  useEffect(() => {
    setEventName(propEventName);
  }, [propEventName]);

  // Update installed apps when initialConfig changes
  useEffect(() => {
    const newInitialApps = initialConfig?.components || [];
    setInstalledApps(newInitialApps);
  }, [initialConfig]);

  // Fetch theme presets
  useEffect(() => {
    const fetchThemePresets = async () => {
      try {
        const themes = await themeService.getThemePresets();
        const presetsMap: { [key: string]: { primaryColor: string; secondaryColor: string; accentColor: string } } = {};
        themes.forEach((theme) => {
          presetsMap[theme.name] = {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
          };
        });
        setThemePresets(presetsMap);
      } catch (error) {
        console.error('Failed to fetch theme presets:', error);
      }
    };

    fetchThemePresets();
  }, []);

  const openComponentModal = (slotIndex: number) => {
    setCurrentSlot(slotIndex);
    setSelectedComponentType(null);
    setCurrentStep(0);
    setComponentConfig({});
    setModalOpen(true);
  };

  const closeComponentModal = () => {
    setModalOpen(false);
    setCurrentSlot(null);
    setSelectedComponentType(null);
    setComponentConfig({});
  };

  const selectComponentType = (type: string) => {
    setSelectedComponentType(type);
    const component = componentRegistry[type];
    if (component) {
      const config = {
        type,
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

      setComponentConfig(config);
    }
  };

  const nextStep = () => {
    if (selectedComponentType && currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(0);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setComponentConfig((prev: any) => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value,
      },
    }));
  };

  const addComponent = () => {
    if (!selectedComponentType || currentSlot === null) return;

    const newApp: ComponentInstance = {
      id: `${selectedComponentType}_${Date.now()}`,
      slot: currentSlot,
      config: JSON.parse(JSON.stringify(componentConfig)),
    };

    hasUserInteracted.current = true;
    setInstalledApps((prev) => [...prev, newApp]);
    closeComponentModal();
  };

  const removeApp = (slotIndex: number) => {
    hasUserInteracted.current = true;
    setInstalledApps((prev) => prev.filter((app) => app.slot !== slotIndex));
  };

  const exportConfig = () => {
    const config = {
      version: '1.0.0',
      event: {
        name: eventName,
        welcome: welcomeMessage,
      },
      components: installedApps,
      timestamp: new Date().toISOString(),
    };

    console.log('Configuration JSON:', JSON.stringify(config, null, 2));
    alert(t('guestApp.builder.exportNotice'));
  };

  const showQRModal = () => {
    alert(t('guestApp.builder.qrNotice'));
  };

  const renderGrid = () => {
    const slots = [];
    for (let i = 0; i < 16; i++) {
      const app = installedApps.find((a) => a.slot === i);
      slots.push(
        <div key={i} className="w-full">
          <AppSlot
            app={app}
            onAddClick={() => openComponentModal(i)}
            onRemoveClick={() => removeApp(i)}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2.5">
        {slots}
      </div>
    );
  };

  const themeColors = themePresets[selectedTheme] || {
    primaryColor: '#667EEA',
    secondaryColor: '#764BA2',
  };

  return (
    <div className="h-full flex flex-col">
      {/* actions buttons */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          onClick={exportConfig}
        >
          <span>💾</span>
          {t('guestApp.builder.exportJson')}
        </button>
        <button
          className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          onClick={showQRModal}
        >
          {t('guestApp.builder.generateQR')}
        </button>
      </div>

      <div className="flex justify-center items-start gap-6">
        <div className="flex-shrink-0 py-6">
          <div className="w-[375px] bg-[#1A1A1A] rounded-[40px] p-3 shadow-[0_10px_40px_rgba(0,0,0,0.12),0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="bg-white rounded-[32px] overflow-hidden h-[720px] relative">
              <div
                className="relative p-6 pt-12 text-white overflow-hidden min-h-[140px]"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primaryColor} 0%, ${themeColors.secondaryColor} 100%)`,
                }}
              >
                <div
                  className="absolute inset-0 z-[2]"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primaryColor}D9 0%, ${themeColors.secondaryColor}D9 100%)`,
                  }}
                />
                <div className="relative z-[3]">
                  <h1 className="text-[1.75rem] font-bold mb-1 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    {eventName}
                  </h1>
                  <p className="text-base opacity-95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    {welcomeMessage}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 min-h-[500px]">
                {renderGrid()}
              </div>
            </div>
          </div>
        </div>

        {/* properties */}
        <div className="w-[360px] rounded-2xl border border-gray-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mt-6 h-fit max-h-[calc(100vh-120px)] overflow-auto">
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-4">{t('guestApp.builder.eventDetails')}</h3>
            <div className="mb-4">
              <label className="block text-[0.8125rem] font-medium text-gray-600 mb-1">
                {t('guestApp.builder.eventName')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder={t('guestApp.builder.eventNamePlaceholder')}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[0.8125rem] font-medium text-gray-600 mb-1">
                {t('guestApp.builder.welcomeMessage')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder={t('guestApp.builder.welcomeMessagePlaceholder')}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <ComponentModal
        isOpen={modalOpen}
        currentStep={currentStep}
        selectedComponentType={selectedComponentType}
        componentConfig={componentConfig}
        themeColors={themeColors}
        onClose={closeComponentModal}
        onSelectType={selectComponentType}
        onConfigChange={updateConfig}
        onNext={nextStep}
        onBack={previousStep}
        onAdd={addComponent}
      />
    </div>
  );
};

export default GuestAppBuilder;
