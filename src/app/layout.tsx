
import type { Metadata } from 'next';
import { AppProviders } from '@/lib/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital KYC Verification',
  description: 'Secure digital identity verification journey.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
