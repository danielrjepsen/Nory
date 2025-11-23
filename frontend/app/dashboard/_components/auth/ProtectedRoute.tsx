'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/dashboard/_contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-[3px] border-white/10 border-t-white" />
      <p className="text-white/70">Loading...</p>
    </div>
  </div>
);

const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  return { user, loading };
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}