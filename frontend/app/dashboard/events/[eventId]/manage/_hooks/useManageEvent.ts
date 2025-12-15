'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventDetails, updateEvent } from '../../../../_services/events';
import { getEventSummary } from '../../../../_services/analytics';
import { type EventData, type EventStatus } from '../../../../_types/events';
import { getEventsUrl } from '@/utils/urls';

interface EventAnalytics {
  photoCount: number;
  guestCount: number;
}

interface UseManageEventReturn {
  // Data
  event: EventData | null;
  analytics: EventAnalytics;
  eventId: string;
  guestAppUrl: string;
  slideshowUrl: string;

  // Loading states
  loading: boolean;
  loadingAnalytics: boolean;
  updating: boolean;

  // Error state
  error: string;

  // Copy state
  copying: string | null;

  // Modal states
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  showGoLiveModal: boolean;
  setShowGoLiveModal: (show: boolean) => void;

  // Tab state
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;

  // Actions
  copyToClipboard: (text: string, type: string) => Promise<void>;
  handleEventUpdated: (updatedEvent: EventData) => void;
  handleStatusToggle: () => void;
  handleGoLive: () => void;
  handleTabChange: (tabId: string | null) => void;

  // Navigation
  router: ReturnType<typeof useRouter>;
}

const ANALYTICS_REFRESH_INTERVAL = 30000; // 30 seconds

export function useManageEvent(): UseManageEventReturn {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  // Data state
  const [event, setEvent] = useState<EventData | null>(null);
  const [analytics, setAnalytics] = useState<EventAnalytics>({
    photoCount: 0,
    guestCount: 0,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Error state
  const [error, setError] = useState('');

  // UI states
  const [copying, setCopying] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // URLs
  const guestAppUrl = `${getEventsUrl()}/remote/${eventId}`;
  const slideshowUrl = `${getEventsUrl()}/slideshow/${eventId}`;

  const fetchAnalytics = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoadingAnalytics(true);
      const eventSummary = await getEventSummary(eventId);
      setAnalytics({
        photoCount: eventSummary.totalPhotosUploaded,
        guestCount: eventSummary.totalGuestAppOpens,
      });
    } catch (analyticsErr) {
      console.error('Analytics fetch failed:', analyticsErr);
    } finally {
      if (showLoader) setLoadingAnalytics(false);
    }
  }, [eventId]);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const eventData = await getEventDetails(eventId);
      setEvent(eventData);
      await fetchAnalytics(true);
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('Failed to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [eventId, fetchAnalytics]);

  useEffect(() => {
    fetchEvent();

    const analyticsInterval = setInterval(() => {
      fetchAnalytics();
    }, ANALYTICS_REFRESH_INTERVAL);

    return () => clearInterval(analyticsInterval);
  }, [eventId, fetchEvent, fetchAnalytics]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      setCopying(type);
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopying(null);
    }
  };

  const handleEventUpdated = (updatedEvent: EventData) => {
    setEvent(updatedEvent);
  };

  const handleStatusUpdate = async (newStatus: EventStatus) => {
    if (!event) return;

    try {
      setUpdating(true);
      await updateEvent(eventId, { status: newStatus });
      setEvent({ ...event, status: newStatus });
    } catch (err) {
      console.error('Failed to update event status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusToggle = () => {
    if (event?.status === 'draft') {
      setShowGoLiveModal(true);
    } else if (event?.status === 'live') {
      handleStatusUpdate('ended');
    }
  };

  const handleGoLive = () => {
    handleStatusUpdate('live');
    setShowGoLiveModal(false);
  };

  const handleTabChange = (tabId: string | null) => {
    if (tabId === 'edit') {
      setShowEditModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return {
    // Data
    event,
    analytics,
    eventId,
    guestAppUrl,
    slideshowUrl,

    // Loading states
    loading,
    loadingAnalytics,
    updating,

    // Error state
    error,

    // Copy state
    copying,

    // Modal states
    showEditModal,
    setShowEditModal,
    showGoLiveModal,
    setShowGoLiveModal,

    // Tab state
    activeTab,
    setActiveTab,

    // Actions
    copyToClipboard,
    handleEventUpdated,
    handleStatusToggle,
    handleGoLive,
    handleTabChange,

    // Navigation
    router,
  };
}
