import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type AppDomain = 'aluna' | 'profissional';

interface AppDomainContextType {
  domain: AppDomain;
  setDomain: (d: AppDomain) => void;
  toggleDomain: () => void;
}

const AppDomainContext = createContext<AppDomainContextType | undefined>(undefined);

const STORAGE_KEY = 'casa_oracula_domain';

export function AppDomainProvider({ children }: { children: React.ReactNode }) {
  const [domain, setDomainState] = useState<AppDomain>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'profissional' || stored === 'aluna') return stored;
    } catch {}
    return 'aluna';
  });

  const setDomain = useCallback((d: AppDomain) => {
    setDomainState(d);
    try { localStorage.setItem(STORAGE_KEY, d); } catch {}
  }, []);

  const toggleDomain = useCallback(() => {
    setDomain(domain === 'aluna' ? 'profissional' : 'aluna');
  }, [domain, setDomain]);

  return (
    <AppDomainContext.Provider value={{ domain, setDomain, toggleDomain }}>
      {children}
    </AppDomainContext.Provider>
  );
}

export function useAppDomain() {
  const ctx = useContext(AppDomainContext);
  if (!ctx) throw new Error('useAppDomain must be used within AppDomainProvider');
  return ctx;
}
