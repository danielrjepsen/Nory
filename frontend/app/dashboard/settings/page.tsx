'use client';

import ProtectedRoute from '../_components/auth/ProtectedRoute';
import PageLayout from '../_components/layout/PageLayout';
import { SettingsContent } from './_components';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <SettingsContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
