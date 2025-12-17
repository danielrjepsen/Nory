'use client';

import ProtectedRoute from '../_components/auth/ProtectedRoute';
import PageLayout from '../_components/layout/PageLayout';
import { GuestsContent } from './_components/GuestsContent';

export default function GuestsPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <GuestsContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
