import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from './CasaMaquinasSidebar';
import { CasaMaquinasTrialBanner } from './CasaMaquinasTrialBanner';
import { Navigation } from '@/components/layout/Navigation';

interface CasaMaquinasLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
}

export function CasaMaquinasLayout({ children, title, subtitle }: CasaMaquinasLayoutProps) {
  // Intelligent sidebar behavior: Default sidebar open only on xl+ screens (>= 1280px).
  // This preserves critical horizontal real estate on 13" and 15" laptops at 100% zoom.
  const defaultOpen = typeof window !== 'undefined' ? window.innerWidth >= 1280 : false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <CasaMaquinasSidebar />
          <SidebarInset className="flex-1 bg-transparent min-w-0">
            <div className="sticky top-16 z-10 flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border/30 bg-background/95 backdrop-blur-sm">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0" />
              {title && (
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-display font-semibold text-foreground truncate">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground italic line-clamp-1">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 lg:p-8 xl:p-10 min-h-[calc(100vh-8rem)] space-y-8 max-w-[1440px] mx-auto w-full min-w-0">
              <CasaMaquinasTrialBanner />
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
