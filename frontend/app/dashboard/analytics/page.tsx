'use client';

import ProtectedRoute from '../_components/auth/ProtectedRoute';
import PageLayout from '../_components/layout/PageLayout';
import { AnalyticsContent } from './_components';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <AnalyticsContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
