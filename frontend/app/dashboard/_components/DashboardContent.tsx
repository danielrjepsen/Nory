'use client';

import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';
import { getDashboardOverview, invalidateOverview } from '@/app/dashboard/_services/analytics';
import { EventGrid } from './layout/EventGrid';
import { EmptyState } from './EmptyState';
import { LoadingGrid } from './LoadingGrid';
import type { EventData } from '@/app/dashboard/_types/events';
import { mapEventSummaryToEventData } from '@/lib/constants/event-mapper';

type FilterTab = 'all' | 'active' | 'ended' | 'archived';

interface QuickStats {
    totalEvents: number;
    activeEvents: number;
    totalPhotos: number;
    totalGuests: number;
}

const STAT_ICONS = {
    activeEvents: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    ),
    photos: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
        </svg>
    ),
    guests: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
};

function FilterTabs({
    activeTab,
    onTabChange,
    hasArchived,
    t,
}: {
    activeTab: FilterTab;
    onTabChange: (tab: FilterTab) => void;
    hasArchived: boolean;
    t: (key: string) => string;
}) {
    const tabs: { id: FilterTab; label: string }[] = [
        { id: 'all', label: t('filters.all') },
        { id: 'active', label: t('filters.active') },
        { id: 'ended', label: t('filters.ended') },
    ];

    if (hasArchived) {
        tabs.push({ id: 'archived', label: t('filters.archived') });
    }

    return (
        <div className="inline-flex bg-nory-card dark:bg-nory-card border-[2.5px] border-nory-border rounded-full p-1 shadow-[3px_3px_0_var(--nory-border)]">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-150 ${activeTab === tab.id
                            ? 'bg-nory-black dark:bg-nory-text text-white dark:text-nory-black'
                            : 'text-nory-text dark:text-nory-muted hover:bg-nory-bg dark:hover:bg-nory-bg'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

function QuickStatsRow({ stats, t, locale }: { stats: QuickStats; t: (key: string) => string; locale: string }) {
    const statItems = [
        { key: 'activeEvents', value: stats.activeEvents, highlight: true },
        { key: 'photos', value: stats.totalPhotos.toLocaleString(locale), highlight: false },
        { key: 'guests', value: stats.totalGuests.toLocaleString(locale), highlight: false },
    ];

    return (
        <div className="flex gap-3">
            {statItems.map((item) => (
                <div
                    key={item.key}
                    className={`flex items-center gap-3 px-5 py-3.5 border-[2.5px] border-nory-border rounded-[16px] shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg ${item.highlight
                            ? 'bg-nory-yellow'
                            : 'bg-nory-card dark:bg-nory-card'
                        }`}
                >
                    <div className={`w-10 h-10 border-2 border-nory-border rounded-[10px] flex items-center justify-center ${item.highlight
                            ? 'bg-nory-card'
                            : 'bg-nory-bg dark:bg-nory-bg'
                        }`}>
                        <span className="text-nory-text">{STAT_ICONS[item.key as keyof typeof STAT_ICONS]}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[26px] font-bold text-nory-text font-bricolage leading-none tracking-tight">
                            {item.value}
                        </span>
                        <span className="text-xs text-nory-muted font-medium">
                            {t(`stats.${item.key}`)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SectionHeader({
    activeTab,
    onTabChange,
    hasArchived,
    t,
}: {
    activeTab: FilterTab;
    onTabChange: (tab: FilterTab) => void;
    hasArchived: boolean;
    t: (key: string) => string;
}) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-nory-text font-bricolage tracking-tight">
                {t('title')}
            </h2>
            <FilterTabs activeTab={activeTab} onTabChange={onTabChange} hasArchived={hasArchived} t={t} />
        </div>
    );
}

export function DashboardContent() {
    const { t, i18n } = useTranslation('dashboard', { keyPrefix: 'events' });
    const { loading: authLoading } = useAuth();
    const pathname = usePathname();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const hasFetched = useRef(false);

    const fetchDashboardData = useCallback(async (forceRefresh = false) => {
        if (authLoading) {
            setLoading(false);
            return;
        }

        try {
            if (forceRefresh) {
                invalidateOverview();
            }
            setLoading(true);
            const dashboardData = await getDashboardOverview();

            const mappedEvents = dashboardData.events.map(mapEventSummaryToEventData);
            setEvents(mappedEvents);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [authLoading]);

    useEffect(() => {
        if (pathname === '/dashboard') {
            const shouldForceRefresh = hasFetched.current;
            hasFetched.current = true;
            fetchDashboardData(shouldForceRefresh);
        }
    }, [pathname, fetchDashboardData]);

    useEffect(() => {
        const handleFocus = () => {
            fetchDashboardData(true);
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchDashboardData]);

    const hasArchived = useMemo(() => events.some(e => e.status === 'archived'), [events]);
    const nonArchivedEvents = useMemo(() => events.filter(e => e.status !== 'archived'), [events]);

    const filteredEvents = useMemo(() => {
        switch (activeTab) {
            case 'active':
                return events.filter(e => e.status === 'live' || e.status === 'draft');
            case 'ended':
                return events.filter(e => e.status === 'ended');
            case 'archived':
                return events.filter(e => e.status === 'archived');
            case 'all':
            default:
                return nonArchivedEvents;
        }
    }, [events, nonArchivedEvents, activeTab]);

    const stats = useMemo((): QuickStats => ({
        totalEvents: nonArchivedEvents.length,
        activeEvents: nonArchivedEvents.filter(e => e.status === 'live').length,
        totalPhotos: nonArchivedEvents.reduce((sum, e) => sum + (e.photoCount || 0), 0),
        totalGuests: nonArchivedEvents.reduce((sum, e) => sum + (e.analytics?.totalGuestAppOpens || 0), 0),
    }), [nonArchivedEvents]);

    if (loading) {
        return <LoadingGrid />;
    }

    if (events.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col gap-8">
            <QuickStatsRow stats={stats} t={t} locale={i18n.language} />
            <section>
                <SectionHeader activeTab={activeTab} onTabChange={setActiveTab} hasArchived={hasArchived} t={t} />
                <EventGrid events={filteredEvents} />
            </section>
        </div>
    );
}
