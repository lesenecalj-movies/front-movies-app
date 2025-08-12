'use client';
import { Session } from 'next-auth';
import { createContext, useContext, useMemo, useState } from 'react';

export type UserLite = { email?: string | null };
type AuthCtx = {
  user: UserLite | null;
  isAuthenticated: boolean;
  setUser: (u: UserLite | null) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [user, setUser] = useState<UserLite | null>(
    initialSession?.user ?? null,
  );

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, setUser, logout }),
    [user],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
