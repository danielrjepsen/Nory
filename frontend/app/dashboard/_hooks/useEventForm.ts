import { useState, useEffect } from 'react';
import { useAuth } from '../_contexts/AuthContext';
import EventsService from '../_services/events';

export interface EventFormData {
  eventType: 'single' | 'organizer' | '';
  name: string;
  description: string;
  startDate: Date | undefined;
  startTime: string;
  endDate: Date | undefined;
  endTime: string;
  isMultiDay: boolean;
  isPublic: boolean;
  selectedTheme: string;
  customTheme?: any;
  guestApp: {
    config: any;
    components: any[];
  };
}

const initialFormData: EventFormData = {
  eventType: '',
  name: '',
  description: '',
  startDate: undefined,
  startTime: '18:00',
  endDate: undefined,
  endTime: '23:00',
  isMultiDay: false,
  isPublic: true,
  selectedTheme: 'wedding',
  guestApp: {
    config: {},
    components: [],
  },
};

export function useEventForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [availableSlots, setAvailableSlots] = useState(1);
  const [totalSlots, setTotalSlots] = useState(1);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  // Fetch event slots
  const fetchEventSlots = async () => {
    setSlotsLoading(true);
    try {
      const events = await EventsService.getEvents();
      const usedSlots = events.length;

      // Calculate available slots based on plan
      let maxEvents = 0;

      const purchasedSlots = 0;
      const totalMaxEvents = maxEvents + purchasedSlots;
      const calculatedAvailableSlots = Math.max(0, totalMaxEvents - usedSlots);

      setTotalSlots(totalMaxEvents);
      setAvailableSlots(calculatedAvailableSlots);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setAvailableSlots(0);
    }
    setSlotsLoading(false);
  };

  // Set upgrade flow for event organizers
  useEffect(() => {
    if (formData.eventType === 'organizer') {
      setNeedsUpgrade(true);
    } else if (formData.eventType === 'single') {
      setNeedsUpgrade(false);
    }
  }, [formData.eventType]);

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setNeedsUpgrade(false);
  };

  return {
    formData,
    updateField,
    resetForm,
    availableSlots,
    totalSlots,
    slotsLoading,
    needsUpgrade,
    setNeedsUpgrade,
    fetchEventSlots,
  };
}
