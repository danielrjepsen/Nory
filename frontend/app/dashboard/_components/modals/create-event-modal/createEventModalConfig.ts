import { Theme } from "@/app/dashboard/_types/theme";

export interface EventStep {
  id: string;
  label: string;
  color: string;
  icon: string;
  showPreview?: boolean;
  modalSize?: 'small' | 'medium' | 'large' | 'xl';
  validation?: (formData: EventFormData) => boolean;
}

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
  customTheme?: Partial<Theme>;
  guestApp: {
    config: any;
    components: any[];
  };
}

export const INITIAL_FORM_DATA: EventFormData = {
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
    components: []
  }
};

export const EVENT_STEPS: EventStep[] = [
  {
    id: 'type',
    label: 'Event Type',
    color: '#EC4899',
    icon: '🎯',
    modalSize: 'medium',
    validation: (data) => data.eventType !== ''
  },
  {
    id: 'basic',
    label: 'Basic Info',
    color: '#8B5CF6',
    icon: '📝',
    modalSize: 'medium',
    validation: (data) => data.name.trim() !== ''
  },
  {
    id: 'schedule',
    label: 'Schedule',
    color: '#3B82F6',
    icon: '📅',
    modalSize: 'large',
    validation: (data) => data.startDate !== undefined
  },
  {
    id: 'settings',
    label: 'Settings',
    color: '#10B981',
    icon: '⚙️',
    modalSize: 'medium',
    validation: () => true
  },
  {
    id: 'theme',
    label: 'Theme',
    color: '#EC4899',
    icon: '🎨',
    modalSize: 'large',
    showPreview: true,
    validation: () => true
  },
  {
    id: 'app',
    label: 'Guest App',
    color: '#F59E0B',
    icon: '📱',
    modalSize: 'xl',
    showPreview: false,
    validation: () => true
  },
  {
    id: 'review',
    label: 'Review',
    color: '#6366F1',
    icon: '✅',
    modalSize: 'medium',
    validation: (data) => data.name.trim() !== '' && data.startDate !== undefined
  }
];
