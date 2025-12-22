export const queryKeys = {
  all: ['all'] as const,

  events: {
    all: ['events'] as const,
    public: (eventId: string) => ['events', 'public', eventId] as const,
    apps: (eventId: string) => ['events', eventId, 'apps'] as const,
    template: (eventId: string) => ['events', eventId, 'template'] as const,
  },

  photos: {
    all: ['photos'] as const,
    byEvent: (eventId: string) => ['photos', 'event', eventId] as const,
    categories: (eventId: string) => ['photos', 'categories', eventId] as const,
  },

  attendees: {
    all: ['attendees'] as const,
    status: (eventId: string) => ['attendees', 'status', eventId] as const,
  },

  guestbook: {
    all: ['guestbook'] as const,
    entries: (eventId: string, appInstanceId: string) =>
      ['guestbook', 'entries', eventId, appInstanceId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
