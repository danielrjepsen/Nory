'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardContent } from './_components/WizardContent';
import { getSetupStatus } from './_services/setupApi';

export default function WizardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    async function checkSetupStatus() {
      try {
        const status = await getSetupStatus();
        if (status.isConfigured) {
          router.replace('/dashboard');
          return;
        }
        setShowWizard(true);
      } catch {
        router.replace('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    checkSetupStatus();
  }, [router]);

  if (isLoading || !showWizard) {
    return (
      <div className="min-h-screen bg-nory-gray flex items-center justify-center font-grotesk">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-nory-yellow border-2 border-nory-black rounded-xl p-2 shadow-brutal-sm animate-pulse">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon points="0,0 48,0 48,48 0,48" fill="#1a1a1a"/>
              <polygon points="0,0 48,48 0,48" fill="#ffe951"/>
              <polygon points="52,0 72,0 100,24 72,48 52,48" fill="#1a1a1a"/>
              <polygon points="0,76 28,52 28,100 0,100" fill="#1a1a1a"/>
              <polygon points="52,52 100,52 100,100 52,100" fill="#1a1a1a"/>
              <polygon points="100,52 100,100 52,52" fill="#ffe951"/>
            </svg>
          </div>
          <div className="w-6 h-6 border-3 border-nory-black/20 border-t-nory-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <WizardContent />;
}
