import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePageShell } from "@/components/shared/MobilePageShell";
import { LockedContentModal } from "@/components/shared/LockedContentModal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Check, Play, Loader2, AlertCircle, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalType } from "@/types/portal";
import { motion } from "framer-motion";

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
      if (!error) setIsMatriculada(!!data);
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
      let query = supabase.from("conteudo_travessias").select("*").order("ordem");
      if (!visitante) query = query.eq("publicado", true);
      const { data: portalsData, error: portalsError } = await query;
      if (portalsError) throw portalsError;
      const safePortals = (portalsData || []) as Portal[];
      setPortals(safePortals);
      if (safePortals.length === 0) { setProgress({}); setNextAulas({}); return; }

      const { data: aulasData } = await supabase.from("conteudo_aulas").select("id, travessia_id, ordem").eq("publicado", true).order("ordem");
      let userProgress: { aula_id: string }[] = [];
      if (user?.id) {
        const { data: progressData } = await supabase.from("user_aula_progress").select("aula_id").eq("user_id", user.id);
        userProgress = progressData || [];
      }
      const completedAulaIds = new Set(userProgress.map((p) => p.aula_id));
      const progressByPortal: Record<string, PortalProgress> = {};
      const nextAulaByPortal: Record<string, string | null> = {};
      for (const portal of safePortals) {
        const portalAulas = (aulasData || []).filter((a) => a.travessia_id === portal.id);
        const completedCount = portalAulas.filter((a) => completedAulaIds.has(a.id)).length;
        progressByPortal[portal.id] = { total: portalAulas.length, completed: completedCount };
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

  const isUnlocked = (portal: Portal, index: number) => {
    if (isVisitante) return { unlocked: false, reason: "matricula" as const };
    if (!isMatriculada && !isAdmin) return { unlocked: false, reason: "matricula" as const };
    if (!canAccess(portal.portal_minimo) && !isAdmin) return { unlocked: false, reason: "nivel" as const };
    if (!isAdmin && index > 0) {
      const prevPortal = portals[index - 1];
      const prevProgress = progress[prevPortal?.id];
      if (prevProgress && prevProgress.total > 0 && prevProgress.completed < prevProgress.total)
        return { unlocked: false, reason: "sequencial" as const };
    }
    return { unlocked: true, reason: null };
  };

  const handleContinue = (portalId: string) => {
    const nextAulaId = nextAulas[portalId];
    if (nextAulaId) navigate(`/aulas/${nextAulaId}`);
  };

  const handlePortalClick = (portal: Portal, index: number) => {
    const { unlocked } = isUnlocked(portal, index);
    if (!unlocked) {
      if (isVisitante || (!isMatriculada && !isAdmin)) setLockedModalOpen(true);
      return;
    }
    setSelectedPortal((prev) => (prev === portal.id ? null : portal.id));
  };

  const getLockMessage = (reason: LockReason, index: number) => {
    switch (reason) {
      case "matricula": return "Disponível após matrícula";
      case "sequencial": {
        const prev = portals[index - 1];
        return prev ? `Complete o Portal ${prev.ordem} para desbloquear` : "Complete o portal anterior";
      }
      case "nivel": return "Este Portal será aberto no tempo certo da jornada";
      default: return "";
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
      <MobilePageShell
        badge="Formação"
        title="Sala dos Portais"
        subtitle="Sua formação simbólica em jornadas transformadoras"
        collapsibles={[
          {
            title: "O que são os Portais?",
            children: "Todo portal se abre quando o mundo conhecido já não oferece respostas. Cada portal inclui aulas, exercícios reflexivos e conteúdos simbólicos para avançar na jornada.",
          },
          {
            title: "Como usar",
            children: isAdmin
              ? "Você está como Admin: pode abrir portais e testar a jornada."
              : isMatriculada
                ? "Complete cada portal para avançar. Os portais são sequenciais — conclua um para desbloquear o próximo."
                : "Conheça os portais da formação. Matricule-se para iniciar sua jornada transformadora.",
          },
        ]}
        primaryAction={!isMatriculada && !isAdmin ? {
          label: "Matricular-se",
          onClick: () => setLockedModalOpen(true),
          icon: <GraduationCap className="w-4 h-4" />,
        } : undefined}
      >
        <div className="pb-20">
          {/* Timeline vertical */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden md:block" />

            {portals.length === 0 ? (
              isVisitante ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((num) => (
                    <motion.div
                      key={num}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: num * 0.1 }}
                      className="relative md:pl-16 cursor-pointer"
                      onClick={() => setLockedModalOpen(true)}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-muted border-2 border-muted-foreground/30 hidden md:flex items-center justify-center z-10">
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                      <div className="rounded-xl border border-border/60 bg-card/60 p-6 opacity-50">
                        <p className="text-xs uppercase tracking-[0.2em] text-gold/40 font-medium mb-2">Portal {num}</p>
                        <h3 className="font-display text-xl font-semibold text-foreground/50">Em breve</h3>
                        <p className="text-sm text-muted-foreground mt-2">Disponível após matrícula</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground/60 text-base">Nenhum portal publicado ainda.</p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {portals.map((portal, index) => {
                  const prog = progress[portal.id] || { total: 0, completed: 0 };
                  const { unlocked, reason } = isUnlocked(portal, index);
                  const progressPercent = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0;
                  const isComplete = prog.total > 0 && prog.completed === prog.total;
                  const hasAulas = prog.total > 0;
                  const isExpanded = selectedPortal === portal.id;

                  return (
                    <motion.div
                      key={portal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      className={cn("relative md:pl-16", !unlocked && "opacity-60")}
                    >
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute left-4 top-6 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center z-10",
                        isComplete ? "bg-gold border-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                          : unlocked ? "bg-background border-gold/60"
                          : "bg-muted border-muted-foreground/30"
                      )}>
                        {isComplete && <Check className="w-2.5 h-2.5 text-background" />}
                      </div>

                      <div
                        className={cn(
                          "group rounded-xl border overflow-hidden cursor-pointer transition-all duration-500",
                          unlocked
                            ? "border-border/60 bg-card hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
                            : "border-border/30 bg-card/50",
                          isExpanded && "ring-1 ring-gold/30"
                        )}
                        onClick={() => handlePortalClick(portal, index)}
                      >
                        {/* Cover area */}
                        <div className="relative h-44 md:h-52 overflow-hidden">
                          {portal.capa_url ? (
                            <>
                              <div
                                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${portal.capa_url})`, backgroundSize: "cover", backgroundPosition: "center" }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-primary/20 to-secondary/30" />
                          )}

                          {!unlocked && (
                            <div className="absolute top-4 right-4 z-10">
                              <Lock className="w-5 h-5 text-muted-foreground/70" />
                            </div>
                          )}

                          {/* Portal number badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <div className={cn(
                              "w-11 h-11 rounded-full flex items-center justify-center font-display text-lg font-bold shadow-lg backdrop-blur-sm",
                              isComplete ? "bg-gold/90 text-background"
                                : unlocked ? "bg-background/80 text-gold border border-gold/40"
                                : "bg-muted/80 text-muted-foreground"
                            )}>
                              {isComplete ? <Check className="w-5 h-5" /> : portal.ordem}
                            </div>
                          </div>

                          {/* Title area */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium mb-1.5">
                              Portal {portal.ordem}
                            </p>
                            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground leading-[1.3]">
                              {portal.titulo}
                            </h3>
                            {portal.subtitulo && (
                              <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{portal.subtitulo}</p>
                            )}
                          </div>
                        </div>

                        {/* Content area */}
                        <div className="p-5 md:p-6">
                          {unlocked && (
                            <>
                              {hasAulas && (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-foreground/50 text-sm">Progresso</span>
                                    <span className="text-foreground/80 font-medium text-sm">
                                      {prog.completed}/{prog.total} aulas
                                    </span>
                                  </div>
                                  {/* Double glow progress */}
                                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progressPercent}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold/70"
                                    />
                                    <motion.div
                                      animate={{ width: `${progressPercent}%` }}
                                      className="absolute inset-y-0 left-0 h-full rounded-full bg-gold/30 blur-sm"
                                    />
                                  </div>
                                </div>
                              )}

                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pt-4 border-t border-border/40"
                                >
                                  <p className="text-foreground/60 text-base leading-[1.8] mb-5">{portal.descricao}</p>
                                  {hasAulas ? (
                                    <Button
                                      variant="gold"
                                      className="w-full gap-2 shadow-lg shadow-gold/10"
                                      onClick={(e) => { e.stopPropagation(); handleContinue(portal.id); }}
                                    >
                                      <Play className="w-4 h-4" />
                                      {prog.completed === 0 ? "Iniciar Portal" : isComplete ? "Revisar" : "Continuar"}
                                    </Button>
                                  ) : (
                                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                                      <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-sm text-foreground/50">Nenhuma aula publicada ainda.</p>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </>
                          )}

                          {!unlocked && (
                            <div className="flex items-center gap-2.5 text-sm text-foreground/40">
                              <Lock className="w-4 h-4 shrink-0" />
                              <p className="leading-relaxed">{getLockMessage(reason, index)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </MobilePageShell>

      <LockedContentModal open={lockedModalOpen} onOpenChange={setLockedModalOpen} />
    </AppLayout>
  );
}
