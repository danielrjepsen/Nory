export interface ComponentProperty {
  key: string;
  type: 'text' | 'select' | 'boolean' | 'array' | 'number' | 'code';
  label: string;
  default?: any;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  itemType?: string;
  conditional?: { [key: string]: any };
}

export interface ComponentSchema {
  properties: ComponentProperty[];
  data: {
    type: string;
    structure?: any;
  };
  actions?: string[];
  integrations?: string[];
}

export interface ComponentMeta {
  name: string;
  icon: string; // Icon identifier for SVG lookup
  description: string;
  category: string;
}

export interface ComponentDefinition {
  id: string;
  meta: ComponentMeta;
  schema: ComponentSchema;
  render: {
    type: string;
    layout: string;
  };
}

export interface ComponentInstance {
  id: string;
  slot: number;
  config: {
    type: string;
    meta: ComponentMeta;
    properties: { [key: string]: any };
    data: any[];
    render: { type: string; layout: string };
  };
}

export const componentRegistry: { [key: string]: ComponentDefinition } = {
  remote: {
    id: 'remote',
    meta: {
      name: 'TV Remote',
      icon: 'remote',
      description: 'Styr slideshow og medier på TV',
      category: 'control',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Remote Name',
          default: 'Slideshow Control',
          required: true,
        },
        {
          key: 'mode',
          type: 'select',
          label: 'Control Mode',
          options: [
            { value: 'slideshow', label: 'Slideshow' },
            { value: 'media', label: 'Media Player' },
            { value: 'presentation', label: 'Presentation' },
          ],
          default: 'slideshow',
        },
        {
          key: 'roomCode',
          type: 'text',
          label: 'Room Code',
          placeholder: '4-digit code',
        },
        {
          key: 'websocket',
          type: 'text',
          label: 'WebSocket URL',
          placeholder: 'wss://your-server.com',
        },
      ],
      data: {
        type: 'stream',
        structure: {
          command: 'text',
          timestamp: 'datetime',
          userId: 'uuid',
        },
      },
      actions: ['play', 'pause', 'next', 'previous', 'volume'],
      integrations: ['websocket', 'bluetooth'],
    },
    render: {
      type: 'interactive',
      layout: 'remote',
    },
  },
  guestbook: {
    id: 'guestbook',
    meta: {
      name: 'Gæstebog',
      icon: 'guestbook',
      description: 'Saml beskeder og ønsker fra gæster',
      category: 'interaction',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Guestbook Title',
          default: 'Leave a Message',
          required: true,
        },
        {
          key: 'style',
          type: 'select',
          label: 'Display Style',
          options: [
            { value: 'cards', label: 'Message Cards' },
            { value: 'timeline', label: 'Timeline' },
            { value: 'wall', label: 'Message Wall' },
          ],
          default: 'cards',
        },
        {
          key: 'photos',
          type: 'boolean',
          label: 'Allow Photo Uploads',
          default: true,
        },
        {
          key: 'moderation',
          type: 'boolean',
          label: 'Require Approval',
          default: false,
        },
      ],
      data: {
        type: 'collection',
        structure: {
          id: 'uuid',
          name: 'text',
          message: 'text',
          photo: 'image',
          timestamp: 'datetime',
          approved: 'boolean',
        },
      },
    },
    render: {
      type: 'feed',
      layout: 'masonry',
    },
  },
  lists: {
    id: 'lists',
    meta: {
      name: 'Smart Lister',
      icon: 'lists',
      description: 'Opret ønskelister, registre eller tjeklister',
      category: 'organization',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'List Title',
          default: 'Our Wishlist',
          required: true,
        },
        {
          key: 'type',
          type: 'select',
          label: 'List Type',
          options: [
            { value: 'wishlist', label: 'Gift Registry' },
            { value: 'checklist', label: 'Checklist' },
            { value: 'supplies', label: 'Supplies' },
          ],
          default: 'wishlist',
        },
        {
          key: 'items',
          type: 'array',
          label: 'List Items',
          itemType: 'text',
        },
        {
          key: 'claiming',
          type: 'boolean',
          label: 'Allow Claiming',
          default: true,
        },
      ],
      data: {
        type: 'array',
        structure: {
          id: 'uuid',
          text: 'text',
          claimed: 'boolean',
          claimedBy: 'text',
        },
      },
    },
    render: {
      type: 'list',
      layout: 'cards',
    },
  },
  gallery: {
    id: 'gallery',
    meta: {
      name: 'Billedgalleri',
      icon: 'gallery',
      description: 'Smukke fotogallerier',
      category: 'media',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Gallery Title',
          default: 'Event Photos',
          required: true,
        },
        {
          key: 'layout',
          type: 'select',
          label: 'Layout',
          options: [
            { value: 'grid', label: 'Grid' },
            { value: 'masonry', label: 'Masonry' },
            { value: 'carousel', label: 'Carousel' },
          ],
          default: 'masonry',
        },
        {
          key: 'source',
          type: 'select',
          label: 'Photo Source',
          options: [
            { value: 'upload', label: 'Direct Upload' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'api', label: 'Custom API' },
          ],
          default: 'upload',
        },
        {
          key: 'apiUrl',
          type: 'text',
          label: 'API Endpoint',
          placeholder: 'https://api.example.com/photos',
          conditional: { source: 'api' },
        },
      ],
      data: {
        type: 'media',
        structure: {
          id: 'uuid',
          url: 'image',
          caption: 'text',
          author: 'text',
        },
      },
    },
    render: {
      type: 'gallery',
      layout: 'dynamic',
    },
  },
  schedule: {
    id: 'schedule',
    meta: {
      name: 'Event Program',
      icon: 'schedule',
      description: 'Tidslinje og program',
      category: 'information',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Program Title',
          default: 'Event Schedule',
          required: true,
        },
        {
          key: 'events',
          type: 'array',
          label: 'Schedule Events',
          itemType: 'object',
        },
        {
          key: 'countdown',
          type: 'boolean',
          label: 'Show Countdown',
          default: true,
        },
      ],
      data: {
        type: 'timeline',
        structure: {
          time: 'datetime',
          title: 'text',
          location: 'text',
        },
      },
    },
    render: {
      type: 'timeline',
      layout: 'vertical',
    },
  },
  polls: {
    id: 'polls',
    meta: {
      name: 'Live Afstemning',
      icon: 'polls',
      description: 'Afstemning i realtid',
      category: 'interaction',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Poll Title',
          default: 'Quick Poll',
          required: true,
        },
        {
          key: 'question',
          type: 'text',
          label: 'Question',
          required: true,
        },
        {
          key: 'options',
          type: 'array',
          label: 'Options',
          itemType: 'text',
        },
        {
          key: 'realtime',
          type: 'boolean',
          label: 'Live Results',
          default: true,
        },
      ],
      data: {
        type: 'aggregation',
        structure: {
          votes: 'object',
          voters: 'array',
        },
      },
    },
    render: {
      type: 'interactive',
      layout: 'chart',
    },
  },
  custom: {
    id: 'custom',
    meta: {
      name: 'Custom API',
      icon: 'custom',
      description: 'Byg din egen',
      category: 'advanced',
    },
    schema: {
      properties: [
        {
          key: 'title',
          type: 'text',
          label: 'Component Name',
          required: true,
        },
        {
          key: 'endpoint',
          type: 'text',
          label: 'API Endpoint',
          placeholder: 'https://api.example.com',
        },
        {
          key: 'method',
          type: 'select',
          label: 'HTTP Method',
          options: [
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
          ],
          default: 'GET',
        },
        {
          key: 'refresh',
          type: 'number',
          label: 'Refresh (seconds)',
          default: 60,
        },
        {
          key: 'code',
          type: 'code',
          label: 'Transform Function',
          placeholder: 'function transform(data) { return data; }',
        },
      ],
      data: {
        type: 'dynamic',
      },
    },
    render: {
      type: 'custom',
      layout: 'full',
    },
  },
};
