'use client';

import { AuthProvider } from './dashboard/_contexts/AuthContext';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
