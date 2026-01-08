import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getEventPhotos } from '../_services/events';
import type { EventPhoto } from '../_types/events';

export function useEventPhotos(eventIdOverride?: string) {
  const params = useParams();
  const eventId = eventIdOverride || (params.eventId as string);

  const query = useQuery<EventPhoto[]>({
    queryKey: ['eventPhotos', eventId],
    queryFn: () => getEventPhotos(eventId),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });

  return {
    photos: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message || '',
    refetch: query.refetch,
  };
}
