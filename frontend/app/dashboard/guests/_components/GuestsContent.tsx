'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getEvents } from '../../_services/events';
import { getEventAttendees, type EventAttendee } from '../../_services/events';
import type { EventData } from '../../_types/events';

export function GuestsContent() {
  const { t } = useTranslation('dashboard');
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyContactable, setShowOnlyContactable] = useState(true);

  const filteredAttendees = showOnlyContactable
    ? attendees.filter((a) => a.email)
    : attendees;

  // Load events on mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Load attendees when event is selected
  useEffect(() => {
    if (!selectedEventId) {
      setAttendees([]);
      return;
    }

    async function fetchAttendees() {
      try {
        setLoadingAttendees(true);
        setError(null);
        const data = await getEventAttendees(selectedEventId);
        setAttendees(data.attendees);
      } catch (err) {
        setError('Failed to load guests');
        console.error(err);
      } finally {
        setLoadingAttendees(false);
      }
    }
    fetchAttendees();
  }, [selectedEventId]);

  // Update URL when event selection changes
  const handleEventChange = useCallback(
    (eventId: string) => {
      setSelectedEventId(eventId);
      if (eventId) {
        router.replace(`/dashboard/guests?eventId=${eventId}`, { scroll: false });
      } else {
        router.replace('/dashboard/guests', { scroll: false });
      }
    },
    [router]
  );

  const downloadCSV = useCallback(() => {
    if (filteredAttendees.length === 0) return;

    const selectedEvent = events.find((e) => e.id === selectedEventId);
    const eventName = selectedEvent?.name || 'event';
    const suffix = showOnlyContactable ? 'contactable' : 'all';

    const headers = [
      t('guests.table.name'),
      t('guests.table.email'),
      t('guests.table.photoConsent'),
      t('guests.table.registered'),
    ];
    const rows = filteredAttendees.map((a) => [
      a.name,
      a.email || '',
      a.hasPhotoRevealConsent ? t('guests.consent.yes') : t('guests.consent.no'),
      new Date(a.registeredAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${suffix}-guests-${eventName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredAttendees, events, selectedEventId, showOnlyContactable, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('guests.title')}</h1>
        <p className="text-gray-500">{t('guests.description')}</p>
      </div>

      {/* Event Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
          {t('guests.selectEvent')}
        </label>
        <select
          id="event-select"
          value={selectedEventId}
          onChange={(e) => handleEventChange(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t('guests.chooseEvent')}</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {!selectedEventId ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('guests.selectEventPrompt')}</h3>
          <p className="text-gray-500">{t('guests.selectEventDescription')}</p>
        </div>
      ) : loadingAttendees ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredAttendees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Filter Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{selectedEvent?.name}</span>
              <p className="text-sm text-gray-500">
                {showOnlyContactable
                  ? t('guests.count.contactable', { count: 0, total: attendees.length })
                  : t('guests.count.total', { count: attendees.length })}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyContactable}
                onChange={(e) => setShowOnlyContactable(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {t('guests.onlyWithEmail')}
            </label>
          </div>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {showOnlyContactable && attendees.length > 0
                ? t('guests.empty.noContactable')
                : t('guests.empty.noRegistrations')}
            </h3>
            <p className="text-gray-500">
              {showOnlyContactable && attendees.length > 0
                ? t('guests.empty.noContactableDescription')
                : t('guests.empty.noRegistrationsDescription')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{selectedEvent?.name}</span>
              <p className="text-sm text-gray-500">
                {showOnlyContactable
                  ? t('guests.count.contactable', { count: filteredAttendees.length, total: attendees.length })
                  : t('guests.count.total', { count: attendees.length })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyContactable}
                  onChange={(e) => setShowOnlyContactable(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t('guests.onlyWithEmail')}
              </label>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('guests.downloadCsv')}
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  {t('guests.table.name')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  {t('guests.table.email')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  {t('guests.table.photoConsent')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  {t('guests.table.registered')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{attendee.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {attendee.email ? (
                      <a href={`mailto:${attendee.email}`} className="text-blue-600 hover:underline">
                        {attendee.email}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attendee.hasPhotoRevealConsent
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {attendee.hasPhotoRevealConsent ? t('guests.consent.yes') : t('guests.consent.no')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(attendee.registeredAt).toLocaleString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
