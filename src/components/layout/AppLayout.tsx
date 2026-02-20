import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { AccessExpirationBanner } from '@/components/shared/AccessExpirationBanner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Layered ambient depth — seamless luxury */}
      <div className="fixed inset-0 bg-hero-radial pointer-events-none" />
      <div className="fixed inset-0 pattern-geometric pointer-events-none" />
      <div className="fixed inset-0 vignette-overlay pointer-events-none" />
      
      <Navigation />
      <main className="relative pt-16 md:pt-20">
        <div className="container mx-auto px-4 pt-4">
          <AccessExpirationBanner />
        </div>
        {children}
      </main>
      <EthicalNotice />
    </div>
  );
}
