
'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/store/storeProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <QueryProvider>{children}</QueryProvider>
    </StoreProvider>
  );
}
