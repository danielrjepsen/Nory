'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsService } from '@/services/analytics';
import { EventGrid } from '../../components/dashboard/EventGrid';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { LoadingGrid } from '../../components/dashboard/LoadingGrid';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import type { EventData } from '@/types/event';
import { mapEventSummaryToEventData } from '@/lib/mappers/event-mapper';

export function DashboardContent() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        if (authLoading || !user?.currentOrg) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const dashboardData = await AnalyticsService.getDashboardOverview(
                user.currentOrg.id
            );

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