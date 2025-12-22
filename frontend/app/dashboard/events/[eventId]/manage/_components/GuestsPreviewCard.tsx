'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEventAttendees, type EventAttendee } from '../../../../_services/events';

interface GuestsPreviewCardProps {
  eventId: string;
  totalGuestCount: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function GuestsPreviewCard({ eventId, totalGuestCount }: GuestsPreviewCardProps) {
  const [guests, setGuests] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await getEventAttendees(eventId);
        setGuests(response.attendees.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [eventId]);

  const remainingCount = Math.max(0, totalGuestCount - 5);

  return (
    <div className="bg-nory-card border-2 border-nory-border rounded-2xl p-5">
      <h3 className="text-[0.95rem] font-bold mb-3.5 text-nory-text">Gæster</h3>

      {loading ? (
        <div className="flex mb-3.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full bg-nory-bg border-2 border-nory-card -ml-2.5 first:ml-0 animate-pulse"
            />
          ))}
        </div>
      ) : guests.length === 0 ? (
        <p className="text-sm text-nory-muted mb-3.5">Ingen gæster endnu</p>
      ) : (
        <>
          <div className="flex mb-3.5">
            {guests.map((guest, index) => (
              <div
                key={guest.id}
                className="w-9 h-9 rounded-full bg-nory-bg border-2 border-nory-card -ml-2.5 first:ml-0 flex items-center justify-center text-[0.7rem] font-bold overflow-hidden text-nory-text"
                style={{ zIndex: guests.length - index }}
              >
                {getInitials(guest.name)}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="w-9 h-9 rounded-full bg-nory-yellow border-2 border-nory-border -ml-2.5 flex items-center justify-center text-[0.7rem] font-bold text-nory-black">
                +{remainingCount}
              </div>
            )}
          </div>

          <p className="text-[0.8rem] text-nory-muted mb-3.5">
            <strong className="text-nory-text">{totalGuestCount} gæster</strong> har tilmeldt sig
          </p>
        </>
      )}

      <Link
        href={`/dashboard/events/${eventId}/guests`}
        className="block w-full py-2.5 bg-nory-bg text-nory-text border-2 border-nory-border rounded-lg text-[0.8rem] font-semibold text-center transition-colors hover:bg-nory-yellow hover:text-nory-black"
      >
        Se alle gæster
      </Link>
    </div>
  );
}
