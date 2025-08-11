'use client';

import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import type { Session } from 'next-auth';

export default function Providers({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
