import { publicApi } from '@/lib/api';

export interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  startsAt: string | null;
  endsAt: string | null;
  themeName: string | null;
}

interface PublicEventsResponse {
  success: boolean;
  events: PublicEvent[];
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  const response = await publicApi.get<PublicEventsResponse>('/api/v1/events/public');
  return response.events ?? [];
}
