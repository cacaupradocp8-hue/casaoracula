import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Loader2, BookOpen, DoorOpen, ClipboardList, Wrench, GraduationCap, Clock, BarChart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature, PortalType } from "@/types/portal";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { Course } from "@/types/course";
import { useCopy } from "@/hooks/useCopy";
import { ModularPageRenderer } from "@/components/modular/ModularPageRenderer";
import { VisitorSalaContent } from "@/components/visitor/VisitorSalaContent";

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
}

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string;
  ordem: number;
  ativa: boolean;
  tipo_ferramenta: string | null;
  origem_metodologica: string | null;
  finalidade_pratica: string | null;
  portal_minimo: string | null;
}

interface Sala {
  id: string;
  nome_exibicao: string;
  texto_entrada: string;
  nivel_minimo: string;
}

interface Portal {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  capa_url: string | null;
  portal_minimo: string;
  ordem: number;
}

// Dynamic icon component - map common icons
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

// Determine sala type based on nivel_minimo
const isSalaFormacao = (nivel: string) => nivel === 'NIVEL_1';
const isSalaVisitante = (nivel: string) => nivel === 'NIVEL_0';

export default function SalaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCopyByKey } = useCopy();

  const [sala, setSala] = useState<Sala | null>(null);
  const [portais, setPortais] = useState<Portal[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch sala first to determine type
      const salaRes = await supabase
        .from("salas")
        .select("id, nome_exibicao, texto_entrada, nivel_minimo")
        .eq("id", id)
        .eq("ativa", true)
        .maybeSingle();

      if (salaRes.error || !salaRes.data) {
        navigate("/dashboard");
        return;
      }
      
      setSala(salaRes.data);
      const nivelMinimo = salaRes.data.nivel_minimo;
      
      // Sala da Formação (NIVEL_1): fetch ONLY portais
      // Other salas: fetch ferramentas, quizzes, cursos (but NOT portais)
      if (isSalaFormacao(nivelMinimo)) {
        const portaisRes = await supabase
          .from("conteudo_travessias")
          .select("*")
          .eq("sala_id", id)
          .eq("publicado", true)
          .order("ordem");
        
        setPortais(portaisRes.data || []);
        setFerramentas([]);
        setQuizzes([]);
        setCursos([]);
      } else {
        // Sala Visitante, Iniciada, Orácula: fetch ferramentas, quizzes, cursos
        const [quizzesRes, ferramentasRes, cursosRes] = await Promise.all([
          supabase
            .from("quizzes")
            .select("id, titulo, descricao")
            .eq("sala_id", id)
            .eq("ativo", true),
          supabase
            .from("sala_ferramentas")
            .select("id, ferramenta_nome, ferramenta_descricao, icone, rota, ordem, ativa, tipo_ferramenta, origem_metodologica, finalidade_pratica, portal_minimo")
            .eq("sala_id", id)
            .eq("ativa", true)
            .order("ordem"),
          supabase
            .from("courses")
            .select("*")
            .eq("sala_id", id)
            .eq("publicado", true)
            .order("ordem"),
        ]);

        setPortais([]);
        setQuizzes(quizzesRes.data || []);
        setFerramentas(ferramentasRes.data || []);
        setCursos((cursosRes.data as Course[]) || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessPortal = (portal: Portal) => {
    if (!user) return false;
    return canAccessFeature(user.portal, portal.portal_minimo as PortalType);
  };

  // Prepare sidebar data with accessibility info
  const sidebarPortais = portais.map(portal => ({
    id: portal.id,
    titulo: portal.titulo,
    ordem: portal.ordem,
    isAccessible: canAccessPortal(portal),
  }));

  const sidebarFerramentas = ferramentas.map(f => ({
    id: f.id,
    ferramenta_nome: f.ferramenta_nome,
    icone: f.icone,
    rota: f.rota,
  }));

  const sidebarQuizzes = quizzes.map(q => ({
    id: q.id,
    titulo: q.titulo,
  }));

  const sidebarCursos = cursos.map(c => ({
    id: c.id,
    titulo: c.titulo,
  }));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!sala) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Sala não encontrada.</p>
          <Button variant="outline" onClick={() => navigate("/salas")} className="mt-4 mx-auto block">
            Voltar às Salas
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title={sala.nome_exibicao}
          subtitle={sala.texto_entrada}
          icon={<DoorOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Ferramentas Section */}
        {ferramentas.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Ferramentas
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ferramentas.map((ferramenta) => (
                <Card
                  key={ferramenta.id}
                  className="glass hover:border-gold/50 cursor-pointer transition-all group"
                  onClick={() => navigate(ferramenta.rota)}
                >
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center mb-2 group-hover:bg-gold/30 transition-colors">
                      <DynamicIcon name={ferramenta.icone || "wrench"} className="w-5 h-5 text-gold" />
                    </div>
                    <CardTitle className="text-base group-hover:text-gold transition-colors">
                      {ferramenta.ferramenta_nome}
                    </CardTitle>
                    {ferramenta.ferramenta_descricao && (
                      <CardDescription className="text-sm">{ferramenta.ferramenta_descricao}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="gap-2 text-gold">
                      {getCopyByKey('btn_iniciar_travessia', 'Iniciar a travessia')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cursos Section */}
        {cursos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Cursos
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cursos.map((curso) => (
                <Card
                  key={curso.id}
                  className="glass hover:border-gold/50 cursor-pointer transition-all group overflow-hidden"
                  onClick={() => navigate(`/cursos/${curso.id}`)}
                >
                  {curso.capa_url && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={curso.capa_url}
                        alt={curso.titulo}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-gold transition-colors">
                      {curso.titulo}
                    </CardTitle>
                    {curso.subtitulo && (
                      <CardDescription className="text-sm">{curso.subtitulo}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {curso.duracao_estimada && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {curso.duracao_estimada}
                        </span>
                      )}
                      {curso.nivel && (
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {curso.nivel}
                        </span>
                      )}
                    </div>
                    <Button variant="gold" size="sm" className="gap-2">
                      Ver Curso
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Quiz Disponível
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="glass hover:border-gold/50 cursor-pointer transition-all"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.titulo}</CardTitle>
                    {quiz.descricao && <CardDescription>{quiz.descricao}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Button variant="gold" size="sm">
                      {getCopyByKey('btn_iniciar_travessia', 'Iniciar a travessia')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Portais Grid - Only shown for Sala da Formação */}
        {sala && isSalaFormacao(sala.nivel_minimo) && (
          <>
            {portais.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {portais.map((portal) => {
                  const isAccessible = canAccessPortal(portal);

                  return (
                    <Card
                      key={portal.id}
                      className={cn(
                        "group transition-all duration-300 overflow-hidden",
                        isAccessible && "hover:shadow-gold cursor-pointer",
                        !isAccessible && "opacity-60",
                      )}
                    >
                      {portal.capa_url && (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={portal.capa_url}
                            alt={portal.titulo}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {isAccessible ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                          </div>
                          <span className="text-xs text-muted-foreground">Portal {portal.ordem}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle
                          className={cn("text-lg mb-1", isAccessible && "group-hover:text-gold transition-colors")}
                        >
                          {portal.titulo}
                        </CardTitle>
                        {portal.subtitulo && <p className="text-sm text-gold mb-2">{portal.subtitulo}</p>}
                        <CardDescription className="text-sm line-clamp-2">{portal.descricao}</CardDescription>
                        <div className="flex items-center justify-between mt-4">
                          {isAccessible ? (
                            <Link to={`/portal/${portal.id}`} className="w-full">
                              <Button variant="gold" className="w-full gap-2">
                                {getCopyByKey('btn_atravessar', 'Atravessar')}
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">Requer Portal {portal.portal_minimo}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum portal disponível nesta sala ainda.</p>
              </div>
            )}
          </>
        )}

        {/* Empty state for salas without content */}
        {sala && !isSalaFormacao(sala.nivel_minimo) && ferramentas.length === 0 && quizzes.length === 0 && cursos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma ferramenta disponível nesta sala ainda.</p>
          </div>
        )}

        {/* Visitor Sala Content - Special blocks for visitors */}
        {sala && isSalaVisitante(sala.nivel_minimo) && (
          <div className="mt-8">
            <VisitorSalaContent />
          </div>
        )}

        {/* Modular Blocks Section - only for non-visitor salas */}
        {sala && id && !isSalaVisitante(sala.nivel_minimo) && (
          <ModularPageRenderer
            contextType="sala"
            contextId={id}
            fallback={null}
            blockSpacing="lg"
            className="mt-8"
          />
        )}
      </div>
    </AppLayout>
  );
}
