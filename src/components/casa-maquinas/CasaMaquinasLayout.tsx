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
    <div className="min-h-screen bg-[#0B1B2B]">
      <Navigation />

      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <CasaMaquinasSidebar />
          <SidebarInset className="flex-1 bg-[#0B1B2B]">
            <div className="sticky top-16 z-10 flex items-center gap-3 px-6 py-3 border-b border-[#C9A24A]/10 bg-[#0B1B2B]/95 backdrop-blur-sm">
              <SidebarTrigger className="text-[#F5F1E8]/60 hover:text-[#F5F1E8]" />
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-[#F5F1E8]">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-[#F5F1E8]/40">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
