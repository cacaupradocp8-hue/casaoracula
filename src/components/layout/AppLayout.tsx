import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { EthicalNotice } from '@/components/shared/EthicalNotice';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-geometric">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
      <EthicalNotice />
    </div>
  );
}
