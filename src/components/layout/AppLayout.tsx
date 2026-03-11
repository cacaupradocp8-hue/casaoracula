import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { AccessExpirationBanner } from '@/components/shared/AccessExpirationBanner';
import { BootSafeBoundary } from '@/components/shared/BootSafeBoundary';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle ambient texture */}
      <div className="fixed inset-0 pattern-geometric opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-radial pointer-events-none" />

      <BootSafeBoundary label="Navigation" compact>
        <Navigation />
      </BootSafeBoundary>

      <main className="relative pt-16 md:pt-20">
        <div className="container mx-auto px-4 pt-4">
          <BootSafeBoundary label="AccessExpirationBanner" compact>
            <AccessExpirationBanner />
          </BootSafeBoundary>
        </div>

        <BootSafeBoundary label="Conteúdo principal">
          {children}
        </BootSafeBoundary>
      </main>

      <BootSafeBoundary label="EthicalNotice" compact>
        <EthicalNotice />
      </BootSafeBoundary>
    </div>
  );
}
