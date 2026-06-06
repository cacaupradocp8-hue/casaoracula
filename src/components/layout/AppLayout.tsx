import { ReactNode, useEffect } from 'react'; // REBUILD_V70
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
  useEffect(() => {
    console.log("[DEBUG_UI] AppLayout montado");
  }, []);
  return (
    <div className="min-h-screen bg-background relative flex flex-col overflow-x-hidden selection:bg-gold/30 selection:text-white">
      {/* Subtle ambient texture */}
      <div className="fixed inset-0 pattern-geometric opacity-[0.03] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--gold)/0.05),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-hero-radial pointer-events-none z-0" />

      <div className="relative z-50">
        <BootSafeBoundary label="Navigation" compact>
          <Navigation />
        </BootSafeBoundary>
      </div>

      <main className="relative flex-grow z-10 pt-[var(--header-height)] pb-28 lg:pb-12 min-w-0">
        <ResponsiveContainer>
          <div className="">
            <BootSafeBoundary label="AccessExpirationBanner" compact>
              <AccessExpirationBanner />
            </BootSafeBoundary>
          </div>
        </ResponsiveContainer>

        <BootSafeBoundary label="Conteúdo principal">
          {children}
        </BootSafeBoundary>
      </main>

      <div className="relative z-20 pb-20 lg:pb-0">
        <BootSafeBoundary label="EthicalNotice" compact>
          <EthicalNotice />
        </BootSafeBoundary>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none lg:hidden">
        <div className="pointer-events-auto">
          <BootSafeBoundary label="BottomNav" compact>
            <BottomNavPreview />
          </BootSafeBoundary>
        </div>
      </div>
    </div>
  );
}

