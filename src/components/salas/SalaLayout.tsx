import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SalaSidebar } from "./SalaSidebar";
import { Navigation } from "@/components/layout/Navigation";

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  icone: string | null;
  rota: string;
}

interface Portal {
  id: string;
  titulo: string;
  ordem: number;
  isAccessible: boolean;
}

interface Quiz {
  id: string;
  titulo: string;
}

interface Curso {
  id: string;
  titulo: string;
}

interface SalaLayoutProps {
  children: ReactNode;
  salaNome: string;
  ferramentas: Ferramenta[];
  portais: Portal[];
  quizzes: Quiz[];
  cursos: Curso[];
}

export function SalaLayout({ 
  children, 
  salaNome, 
  ferramentas, 
  portais, 
  quizzes, 
  cursos 
}: SalaLayoutProps) {
  const defaultOpen = typeof window !== 'undefined' ? window.innerWidth >= 1280 : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Navigation />
      
      {/* Sidebar + Content */}
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <SalaSidebar
            salaNome={salaNome}
            ferramentas={ferramentas}
            portais={portais}
            quizzes={quizzes}
            cursos={cursos}
          />
          <SidebarInset className="flex-1 min-w-0">
            <div className="h-full max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
