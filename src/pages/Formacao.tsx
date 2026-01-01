import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Video, FileText, Lock, ChevronDown, ChevronRight, ExternalLink, DoorOpen, Music, Type } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type PortalType = Database['public']['Enums']['portal_type'];
type NivelSala = Database['public']['Enums']['nivel_sala'];

interface Sala {
  id: string;
  nome_exibicao: string;
  nivel_minimo: NivelSala;
}

interface Travessia {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  portal_minimo: PortalType;
  sala_id: string | null;
}

interface Aula {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  texto_aula: string | null;
  ordem: number;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  portal_minimo: PortalType;
}

const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  pre_iniciada: 2,
  iniciada: 3,
  admin: 4,
};

const NIVEL_SALA_HIERARCHY: Record<NivelSala, number> = {
  NIVEL_0: 0,
  NIVEL_1: 1,
  NIVEL_2: 2,
  NIVEL_3: 3,
};

const PORTAL_TO_NIVEL: Record<PortalType, NivelSala> = {
  visitante: 'NIVEL_0',
  pre_iniciada: 'NIVEL_1',
  iniciada: 'NIVEL_2',
  admin: 'NIVEL_3',
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
  const [salas, setSalas] = useState<Sala[]>([]);
  const [aulas, setAulas] = useState<Record<string, Aula[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTravessia, setExpandedTravessia] = useState<string | null>(null);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;
  const userNivelSala = user?.portal ? NIVEL_SALA_HIERARCHY[PORTAL_TO_NIVEL[user.portal]] : 0;

  const canAccessPortal = (portalMinimo: PortalType): boolean => {
    return userPortalLevel >= PORTAL_HIERARCHY[portalMinimo];
  };

  const canAccessSala = (sala: Sala | undefined): boolean => {
    if (!sala) return true; // Se não tem sala vinculada, acesso liberado
    return userNivelSala >= NIVEL_SALA_HIERARCHY[sala.nivel_minimo];
  };

  const canAccessTravessia = (travessia: Travessia): boolean => {
    const hasPortalAccess = canAccessPortal(travessia.portal_minimo);
    if (!travessia.sala_id) return hasPortalAccess;
    
    const sala = salas.find(s => s.id === travessia.sala_id);
    return hasPortalAccess && canAccessSala(sala);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch salas and travessias in parallel
    const [salasResult, travessiasResult] = await Promise.all([
      supabase.from('salas').select('id, nome_exibicao, nivel_minimo').eq('ativa', true),
      supabase.from('conteudo_travessias').select('*').order('ordem', { ascending: true }),
    ]);

    if (salasResult.error) {
      console.error('Erro ao carregar salas:', salasResult.error);
    } else {
      setSalas(salasResult.data || []);
    }

    if (travessiasResult.error) {
      console.error('Erro ao carregar travessias:', travessiasResult.error);
    } else {
      setTravessias(travessiasResult.data || []);
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
    if (!canAccessTravessia(travessia)) {
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
    if (!canAccessPortal(aula.portal_minimo)) {
      return; // Don't select locked aulas
    }
    setSelectedAula(aula);
  };

  const getTravessiaLockReason = (travessia: Travessia): string | null => {
    if (!canAccessPortal(travessia.portal_minimo)) {
      return `Requer portal ${PORTAL_LABELS[travessia.portal_minimo]}`;
    }
    if (travessia.sala_id) {
      const sala = salas.find(s => s.id === travessia.sala_id);
      if (sala && !canAccessSala(sala)) {
        return `Requer acesso à sala "${sala.nome_exibicao}"`;
      }
    }
    return null;
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
                const isLocked = !canAccessTravessia(travessia);
                const lockReason = getTravessiaLockReason(travessia);
                const isExpanded = expandedTravessia === travessia.id;
                const travessiaAulas = aulas[travessia.id] || [];
                const linkedSala = travessia.sala_id ? salas.find(s => s.id === travessia.sala_id) : null;

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
                            {linkedSala && !isLocked && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <DoorOpen className="w-3 h-3" />
                                {linkedSala.nome_exibicao}
                              </div>
                            )}
                          </div>
                        </div>
                        {isLocked && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            Bloqueado
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
                              const isAulaLocked = !canAccessPortal(aula.portal_minimo);
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
                                  ) : aula.video_url ? (
                                    <Video className="w-4 h-4 shrink-0" />
                                  ) : aula.audio_url ? (
                                    <Music className="w-4 h-4 shrink-0" />
                                  ) : aula.texto_aula ? (
                                    <Type className="w-4 h-4 shrink-0" />
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
                            {lockReason}
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
                      {selectedAula.video_url ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : selectedAula.audio_url ? (
                        <Music className="w-5 h-5 text-primary" />
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
                    {selectedAula.video_url && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={selectedAula.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedAula.titulo}
                        />
                      </div>
                    )}

                    {/* Audio Embed */}
                    {selectedAula.audio_url && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Music className="w-5 h-5 text-primary" />
                          <span className="font-medium text-sm">Áudio da Aula</span>
                        </div>
                        {selectedAula.audio_url.includes('soundcloud') ? (
                          <iframe
                            src={selectedAula.audio_url}
                            className="w-full h-32 rounded"
                            allow="autoplay"
                            title={`Áudio: ${selectedAula.titulo}`}
                          />
                        ) : (
                          <audio controls className="w-full">
                            <source src={selectedAula.audio_url} type="audio/mpeg" />
                            Seu navegador não suporta áudio.
                          </audio>
                        )}
                      </div>
                    )}

                    {/* Texto da Aula */}
                    {selectedAula.texto_aula && (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="flex items-center gap-2 mb-3">
                          <Type className="w-5 h-5 text-primary" />
                          <span className="font-medium text-sm">Conteúdo da Aula</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap">
                          {selectedAula.texto_aula}
                        </div>
                      </div>
                    )}

                    {/* PDF Link */}
                    {selectedAula.pdf_url && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">PDF da Aula</p>
                          <p className="text-xs text-muted-foreground">
                            Baixe ou visualize o PDF desta aula
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={selectedAula.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Abrir PDF
                          </a>
                        </Button>
                      </div>
                    )}

                    {/* Materials Link */}
                    {selectedAula.materiais_url && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Materiais Extras</p>
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

                    {/* No content */}
                    {!selectedAula.video_url && !selectedAula.audio_url && !selectedAula.texto_aula && !selectedAula.pdf_url && !selectedAula.materiais_url && (
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
