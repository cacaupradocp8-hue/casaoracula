import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Video, FileText, Lock, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type PortalType = Database['public']['Enums']['portal_type'];

interface Travessia {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: PortalType;
}

interface Aula {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  ordem: number;
  video_embed_url: string | null;
  materiais_url: string | null;
  portal_minimo: PortalType;
}

const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  pre_iniciada: 2,
  iniciada: 3,
  admin: 4,
};

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: 'Visitante',
  pre_iniciada: 'Pré-Iniciada',
  iniciada: 'Iniciada ORÁCULA',
  admin: 'Admin',
};

export default function Formacao() {
  const { user } = useAuth();
  const [travessias, setTravessias] = useState<Travessia[]>([]);
  const [aulas, setAulas] = useState<Record<string, Aula[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTravessia, setExpandedTravessia] = useState<string | null>(null);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;

  const canAccessContent = (portalMinimo: PortalType): boolean => {
    return userPortalLevel >= PORTAL_HIERARCHY[portalMinimo];
  };

  useEffect(() => {
    fetchTravessias();
  }, []);

  const fetchTravessias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conteudo_travessias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Erro ao carregar travessias:', error);
    } else {
      // Filter travessias based on user portal - show all but mark locked ones
      setTravessias(data || []);
    }
    setLoading(false);
  };

  const fetchAulas = async (travessiaId: string) => {
    const { data, error } = await supabase
      .from('conteudo_aulas')
      .select('*')
      .eq('travessia_id', travessiaId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Erro ao carregar aulas:', error);
    } else {
      setAulas((prev) => ({ ...prev, [travessiaId]: data || [] }));
    }
  };

  const handleExpandTravessia = (travessia: Travessia) => {
    if (!canAccessContent(travessia.portal_minimo)) {
      return; // Don't expand locked travessias
    }

    if (expandedTravessia === travessia.id) {
      setExpandedTravessia(null);
      setSelectedAula(null);
    } else {
      setExpandedTravessia(travessia.id);
      setSelectedAula(null);
      if (!aulas[travessia.id]) {
        fetchAulas(travessia.id);
      }
    }
  };

  const handleSelectAula = (aula: Aula) => {
    if (!canAccessContent(aula.portal_minimo)) {
      return; // Don't select locked aulas
    }
    setSelectedAula(aula);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-primary font-display text-xl">Carregando formação...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Formação ORÁCULA"
          subtitle="Sua jornada de aprendizado através das Travessias"
          icon={<GraduationCap className="w-5 h-5" />}
          className="mb-8"
        />

        {travessias.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum conteúdo formativo disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar with Travessias and Aulas */}
            <div className="lg:col-span-1 space-y-4">
              {travessias.map((travessia) => {
                const isLocked = !canAccessContent(travessia.portal_minimo);
                const isExpanded = expandedTravessia === travessia.id;
                const travessiaAulas = aulas[travessia.id] || [];

                return (
                  <Card
                    key={travessia.id}
                    className={cn(
                      'transition-all',
                      isLocked && 'opacity-60',
                      isExpanded && 'ring-2 ring-primary/50'
                    )}
                  >
                    <CardHeader
                      className={cn(
                        'cursor-pointer pb-3',
                        isLocked && 'cursor-not-allowed'
                      )}
                      onClick={() => handleExpandTravessia(travessia)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                          ) : isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-primary shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <div>
                            <CardTitle className="text-base">{travessia.titulo}</CardTitle>
                            {travessia.descricao && (
                              <CardDescription className="text-xs mt-1 line-clamp-2">
                                {travessia.descricao}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        {isLocked && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {PORTAL_LABELS[travessia.portal_minimo]}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    {isExpanded && !isLocked && (
                      <CardContent className="pt-0 border-t">
                        {travessiaAulas.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">
                            Nenhuma aula disponível.
                          </p>
                        ) : (
                          <div className="space-y-1 pt-3">
                            {travessiaAulas.map((aula) => {
                              const isAulaLocked = !canAccessContent(aula.portal_minimo);
                              const isSelected = selectedAula?.id === aula.id;

                              return (
                                <button
                                  key={aula.id}
                                  onClick={() => handleSelectAula(aula)}
                                  disabled={isAulaLocked}
                                  className={cn(
                                    'w-full text-left p-3 rounded-md transition-all flex items-center gap-3',
                                    isAulaLocked
                                      ? 'opacity-50 cursor-not-allowed bg-muted/30'
                                      : isSelected
                                      ? 'bg-primary/10 text-primary'
                                      : 'hover:bg-muted'
                                  )}
                                >
                                  {isAulaLocked ? (
                                    <Lock className="w-4 h-4 shrink-0" />
                                  ) : aula.video_embed_url ? (
                                    <Video className="w-4 h-4 shrink-0" />
                                  ) : (
                                    <BookOpen className="w-4 h-4 shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{aula.titulo}</p>
                                    {isAulaLocked && (
                                      <p className="text-xs text-muted-foreground">
                                        Requer: {PORTAL_LABELS[aula.portal_minimo]}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    )}

                    {isLocked && (
                      <CardContent className="pt-0">
                        <div className="bg-muted/50 rounded-md p-3 text-center">
                          <Lock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Conteúdo disponível para nível {PORTAL_LABELS[travessia.portal_minimo]}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {selectedAula ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedAula.video_embed_url ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-primary" />
                      )}
                      {selectedAula.titulo}
                    </CardTitle>
                    {selectedAula.descricao_curta && (
                      <CardDescription>{selectedAula.descricao_curta}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Video Embed */}
                    {selectedAula.video_embed_url && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={selectedAula.video_embed_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedAula.titulo}
                        />
                      </div>
                    )}

                    {/* Materials Link */}
                    {selectedAula.materiais_url && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Materiais de Apoio</p>
                          <p className="text-xs text-muted-foreground">
                            Acesse os materiais complementares desta aula
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={selectedAula.materiais_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Acessar
                          </a>
                        </Button>
                      </div>
                    )}

                    {/* No video or materials */}
                    {!selectedAula.video_embed_url && !selectedAula.materiais_url && (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Conteúdo em desenvolvimento.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">Selecione uma aula</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Escolha uma Travessia à esquerda e clique em uma aula para visualizar o conteúdo.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
