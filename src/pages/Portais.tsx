import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LockedContentModal } from "@/components/shared/LockedContentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Lock, Check, Play, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalType } from "@/types/portal";

interface Portal {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  ordem: number;
  portal_minimo: PortalType;
  capa_url: string | null;
  publicado: boolean;
}

interface PortalProgress {
  total: number;
  completed: number;
}

type LockReason = "nivel" | "matricula" | "sequencial" | null;

export default function Portais() {
  const navigate = useNavigate();
  const { user, canAccess } = useAuth();

  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [progress, setProgress] = useState<Record<string, PortalProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [nextAulas, setNextAulas] = useState<Record<string, string | null>>({});
  const [isMatriculada, setIsMatriculada] = useState(false);
  const [checkingMatricula, setCheckingMatricula] = useState(true);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const isVisitante = user?.portal === "visitante";
  const isAdmin = user?.portal === "admin";

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      await checkMatricula();
      await fetchPortals(user.portal);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const checkMatricula = async () => {
    if (!user) return;

    setCheckingMatricula(true);
    try {
      const { data, error } = await supabase
        .from("matriculas")
        .select("id")
        .eq("user_id", user.id)
        .eq("curso_id", "formacao_oracula")
        .eq("ativa", true)
        .maybeSingle();

      if (!error) {
        setIsMatriculada(!!data);
      }
    } catch (error) {
      console.error("Error checking matricula:", error);
    } finally {
      setCheckingMatricula(false);
    }
  };

  const fetchPortals = async (portalTipo?: string) => {
    setIsLoading(true);

    const visitante = portalTipo === "visitante";

    try {
      // Visitante: pode ver "preview" (inclui não publicados) para mostrar como bloqueado
      // Outros: ver apenas publicados (regra de produto)
      let query = supabase.from("conteudo_travessias").select("*").order("ordem");

      if (!visitante) {
        query = query.eq("publicado", true);
      }

      const { data: portalsData, error: portalsError } = await query;

      if (portalsError) throw portalsError;

      const safePortals = (portalsData || []) as Portal[];
      setPortals(safePortals);

      if (safePortals.length === 0) {
        setProgress({});
        setNextAulas({});
        return;
      }

      // Buscar aulas publicadas
      const { data: aulasData, error: aulasError } = await supabase
        .from("conteudo_aulas")
        .select("id, travessia_id, ordem")
        .eq("publicado", true)
        .order("ordem");

      if (aulasError) {
        console.error("Error fetching aulas:", aulasError);
      }

      // Buscar progresso do usuário (se houver)
      let userProgress: { aula_id: string }[] = [];
      if (user?.id) {
        const { data: progressData, error: progressError } = await supabase
          .from("user_aula_progress")
          .select("aula_id")
          .eq("user_id", user.id);

        if (progressError) {
          console.error("Error fetching user progress:", progressError);
        }
        userProgress = progressData || [];
      }

      const completedAulaIds = new Set(userProgress.map((p) => p.aula_id));

      const progressByPortal: Record<string, PortalProgress> = {};
      const nextAulaByPortal: Record<string, string | null> = {};

      for (const portal of safePortals) {
        const portalAulas = (aulasData || []).filter((a) => a.travessia_id === portal.id);
        const completedCount = portalAulas.filter((a) => completedAulaIds.has(a.id)).length;

        progressByPortal[portal.id] = {
          total: portalAulas.length,
          completed: completedCount,
        };

        const nextAula = portalAulas.find((a) => !completedAulaIds.has(a.id));
        nextAulaByPortal[portal.id] = nextAula?.id || portalAulas[0]?.id || null;
      }

      setProgress(progressByPortal);
      setNextAulas(nextAulaByPortal);
    } catch (error) {
      console.error("Error fetching portals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Desbloqueio: nível + sequencial + matrícula (admin ignora matrícula)
  const isUnlocked = (portal: Portal, index: number) => {
    // Visitantes nunca acessam (apenas preview bloqueado)
    if (isVisitante) {
      return { unlocked: false, reason: "matricula" as const };
    }

    // Matrícula: necessário para alunas, mas admin ignora
    if (!isMatriculada && !isAdmin) {
      return { unlocked: false, reason: "matricula" as const };
    }

    // Nível mínimo do portal (admin pode ignorar ou respeitar; aqui vamos respeitar canAccess, mas se quiser ignorar admin, eu ajusto)
    if (!canAccess(portal.portal_minimo) && !isAdmin) {
      return { unlocked: false, reason: "nivel" as const };
    }

    // Sequencial: admin pode ignorar (recomendado para gestão/teste)
    if (!isAdmin && index > 0) {
      const prevPortal = portals[index - 1];
      const prevProgress = progress[prevPortal?.id];
      if (prevProgress && prevProgress.total > 0 && prevProgress.completed < prevProgress.total) {
        return { unlocked: false, reason: "sequencial" as const };
      }
    }

    return { unlocked: true, reason: null };
  };

  const handleContinue = (portalId: string) => {
    const nextAulaId = nextAulas[portalId];
    if (nextAulaId) {
      navigate(`/aulas/${nextAulaId}`);
    }
  };

  const handlePortalClick = (portal: Portal, index: number) => {
    const { unlocked } = isUnlocked(portal, index);

    if (!unlocked) {
      // visitante e não-matriculada veem o modal (admin não precisa)
      if (isVisitante || (!isMatriculada && !isAdmin)) {
        setLockedModalOpen(true);
      }
      return;
    }

    setSelectedPortal((prev) => (prev === portal.id ? null : portal.id));
  };

  const getLockMessage = (reason: LockReason, index: number) => {
    switch (reason) {
      case "matricula":
        return "Disponível após matrícula";
      case "sequencial": {
        const prev = portals[index - 1];
        return prev
          ? `Complete o Portal ${prev.ordem} para desbloquear`
          : "Complete o portal anterior para desbloquear";
      }
      case "nivel":
        return "Este Portal será aberto no tempo certo da jornada";
      default:
        return "";
    }
  };

  if (isLoading || checkingMatricula) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Sala dos Portais"
          subtitle="Sua formação simbólica em jornadas transformadoras"
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Banner de matrícula (não mostra para admin) */}
        {!isMatriculada && !isAdmin && (
          <Card className="mb-8 border-gold/30 bg-gold/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Inicie sua jornada formativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Os portais estão disponíveis para alunas matriculadas. Clique em qualquer portal para saber mais.
                  </p>
                </div>
                <Button variant="gold" size="sm" onClick={() => setLockedModalOpen(true)}>
                  Matricular-se
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Intro */}
        <div className="glass rounded-2xl p-8 mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/90 mb-4">
            "Todo portal se abre quando o mundo conhecido já não oferece respostas."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Você está como Admin: pode abrir portais e testar a jornada."
              : isMatriculada
                ? "Complete cada portal para avançar na jornada. Cada portal inclui aulas, exercícios reflexivos e conteúdos simbólicos."
                : "Conheça os portais da formação. Matricule-se para iniciar sua jornada transformadora."}
          </p>
        </div>

        {/* Portais */}
        {portals.length === 0 ? (
          isVisitante ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((num) => (
                <Card
                  key={num}
                  className="group transition-all duration-500 overflow-hidden opacity-60 cursor-pointer"
                  onClick={() => setLockedModalOpen(true)}
                >
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-primary/20 to-secondary/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

                    <div className="absolute top-4 right-4 z-10">
                      <Lock className="w-5 h-5 text-muted-foreground drop-shadow-lg" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                      <p className="text-xs uppercase tracking-widest text-gold/60 mb-1 drop-shadow-lg">Portal {num}</p>
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground/60 drop-shadow-lg">
                        Portal em breve
                      </h3>
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-bold shadow-lg bg-muted/90 text-muted-foreground">
                        {num}
                      </div>
                    </div>
                  </div>

                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4 shrink-0" />
                      <p>Disponível após matrícula</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum portal publicado ainda.</p>
            </Card>
          )
        ) : (
          <div className="grid gap-6">
            {portals.map((portal, index) => {
              const prog = progress[portal.id] || { total: 0, completed: 0 };
              const { unlocked, reason } = isUnlocked(portal, index);

              const progressPercent = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0;
              const isComplete = prog.total > 0 && prog.completed === prog.total;
              const hasAulas = prog.total > 0;

              return (
                <Card
                  key={portal.id}
                  className={cn(
                    "group transition-all duration-500 overflow-hidden cursor-pointer",
                    unlocked ? "hover:shadow-gold" : "opacity-60",
                    selectedPortal === portal.id && "ring-2 ring-gold/50",
                  )}
                  onClick={() => handlePortalClick(portal, index)}
                >
                  <div
                    className="relative h-40 md:h-48 overflow-hidden"
                    style={
                      portal.capa_url
                        ? {
                            backgroundImage: `url(${portal.capa_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {portal.capa_url && (
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${portal.capa_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    )}

                    {!portal.capa_url && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-primary/30 to-secondary/40" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

                    {!unlocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Lock className="w-5 h-5 text-muted-foreground drop-shadow-lg" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                      <p className="text-xs uppercase tracking-widest text-gold mb-1 drop-shadow-lg">
                        Portal {portal.ordem}
                      </p>
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground drop-shadow-lg">
                        {portal.titulo}
                      </h3>
                      {portal.subtitulo && (
                        <p className="text-sm text-foreground/80 mt-1 drop-shadow-md">{portal.subtitulo}</p>
                      )}
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-bold shadow-lg",
                          unlocked
                            ? isComplete
                              ? "bg-gold text-primary-foreground"
                              : "bg-background/90 text-gold border border-gold/50"
                            : "bg-muted/90 text-muted-foreground",
                        )}
                      >
                        {isComplete ? <Check className="w-5 h-5" /> : portal.ordem}
                      </div>
                    </div>
                  </div>

                  <CardContent>
                    {unlocked && (
                      <>
                        {hasAulas && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="text-foreground font-medium">
                                {prog.completed}/{prog.total} aulas
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        )}

                        {selectedPortal === portal.id && (
                          <div className="pt-4 border-t border-border animate-fade-in">
                            <p className="text-muted-foreground mb-4">{portal.descricao}</p>

                            {hasAulas ? (
                              <Button
                                variant="gold"
                                className="w-full gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContinue(portal.id);
                                }}
                              >
                                <Play className="w-4 h-4" />
                                {prog.completed === 0 ? "Iniciar Portal" : isComplete ? "Revisar" : "Continuar"}
                              </Button>
                            ) : (
                              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                                <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Nenhuma aula publicada ainda.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {!unlocked && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4 shrink-0" />
                        <p>{getLockMessage(reason, index)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <LockedContentModal open={lockedModalOpen} onOpenChange={setLockedModalOpen} />
    </AppLayout>
  );
}
