'use client';

import React from 'react';
import ProtectedRoute from './_components/auth/ProtectedRoute';
import { PageLayout } from './_components/layout/PageLayout';
import { DashboardContent } from './_components/DashboardContent';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <PageLayout>
                <DashboardContent />
            </PageLayout>
        </ProtectedRoute>
    );
}