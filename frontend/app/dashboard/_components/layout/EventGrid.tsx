import React from 'react';
import EventCard from '../events/EventCard';
import { CreateEventCard } from '../CreateEventCard';
import type { EventData } from '../../_types';

interface EventGridProps {
    events: EventData[];
    onCreateClick: () => void;
}

export function EventGrid({ events, onCreateClick }: EventGridProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 w-full max-w-[1200px] mx-auto">
            {events.map((event) => (
                <EventCard key={event.id} event={event} isOwner={true} />
            ))}
            <CreateEventCard onClick={onCreateClick} />
        </div>
    );
}