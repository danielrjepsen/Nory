'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NoryLayout } from '@/components/layout/NoryLayout';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <NoryLayout>
                <DashboardContent />
            </NoryLayout>
        </ProtectedRoute>
    );
}