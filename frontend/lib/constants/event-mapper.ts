import type { EventSummary } from '@/app/dashboard/_types/analytics';
import type { EventData, EventStatus } from '@/app/dashboard/_types/events';
import { DATE_FORMAT_OPTIONS } from '@/lib/mappers/dashboard';

function formatEventDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Date TBD';

    return new Date(dateStr).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
}

function getEventStatus(event: EventSummary): EventStatus {
    if (event.status === 'draft') return 'draft';

    if (event.status === 'archived' || event.status === 'ended') {
        return 'ended';
    }

    if (event.status === 'live') return 'live';

    // check if event has ended
    const now = new Date();
    const endDate = event.endsAt ? new Date(event.endsAt) : null;

    if (endDate && now > endDate) return 'ended';

    return 'live';
}

export function mapEventSummaryToEventData(event: EventSummary): EventData {
    const startDate = formatEventDate(event.startsAt);
    const endDate = formatEventDate(event.endsAt);

    return {
        id: event.id,
        name: event.name,
        date: `${startDate} to ${endDate}`,
        location: event.location,
        photoCount: event.photoCount,
        status: getEventStatus(event),
        isPublic: event.isPublic,
        analytics: {
            totalPhotosUploaded: event.photoCount,
            totalQrScans: 0,
            totalSlideshowViews: 0,
            totalGuestAppOpens: 0,
        },
    };
}