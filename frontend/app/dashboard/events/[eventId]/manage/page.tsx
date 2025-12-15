'use client';

import ProtectedRoute from '../../../_components/auth/ProtectedRoute';
import PageLayout from '../../../_components/layout/PageLayout';
import { ManageEventContent } from './_components';

export default function ManageEventPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <ManageEventContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
