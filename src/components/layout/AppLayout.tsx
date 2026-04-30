import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { BottomNavPreview } from './BottomNavPreview';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { AccessExpirationBanner } from '@/components/shared/AccessExpirationBanner';
import { BootSafeBoundary } from '@/components/shared/BootSafeBoundary';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isClubeHome = location.pathname === '/clube';

  return (
    <div className={cn("min-h-screen relative", isClubeHome ? "bg-[#000814]" : "bg-background")}>
      {/* Subtle ambient texture */}
      {!isClubeHome && (
        <>
          <div className="fixed inset-0 pattern-geometric opacity-40 pointer-events-none" />
          <div className="fixed inset-0 bg-hero-radial pointer-events-none" />
        </>
      )}

      <BootSafeBoundary label="Navigation" compact>
        <Navigation />
      </BootSafeBoundary>

      <main className={cn("relative pb-24 md:pb-0", !isClubeHome && "pt-16 md:pt-20")}>
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

      <BootSafeBoundary label="BottomNav" compact>
        <BottomNavPreview />
      </BootSafeBoundary>
    </div>
  );
}

