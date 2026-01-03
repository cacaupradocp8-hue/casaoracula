import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Lock, Check, Play, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { canAccessFeature, PortalType } from '@/types/portal';

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

  const isVisitante = user?.portal === 'visitante';

  useEffect(() => {
    if (user) {
      checkMatricula();
      fetchPortals();
    }
  }, [user]);

  const checkMatricula = async () => {
    if (!user) return;
    
    setCheckingMatricula(true);
    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select('id')
        .eq('user_id', user.id)
        .eq('curso_id', 'formacao_oracula')
        .eq('ativa', true)
        .maybeSingle();

      if (!error) {
        setIsMatriculada(!!data);
      }
    } catch (error) {
      console.error('Error checking matricula:', error);
    } finally {
      setCheckingMatricula(false);
    }
  };

  const fetchPortals = async () => {
    setIsLoading(true);
    try {
      // For visitantes, fetch ALL portals (even unpublished) to show as locked preview
      // For others, fetch only published portals
      let query = supabase
        .from('conteudo_travessias')
        .select('*')
        .order('ordem');

      if (!isVisitante) {
        query = query.eq('publicado', true);
      }

      const { data: portalsData, error: portalsError } = await query;

      if (portalsError) throw portalsError;
      setPortals(portalsData || []);

      if (!portalsData || portalsData.length === 0) {
        setIsLoading(false);
        return;
      }

      // Fetch all published aulas
      const { data: aulasData } = await supabase
        .from('conteudo_aulas')
        .select('id, travessia_id, ordem')
        .eq('publicado', true)
        .order('ordem');

      // Fetch user progress
      let userProgress: { aula_id: string }[] = [];
      if (user) {
        const { data: progressData } = await supabase
          .from('user_aula_progress')
          .select('aula_id')
          .eq('user_id', user.id);
        userProgress = progressData || [];
      }

      const completedAulaIds = new Set(userProgress.map(p => p.aula_id));

      // Calculate progress per portal
      const progressByPortal: Record<string, PortalProgress> = {};
      const nextAulaByPortal: Record<string, string | null> = {};

      for (const portal of portalsData) {
        const portalAulas = (aulasData || []).filter(a => a.travessia_id === portal.id);
        const completedCount = portalAulas.filter(a => completedAulaIds.has(a.id)).length;
        
        progressByPortal[portal.id] = {
          total: portalAulas.length,
          completed: completedCount
        };

        // Find next uncompleted aula
        const nextAula = portalAulas.find(a => !completedAulaIds.has(a.id));
        nextAulaByPortal[portal.id] = nextAula?.id || (portalAulas[0]?.id || null);
      }

      setProgress(progressByPortal);
      setNextAulas(nextAulaByPortal);
    } catch (error) {
      console.error('Error fetching portals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if portal is unlocked based on portal level AND sequential progress
  const isUnlocked = (portal: Portal, index: number) => {
    // Visitantes never have access - all portals are locked preview
    if (isVisitante || !isMatriculada) {
      return { unlocked: false, reason: 'matricula' as const };
    }

    // Must have portal level access
    if (!canAccess(portal.portal_minimo)) {
      return { unlocked: false, reason: 'nivel' as const };
    }

    // Sequential unlock: previous portal must be 100% complete
    if (index > 0) {
      const prevPortal = portals[index - 1];
      const prevProgress = progress[prevPortal.id];
      if (prevProgress && prevProgress.total > 0 && prevProgress.completed < prevProgress.total) {
        return { unlocked: false, reason: 'sequencial' as const };
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
      // For visitantes or non-matriculadas, show the modal
      if (isVisitante || !isMatriculada) {
        setLockedModalOpen(true);
      }
      return;
    }
    
    setSelectedPortal(selectedPortal === portal.id ? null : portal.id);
  };

  const getLockMessage = (reason: 'nivel' | 'matricula' | 'sequencial' | null, index: number) => {
    switch (reason) {
      case 'matricula':
        return 'Disponível após matrícula';
      case 'sequencial':
        return `Complete o Portal ${index} para desbloquear`;
      case 'nivel':
        return 'Este Portal será aberto no tempo certo da jornada';
      default:
        return '';
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

        {/* Matricula Status Banner - only for non-matriculadas */}
        {!isMatriculada && (
          <Card className="mb-8 border-gold/30 bg-gold/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Inicie sua jornada formativa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Os portais estão disponíveis para alunas matriculadas. 
                    Clique em qualquer portal para saber mais.
                  </p>
                </div>
                <Button 
                  variant="gold" 
                  size="sm"
                  onClick={() => setLockedModalOpen(true)}
                >
                  Matricular-se
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Intro Quote */}
        <div className="glass rounded-2xl p-8 mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/90 mb-4">
            "Todo portal se abre quando o mundo conhecido já não oferece respostas."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            {isMatriculada 
              ? 'Complete cada portal para avançar na jornada. Cada portal inclui aulas, exercícios reflexivos e conteúdos simbólicos.'
              : 'Conheça os portais da formação. Matricule-se para iniciar sua jornada transformadora.'
            }
          </p>
        </div>

        {/* Portals Grid - Always show portals, even if empty or locked */}
        {portals.length === 0 ? (
          // Show placeholder cards for visitantes when no portals exist
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
                      <p className="text-xs uppercase tracking-widest text-gold/60 mb-1 drop-shadow-lg">
                        Portal {num}
                      </p>
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
                    'group transition-all duration-500 overflow-hidden cursor-pointer',
                    unlocked ? 'hover:shadow-gold' : 'opacity-60',
                    selectedPortal === portal.id && 'ring-2 ring-gold/50'
                  )}
                  onClick={() => handlePortalClick(portal, index)}
                >
                  {/* Cover Header */}
                  <div 
                    className="relative h-40 md:h-48 overflow-hidden"
                    style={portal.capa_url ? {
                      backgroundImage: `url(${portal.capa_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : undefined}
                  >
                    {/* Background image with hover zoom effect */}
                    {portal.capa_url && (
                      <div 
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${portal.capa_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    )}
                    
                    {/* Fallback gradient when no cover image */}
                    {!portal.capa_url && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-primary/30 to-secondary/40" />
                    )}
                    
                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
                    
                    {/* Lock icon for locked portals */}
                    {!unlocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Lock className="w-5 h-5 text-muted-foreground drop-shadow-lg" />
                      </div>
                    )}
                    
                    {/* Text content over the cover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                      <p className="text-xs uppercase tracking-widest text-gold mb-1 drop-shadow-lg">
                        Portal {portal.ordem}
                      </p>
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground drop-shadow-lg">
                        {portal.titulo}
                      </h3>
                      {portal.subtitulo && (
                        <p className="text-sm text-foreground/80 mt-1 drop-shadow-md">
                          {portal.subtitulo}
                        </p>
                      )}
                    </div>
                    
                    {/* Completion badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-bold shadow-lg',
                        unlocked 
                          ? isComplete 
                            ? 'bg-gold text-primary-foreground' 
                            : 'bg-background/90 text-gold border border-gold/50'
                          : 'bg-muted/90 text-muted-foreground'
                      )}>
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
                            <p className="text-muted-foreground mb-4">
                              {portal.descricao}
                            </p>

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
                                {prog.completed === 0 ? 'Iniciar Portal' : isComplete ? 'Revisar' : 'Continuar'}
                              </Button>
                            ) : (
                              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                                <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Nenhuma aula publicada ainda.
                                </p>
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

      <LockedContentModal 
        open={lockedModalOpen} 
        onOpenChange={setLockedModalOpen} 
      />
    </AppLayout>
  );
}
