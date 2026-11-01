import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { authenticate, onSessionExpired, restoreAccount, signOut, storeToken, type Account } from '@/services/auth-client';

type AuthContextValue = {
  user: Account | null; loading: boolean; error: string;
  restore: () => Promise<void>;
  login: (action: 'login' | 'register', email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing.');
  return value;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const revisionRef = useRef(0);
  const restore = useCallback(async () => {
    const revision = ++revisionRef.current;
    try { const account = await restoreAccount(); if (revision === revisionRef.current) { setUser(account); setError(''); } }
    catch { if (revision === revisionRef.current) setError('Kunde inte kontrollera inloggningen. Kontrollera anslutningen och försök igen.'); }
    finally { if (revision === revisionRef.current) setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    const revision = ++revisionRef.current;
    restoreAccount().then(account => {
      if (active && revision === revisionRef.current) { setUser(account); setError(''); }
    }).catch(() => {
      if (active && revision === revisionRef.current) setError('Kunde inte kontrollera inloggningen. Kontrollera anslutningen och försök igen.');
    }).finally(() => { if (active && revision === revisionRef.current) setLoading(false); });
    const unsubscribe = onSessionExpired(() => {
      revisionRef.current++;
      void storeToken(null).catch(() => {});
      setUser(null);
      setError('Din session har gått ut. Logga in igen för att fortsätta.');
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  async function login(action: 'login' | 'register', email: string, password: string) {
    revisionRef.current++;
    const account = await authenticate(action, email, password);
    setUser(account);
    setError('');
  }
  async function logout() {
    revisionRef.current++;
    await signOut();
    setUser(null);
    setError('');
  }

  return <AuthContext.Provider value={{ user, loading, error, restore, login, logout }}>{children}</AuthContext.Provider>;
}
