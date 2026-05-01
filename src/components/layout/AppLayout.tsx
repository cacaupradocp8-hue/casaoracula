import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { BottomNavPreview } from './BottomNavPreview';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { AccessExpirationBanner } from '@/components/shared/AccessExpirationBanner';
import { BootSafeBoundary } from '@/components/shared/BootSafeBoundary';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Subtle ambient texture */}
      <div className="fixed inset-0 pattern-geometric opacity-40 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-hero-radial pointer-events-none z-0" />

      <div className="relative z-50">
        <BootSafeBoundary label="Navigation" compact>
          <Navigation />
        </BootSafeBoundary>
      </div>

      <main className="relative flex-grow z-10 pt-16 md:pt-20 pb-32 md:pb-12">
        <ResponsiveContainer>
          <div className="pt-4">
            <BootSafeBoundary label="AccessExpirationBanner" compact>
              <AccessExpirationBanner />
            </BootSafeBoundary>
          </div>
        </ResponsiveContainer>

        <BootSafeBoundary label="Conteúdo principal">
          {children}
        </BootSafeBoundary>
      </main>

      <div className="relative z-20 pb-20 md:pb-0">
        <BootSafeBoundary label="EthicalNotice" compact>
          <EthicalNotice />
        </BootSafeBoundary>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none md:hidden">
        <div className="pointer-events-auto">
          <BootSafeBoundary label="BottomNav" compact>
            <BottomNavPreview />
          </BootSafeBoundary>
        </div>
      </div>
    </div>
  );
}

