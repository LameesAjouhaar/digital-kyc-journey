
'use client';

import type { ReactNode } from 'react';

import { SessionExpiryMonitor } from '@/features/kyc-session/components/SessionExpiryMonitor';
import { StoreProvider } from '@/store/storeProvider';

import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <QueryProvider>
        <SessionExpiryMonitor />
        {children}
      </QueryProvider>
    </StoreProvider>
  );
}
