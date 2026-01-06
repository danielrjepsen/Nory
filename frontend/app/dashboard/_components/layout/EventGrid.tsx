import React from 'react';
import EventCard from '../events/EventCard';
import { CreateEventCard } from '../CreateEventCard';
import type { EventData } from '../../_types';

interface EventGridProps {
    events: EventData[];
}

export function EventGrid({ events }: EventGridProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 w-full">
            {events.map((event) => (
                <EventCard key={event.id} event={event} isOwner={true} />
            ))}
            <CreateEventCard />
        </div>
    );
}
