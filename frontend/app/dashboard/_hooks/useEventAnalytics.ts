import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getEventAnalytics } from '../_services/events';

interface AnalyticsData {
  photoCount: number;
  guestCount: number;
  visitCount: number;
}

export function useEventAnalytics(eventIdOverride?: string) {
  const params = useParams();
  const eventId = eventIdOverride || (params.eventId as string);

  const query = useQuery<AnalyticsData>({
    queryKey: ['eventAnalytics', eventId],
    queryFn: () => getEventAnalytics(eventId),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });

  return {
    analytics: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message || '',
    refetch: query.refetch,
  };
}
