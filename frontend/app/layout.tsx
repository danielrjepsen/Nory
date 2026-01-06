'use client';

import { AuthProvider } from './dashboard/_contexts/AuthContext';
import { I18nProvider } from '@/lib/i18n';
import { QueryProvider } from '@/lib/query';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider>
              <AuthProvider>{children}</AuthProvider>
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
