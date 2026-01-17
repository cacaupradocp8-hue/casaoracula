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
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Navigation />
      
      {/* Sidebar + Content */}
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <SalaSidebar
            salaNome={salaNome}
            ferramentas={ferramentas}
            portais={portais}
            quizzes={quizzes}
            cursos={cursos}
          />
          <SidebarInset className="flex-1">
            <div className="h-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
