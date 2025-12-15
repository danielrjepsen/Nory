'use client';

import React from 'react';
import ProtectedRoute from './_components/auth/ProtectedRoute';
import { DashboardContent } from './_components/DashboardContent';
import PageLayout from './_components/layout/PageLayout';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <PageLayout>
                <DashboardContent />
            </PageLayout>
        </ProtectedRoute>
    );
}