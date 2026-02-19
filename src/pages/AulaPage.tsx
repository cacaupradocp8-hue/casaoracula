import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollapsibleBlock } from '@/components/shared/MobilePageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, Check, Play, FileText, Download, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DiarioBordoAula } from '@/components/shared/DiarioBordoAula';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { useTravessiaUnlock } from '@/hooks/useTravessiaUnlock';
interface Aula {
  id: string;
  titulo: string;
  descricao_curta: string;
  texto_aula: string | null;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  ordem: number;
  travessia_id: string;
  portal_minimo: string;
}

interface ParentInfo {
  type: 'travessia' | 'portal';
  id: string;
  titulo: string;
  slug?: string;
}

export default function AulaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [aula, setAula] = useState<Aula | null>(null);
  const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [nextAula, setNextAula] = useState<Aula | null>(null);
  const [prevAula, setPrevAula] = useState<Aula | null>(null);
  const [isTravessiaZero, setIsTravessiaZero] = useState(false);
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  
  // Hook para verificar bloqueio temporal da Travessia Zero
  const { getDayStatus, registerAccess } = useTravessiaUnlock(
    isTravessiaZero ? aula?.travessia_id : undefined
  );

  // Extract Cloudflare video ID - must be before any conditional returns
  const videoId = useMemo(() => {
    if (!aula?.video_url) return null;
    if (isCloudflareVideoId(aula.video_url)) {
      return aula.video_url;
    }
    return extractVideoId(aula.video_url);
  }, [aula?.video_url, extractVideoId, isCloudflareVideoId]);

  useEffect(() => {
    if (id) {
      fetchAula();
    }
  }, [id, user]);

  // Registrar acesso quando entrar na aula da Travessia Zero
  useEffect(() => {
    if (isTravessiaZero && aula?.id && user) {
      registerAccess(aula.id);
    }
  }, [isTravessiaZero, aula?.id, user, registerAccess]);

  const fetchAula = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Fetch aula
      const { data: aulaData, error: aulaError } = await supabase
        .from('conteudo_aulas')
        .select('*')
        .eq('id', id)
        .eq('publicado', true)
        .maybeSingle();

      if (aulaError) throw aulaError;
      if (!aulaData) {
        toast({ title: 'Aula não encontrada', variant: 'destructive' });
        navigate('/travessias');
        return;
      }

      setAula(aulaData);

      // Fetch travessia info first (for Travessia Zero and similar)
      const { data: travessiaData } = await supabase
        .from('travessias')
        .select('id, title, slug')
        .eq('id', aulaData.travessia_id)
        .maybeSingle();

      if (travessiaData) {
        setParentInfo({
          type: 'travessia',
          id: travessiaData.id,
          titulo: travessiaData.title,
          slug: travessiaData.slug,
        });
        // Detectar se é Travessia Zero pelo slug
        setIsTravessiaZero(travessiaData.slug === 'travessia-zero' || travessiaData.slug === '00-limiar-da-casa');
      } else {
        // Fallback to conteudo_travessias (legacy portals)
        const { data: portalData } = await supabase
          .from('conteudo_travessias')
          .select('id, titulo')
          .eq('id', aulaData.travessia_id)
          .maybeSingle();

        if (portalData) {
          setParentInfo({
            type: 'portal',
            id: portalData.id,
            titulo: portalData.titulo,
          });
        }
        setIsTravessiaZero(false);
      }

      // Check if completed
      if (user) {
        const { data: progressData } = await supabase
          .from('user_aula_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('aula_id', id)
          .maybeSingle();

        setIsCompleted(!!progressData);
      }

      // Fetch prev/next aulas
      const { data: allAulas } = await supabase
        .from('conteudo_aulas')
        .select('id, titulo, ordem')
        .eq('travessia_id', aulaData.travessia_id)
        .eq('publicado', true)
        .order('ordem');

      if (allAulas) {
        const currentIndex = allAulas.findIndex(a => a.id === id);
        if (currentIndex > 0) {
          setPrevAula(allAulas[currentIndex - 1] as Aula);
        } else {
          setPrevAula(null);
        }
        if (currentIndex < allAulas.length - 1) {
          setNextAula(allAulas[currentIndex + 1] as Aula);
        } else {
          setNextAula(null);
        }
      }
    } catch (error) {
      console.error('Error fetching aula:', error);
      toast({ title: 'Erro ao carregar aula', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!user || !aula || isCompleted) return;
    
    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('user_aula_progress')
        .insert({ user_id: user.id, aula_id: aula.id });

      if (error) throw error;

      setIsCompleted(true);
      toast({ title: 'Aula marcada como concluída!' });
    } catch (error) {
      console.error('Error marking complete:', error);
      toast({ title: 'Erro ao marcar aula', variant: 'destructive' });
    } finally {
      setIsMarking(false);
    }
  };

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getAudioUrl = (url: string | null): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    
    // Se já é URL completa, retorna como está
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    // Constrói URL completa do storage
    return `https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/${trimmed}`;
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

  if (!aula) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Aula não encontrada.</p>
          <Button variant="outline" onClick={() => navigate('/travessias')} className="mt-4 mx-auto block">
            Voltar aos Portais
          </Button>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-28 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
          <button 
            onClick={() => navigate('/travessias')}
            className="hover:text-gold transition-colors"
          >
            Travessias
          </button>
          <span>/</span>
          {parentInfo && (
            <>
              <button 
                onClick={() => parentInfo.type === 'travessia' 
                  ? navigate(`/travessia/${parentInfo.slug}`) 
                  : navigate(`/portal/${parentInfo.id}`)
                }
                className="hover:text-gold transition-colors"
              >
                {parentInfo.titulo}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[160px]">{aula.titulo}</span>
        </div>

        {/* Mobile Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gold mb-1">
            Aula {aula.ordem}
          </p>
          <h1 className="font-display text-2xl md:text-4xl mb-2 leading-tight">{aula.titulo}</h1>
          <p className="text-sm text-muted-foreground">{aula.descricao_curta}</p>
        </div>

        {/* Collapsible info */}
        {aula.texto_aula && (
          <CollapsibleBlock title="Conteúdo da Aula" defaultOpen={false}>
            <div 
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(aula.texto_aula.replace(/\n/g, '<br/>')) 
              }}
            />
          </CollapsibleBlock>
        )}
        <div className="mb-6" />

        {/* Video - Cloudflare Stream only */}
        {aula.video_url && (
          videoId ? (
            <div className="mb-8">
              <CloudflareStreamPlayer
                videoId={videoId}
                title={aula.titulo}
                contextType="aula"
                contextId={aula.id}
                requiredPortal={aula.portal_minimo}
              />
            </div>
          ) : (
            <Card className="mb-8 overflow-hidden">
              <div className="aspect-video flex items-center justify-center bg-muted/30">
                <div className="text-center p-6">
                  <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Vídeo não disponível no Cloudflare Stream
                  </p>
                </div>
              </div>
            </Card>
          )
        )}

        {/* Audio */}
        {aula.audio_url && (
          <UnifiedAudioPlayer
            audioUrl={aula.audio_url}
            title="Áudio da Aula"
            size="lg"
            className="mb-8"
          />
        )}

        {/* Content — agora exibido via CollapsibleBlock no topo, removendo duplicata */}

        {/* Materials */}
        {(aula.pdf_url || aula.materiais_url) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {aula.pdf_url && (
                <Button variant="outline" asChild>
                  <a href={aula.pdf_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </a>
                </Button>
              )}
              {aula.materiais_url && (
                <Button variant="outline" asChild>
                  <a href={aula.materiais_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Materiais Extras
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Diário de Bordo */}
        <DiarioBordoAula aulaId={aula.id} className="mb-8" />

        {/* Mark as Complete */}
        {/* Diário de Bordo */}
        <div className="mb-6" />

        {/* Mark as Complete — Botão fixo inferior mobile */}
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border/30 px-4 py-3">
          <Button
            variant={isCompleted ? 'outline' : 'gold'}
            size="lg"
            onClick={markAsCompleted}
            disabled={isCompleted || isMarking}
            className="w-full gap-2"
          >
            {isMarking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isCompleted ? (
              <Check className="w-4 h-4" />
            ) : null}
            {isCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (prevAula) {
                navigate(`/aulas/${prevAula.id}`);
              } else if (parentInfo?.type === 'travessia') {
                navigate(`/travessia/${parentInfo.slug}`);
              } else if (parentInfo) {
                navigate(`/portal/${parentInfo.id}`);
              } else {
                navigate('/travessias');
              }
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {prevAula ? 'Aula Anterior' : 'Voltar'}
          </Button>
          
          {nextAula ? (
            (() => {
              // Verificar se a próxima aula está bloqueada (Travessia Zero)
              const nextUnlockStatus = isTravessiaZero ? getDayStatus(nextAula.id) : null;
              const isNextLocked = isTravessiaZero && nextUnlockStatus && !nextUnlockStatus.isUnlocked;
              
              if (isNextLocked) {
                return (
                  <Button
                    variant="outline"
                    disabled
                    className="gap-2 opacity-60 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Próxima Aula Bloqueada
                  </Button>
                );
              }
              
              return (
                <Button
                  variant="gold"
                  onClick={() => navigate(`/aulas/${nextAula.id}`)}
                  className="gap-2"
                >
                  Próxima Aula
                  <ArrowRight className="w-4 h-4" />
                </Button>
              );
            })()
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                if (parentInfo?.type === 'travessia') {
                  navigate(`/travessia/${parentInfo.slug}`);
                } else if (parentInfo) {
                  navigate(`/portal/${parentInfo.id}`);
                } else {
                  navigate('/travessias');
                }
              }}
              className="gap-2"
            >
              Concluir Travessia
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
