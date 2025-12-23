'use client';

import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import { EventPageLayout } from '../../../_components/layout/EventPageLayout';
import { ManageEventContent } from './_components';

export default function ManageEventPage() {
  return (
    <ProtectedRoute>
      <EventPageLayout activeNav="overview">
        <ManageEventContent />
      </EventPageLayout>
    </ProtectedRoute>
  );
}
