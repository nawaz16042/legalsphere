
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { FramerMotionProvider } from '@/contexts/FramerMotionContext';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'; // Directly import the Client Component

export const metadata: Metadata = {
  title: 'LegalSphere',
  description: 'AI-powered legal assistance for Indian law.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="xpDq7ICY1OJG0WpQPx4DRFsrkW3_KChbEo5nyDRXzVE" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LocaleProvider>
            <SettingsProvider>
              <AuthProvider>
                <FramerMotionProvider>
                  {/* Use the ClientLayoutWrapper directly */}
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </FramerMotionProvider>
                <Toaster />
              </AuthProvider>
            </SettingsProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
