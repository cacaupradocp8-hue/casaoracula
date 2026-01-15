import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { AccessExpirationBanner } from '@/components/shared/AccessExpirationBanner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-geometric">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 pt-4">
          <AccessExpirationBanner />
        </div>
        {children}
      </main>
      <EthicalNotice />
    </div>
  );
}
