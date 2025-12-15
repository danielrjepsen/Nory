'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';
import { AnalyticsService } from '@/app/dashboard/_services/analytics';
import { EventGrid } from './layout/EventGrid';
import { EmptyState } from './EmptyState';
import { LoadingGrid } from './LoadingGrid';
import CreateEventModal from './modals/create-event-modal/CreateEventModal';
import type { EventData } from '@/app/dashboard/_types/events';
import { mapEventSummaryToEventData } from '@/lib/constants/event-mapper';

export function DashboardContent() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        if (authLoading) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const dashboardData = await AnalyticsService.getDashboardOverview();

            const mappedEvents = dashboardData.events.map(mapEventSummaryToEventData);
            setEvents(mappedEvents);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleModalClose = useCallback(() => {
        setShowCreateModal(false);
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCreateClick = useCallback(() => {
        setShowCreateModal(true);
    }, []);

    if (loading) {
        return <LoadingGrid />;
    }

    if (events.length === 0) {
        return <EmptyState onCreateClick={handleCreateClick} />;
    }

    return (
        <>
            <EventGrid events={events} onCreateClick={handleCreateClick} />
            <CreateEventModal isOpen={showCreateModal} onClose={handleModalClose} />
        </>
    );
}