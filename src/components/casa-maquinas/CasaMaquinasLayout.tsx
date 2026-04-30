import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from './CasaMaquinasSidebar';
import { Navigation } from '@/components/layout/Navigation';

interface CasaMaquinasLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
}

export function CasaMaquinasLayout({ children, title, subtitle }: CasaMaquinasLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <CasaMaquinasSidebar />
          <SidebarInset className="flex-1 bg-transparent">
            <div className="sticky top-16 z-10 flex items-center gap-3 px-6 py-3 border-b border-border/30 bg-background/95 backdrop-blur-sm">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              {title && (
                <div>
                  <h1 className="text-lg font-display font-semibold text-foreground">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground italic">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
