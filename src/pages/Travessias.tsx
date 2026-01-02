import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Lock, Check, Play, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
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

export default function Travessias() {
  const navigate = useNavigate();
  const { user, canAccess } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [progress, setProgress] = useState<Record<string, PortalProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [nextAulas, setNextAulas] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetchPortals();
  }, [user]);

  const fetchPortals = async () => {
    setIsLoading(true);
    try {
      // Fetch published portals
      const { data: portalsData, error: portalsError } = await supabase
        .from('conteudo_travessias')
        .select('*')
        .eq('publicado', true)
        .order('ordem');

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

  const isUnlocked = (portal: Portal) => {
    // Check if user has required portal level
    if (!canAccess(portal.portal_minimo)) {
      return false;
    }
    return true;
  };

  const handleContinue = (portalId: string) => {
    const nextAulaId = nextAulas[portalId];
    if (nextAulaId) {
      navigate(`/aulas/${nextAulaId}`);
    }
  };

  if (isLoading) {
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

        {/* Intro Quote */}
        <div className="glass rounded-2xl p-8 mb-12 text-center">
          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/90 mb-4">
            "Todo portal se abre quando o mundo conhecido já não oferece respostas."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Complete cada portal para avançar na jornada. Cada portal inclui aulas, 
            exercícios reflexivos e conteúdos simbólicos.
          </p>
        </div>

        {/* Portals Grid */}
        {portals.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum portal publicado ainda.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {portals.map((portal) => {
              const prog = progress[portal.id] || { total: 0, completed: 0 };
              const unlocked = isUnlocked(portal);
              const progressPercent = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0;
              const isComplete = prog.total > 0 && prog.completed === prog.total;
              const hasAulas = prog.total > 0;

              return (
                <Card 
                  key={portal.id}
                  className={cn(
                    'group transition-all duration-500',
                    unlocked ? 'hover:shadow-gold cursor-pointer' : 'opacity-60',
                    selectedPortal === portal.id && 'ring-2 ring-gold/50'
                  )}
                  onClick={() => unlocked && setSelectedPortal(
                    selectedPortal === portal.id ? null : portal.id
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {portal.capa_url ? (
                          <img 
                            src={portal.capa_url} 
                            alt={portal.titulo}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className={cn(
                            'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold transition-colors',
                            unlocked 
                              ? isComplete 
                                ? 'bg-gold text-primary-foreground' 
                                : 'bg-gold/20 text-gold'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {isComplete ? <Check className="w-6 h-6" /> : portal.ordem}
                          </div>
                        )}
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gold mb-1">
                            Portal {portal.ordem}
                          </p>
                          <CardTitle className="text-xl md:text-2xl font-display">
                            {portal.titulo}
                          </CardTitle>
                          {portal.subtitulo && (
                            <CardDescription className="mt-1">
                              {portal.subtitulo}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      {!unlocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className={cn(
                          'w-5 h-5 text-muted-foreground transition-transform',
                          selectedPortal === portal.id && 'rotate-90'
                        )} />
                      )}
                    </div>
                  </CardHeader>

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
                      <p className="text-sm text-muted-foreground">
                        Este Portal será aberto no tempo certo da jornada.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
