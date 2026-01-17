import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Wrench, BookOpen, ClipboardList, GraduationCap, Lock, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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

interface SalaSidebarProps {
  salaNome: string;
  ferramentas: Ferramenta[];
  portais: Portal[];
  quizzes: Quiz[];
  cursos: Curso[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: LucideIcons.Wrench,
  brain: LucideIcons.Brain,
  compass: LucideIcons.Compass,
  helpCircle: LucideIcons.HelpCircle,
  book: LucideIcons.Book,
  bookOpen: LucideIcons.BookOpen,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  sparkles: LucideIcons.Sparkles,
  lightbulb: LucideIcons.Lightbulb,
  target: LucideIcons.Target,
  users: LucideIcons.Users,
  messageCircle: LucideIcons.MessageCircle,
  pencil: LucideIcons.Pencil,
  clipboardList: LucideIcons.ClipboardList,
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = iconMap[name] || LucideIcons.Wrench;
  return <IconComponent className={className} />;
};

export function SalaSidebar({ salaNome, ferramentas, portais, quizzes, cursos }: SalaSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [ferramentasOpen, setFerramentasOpen] = useState(true);
  const [portaisOpen, setPortaisOpen] = useState(true);
  const [quizzesOpen, setQuizzesOpen] = useState(true);
  const [cursosOpen, setCursosOpen] = useState(true);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => navigate("/salas")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-sm text-gold truncate">{salaNome}</span>
            </div>
          )}
          <SidebarTrigger className="shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {/* Ferramentas Section */}
        {ferramentas.length > 0 && (
          <Collapsible open={ferramentasOpen} onOpenChange={setFerramentasOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-gold transition-colors justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    {!isCollapsed && <span>Ferramentas</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", ferramentasOpen && "rotate-180")} />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {ferramentas.map((ferramenta) => (
                      <SidebarMenuItem key={ferramenta.id}>
                        <SidebarMenuButton
                          onClick={() => navigate(ferramenta.rota)}
                          isActive={location.pathname === ferramenta.rota}
                          tooltip={ferramenta.ferramenta_nome}
                        >
                          <DynamicIcon name={ferramenta.icone || "wrench"} className="h-4 w-4 text-gold" />
                          {!isCollapsed && <span>{ferramenta.ferramenta_nome}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Portais Section */}
        {portais.length > 0 && (
          <Collapsible open={portaisOpen} onOpenChange={setPortaisOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-gold transition-colors justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {!isCollapsed && <span>Portais</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", portaisOpen && "rotate-180")} />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {portais.map((portal) => (
                      <SidebarMenuItem key={portal.id}>
                        <SidebarMenuButton
                          onClick={() => portal.isAccessible && navigate(`/portal/${portal.id}`)}
                          isActive={location.pathname === `/portal/${portal.id}`}
                          tooltip={portal.titulo}
                          className={cn(!portal.isAccessible && "opacity-50 cursor-not-allowed")}
                        >
                          {portal.isAccessible ? (
                            <BookOpen className="h-4 w-4 text-gold" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {!isCollapsed && (
                            <span className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{portal.ordem}.</span>
                              <span className="truncate">{portal.titulo}</span>
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <Collapsible open={quizzesOpen} onOpenChange={setQuizzesOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-gold transition-colors justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    {!isCollapsed && <span>Quizzes</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", quizzesOpen && "rotate-180")} />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {quizzes.map((quiz) => (
                      <SidebarMenuItem key={quiz.id}>
                        <SidebarMenuButton
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          isActive={location.pathname === `/quiz/${quiz.id}`}
                          tooltip={quiz.titulo}
                        >
                          <ClipboardList className="h-4 w-4 text-gold" />
                          {!isCollapsed && <span>{quiz.titulo}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Cursos Section */}
        {cursos.length > 0 && (
          <Collapsible open={cursosOpen} onOpenChange={setCursosOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-gold transition-colors justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {!isCollapsed && <span>Cursos</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", cursosOpen && "rotate-180")} />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {cursos.map((curso) => (
                      <SidebarMenuItem key={curso.id}>
                        <SidebarMenuButton
                          onClick={() => navigate(`/cursos/${curso.id}`)}
                          isActive={location.pathname === `/cursos/${curso.id}`}
                          tooltip={curso.titulo}
                        >
                          <GraduationCap className="h-4 w-4 text-gold" />
                          {!isCollapsed && <span>{curso.titulo}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
