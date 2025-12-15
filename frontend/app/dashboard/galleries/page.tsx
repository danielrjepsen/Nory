'use client';

import ProtectedRoute from '../_components/auth/ProtectedRoute';
import PageLayout from '../_components/layout/PageLayout';
import { GalleriesContent } from './_components';

export default function GalleriesPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <GalleriesContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
