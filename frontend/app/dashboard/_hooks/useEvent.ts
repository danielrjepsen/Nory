import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getEventDetails } from '../_services/events';
import type { EventData } from '../_types/events';

export function useEvent(eventIdOverride?: string) {
  const params = useParams();
  const eventId = eventIdOverride || (params.eventId as string);

  const query = useQuery<EventData>({
    queryKey: ['event', eventId],
    queryFn: () => getEventDetails(eventId),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });

  return {
    event: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message || '',
    refetch: query.refetch,
    eventId,
  };
}
