import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from './CasaMaquinasSidebar';
import { Navigation } from '@/components/layout/Navigation';

interface CasaMaquinasLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function CasaMaquinasLayout({ children, title, subtitle }: CasaMaquinasLayoutProps) {
  return (
    <div className="min-h-screen casa-maquinas-scope">
      <Navigation />

      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <CasaMaquinasSidebar />
          <SidebarInset className="flex-1 bg-transparent">
            <div className="sticky top-16 z-10 flex items-center gap-3 px-6 py-3 border-b border-[hsl(var(--cm-border)/0.3)] bg-[hsl(var(--cm-bg)/0.95)] backdrop-blur-sm">
              <SidebarTrigger className="text-[hsl(var(--cm-text-muted))] hover:text-[hsl(var(--cm-text))]" />
              {title && (
                <div>
                  <h1 className="text-lg font-display font-semibold text-[hsl(var(--cm-text))]">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-[hsl(var(--cm-text-muted))] italic">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 cm-parchment min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
