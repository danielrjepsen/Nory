'use client';

import ProtectedRoute from '../_components/auth/ProtectedRoute';
import PageLayout from '../_components/layout/PageLayout';
import { QRCodesContent } from './_components';

export default function QRCodesPage() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <QRCodesContent />
      </PageLayout>
    </ProtectedRoute>
  );
}
