// ============================================
// AULA PAGE — Composição modular de blocos
// Cada seção é um bloco independente editável
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DiarioBordoAula } from '@/components/shared/DiarioBordoAula';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';
import { useTravessiaUnlock } from '@/hooks/useTravessiaUnlock';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

// Blocos modulares independentes
import {
  AulaHeaderBlock,
  AulaMediaBlock,
  AulaTranscricaoBlock,
  AulaMateriaisBlock,
  AulaCompleteBlock,
  AulaNavigationBlock,
} from '@/components/aula/blocks';

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

  const { getDayStatus, registerAccess } = useTravessiaUnlock(
    isTravessiaZero ? aula?.travessia_id : undefined
  );

  const videoId = useMemo(() => {
    if (!aula?.video_url) return null;
    if (isCloudflareVideoId(aula.video_url)) return aula.video_url;
    return extractVideoId(aula.video_url);
  }, [aula?.video_url, extractVideoId, isCloudflareVideoId]);

  useEffect(() => {
    if (id) fetchAula();
  }, [id, user]);

  useEffect(() => {
    if (isTravessiaZero && aula?.id && user) {
      registerAccess(aula.id);
    }
  }, [isTravessiaZero, aula?.id, user, registerAccess]);

  const fetchAula = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
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
        setIsTravessiaZero(travessiaData.slug === 'travessia-zero' || travessiaData.slug === '00-limiar-da-casa');
      } else {
        const { data: portalData } = await supabase
          .from('conteudo_travessias')
          .select('id, titulo')
          .eq('id', aulaData.travessia_id)
          .maybeSingle();

        if (portalData) {
          setParentInfo({ type: 'portal', id: portalData.id, titulo: portalData.titulo });
        }
        setIsTravessiaZero(false);
      }

      if (user) {
        const { data: progressData } = await supabase
          .from('user_aula_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('aula_id', id)
          .maybeSingle();
        setIsCompleted(!!progressData);
      }

      const { data: allAulas } = await supabase
        .from('conteudo_aulas')
        .select('id, titulo, ordem')
        .eq('travessia_id', aulaData.travessia_id)
        .eq('publicado', true)
        .order('ordem');

      if (allAulas) {
        const currentIndex = allAulas.findIndex(a => a.id === id);
        setPrevAula(currentIndex > 0 ? (allAulas[currentIndex - 1] as Aula) : null);
        setNextAula(currentIndex < allAulas.length - 1 ? (allAulas[currentIndex + 1] as Aula) : null);
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

  // Scroll to media section
  const scrollToMedia = () => {
    document.getElementById('aula-media')?.scrollIntoView({ behavior: 'smooth' });
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

  // Next aula lock status for Travessia Zero
  const nextUnlockStatus = isTravessiaZero && nextAula ? getDayStatus(nextAula.id) : null;
  const isNextLocked = !!(isTravessiaZero && nextUnlockStatus && !nextUnlockStatus.isUnlocked);

  return (
    <AppLayout>
      <ResponsiveContainer size="narrow" className="py-6 pb-28">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
          <button onClick={() => navigate('/travessias')} className="hover:text-gold transition-colors">
            Travessias
          </button>
          <span>/</span>
          {parentInfo && (
            <>
              <button
                onClick={() =>
                  parentInfo.type === 'travessia'
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

        {/* BLOCO 1: Header com título e botão iniciar */}
        <AulaHeaderBlock
          ordem={aula.ordem}
          titulo={aula.titulo}
          descricaoCurta={aula.descricao_curta}
          onPlay={(aula.video_url || aula.audio_url) ? scrollToMedia : undefined}
        />

        {/* BLOCO 2: Mídia principal (vídeo ou áudio — nunca múltiplos players) */}
        <div id="aula-media">
          <AulaMediaBlock
            videoUrl={aula.video_url}
            audioUrl={aula.audio_url}
            videoId={videoId}
            titulo={aula.titulo}
            aulaId={aula.id}
            portalMinimo={aula.portal_minimo}
          />
        </div>

        {/* BLOCO 3: Transcrição colapsável */}
        {aula.texto_aula && (
          <AulaTranscricaoBlock textoAula={aula.texto_aula} />
        )}

        {/* BLOCO 4: Materiais / Resumo */}
        <AulaMateriaisBlock pdfUrl={aula.pdf_url} materiaisUrl={aula.materiais_url} />

        {/* BLOCO 5: Diário de Bordo (Aplicação / Criar Registro) */}
        <DiarioBordoAula aulaId={aula.id} className="mb-8" />

        {/* BLOCO 6: Botão fixo — Marcar como Concluída */}
        <AulaCompleteBlock
          isCompleted={isCompleted}
          isMarking={isMarking}
          onMark={markAsCompleted}
        />

        {/* BLOCO 7: Navegação (Pontes para aulas anterior/próxima) */}
        <AulaNavigationBlock
          prevAula={prevAula}
          nextAula={nextAula}
          parentInfo={parentInfo}
          isTravessiaZero={isTravessiaZero}
          isNextLocked={isNextLocked}
          onNavigate={(path) => navigate(path)}
        />
      </ResponsiveContainer>
    </AppLayout>
  );
}
