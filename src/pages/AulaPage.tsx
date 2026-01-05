import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, Check, Play, FileText, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface Portal {
  id: string;
  titulo: string;
}

export default function AulaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [aula, setAula] = useState<Aula | null>(null);
  const [portal, setPortal] = useState<Portal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [nextAula, setNextAula] = useState<Aula | null>(null);
  const [prevAula, setPrevAula] = useState<Aula | null>(null);

  useEffect(() => {
    if (id) {
      fetchAula();
    }
  }, [id, user]);

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

      // Fetch portal info
      const { data: portalData } = await supabase
        .from('conteudo_travessias')
        .select('id, titulo')
        .eq('id', aulaData.travessia_id)
        .maybeSingle();

      setPortal(portalData);

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

  const embedUrl = getEmbedUrl(aula.video_url);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-gold transition-colors"
          >
            Salas
          </button>
          <span>/</span>
          {portal && (
            <>
              <button 
                onClick={() => navigate(`/portal/${portal.id}`)}
                className="hover:text-gold transition-colors"
              >
                {portal.titulo}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{aula.titulo}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gold mb-2">
            Aula {aula.ordem}
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-2">{aula.titulo}</h1>
          <p className="text-muted-foreground">{aula.descricao_curta}</p>
        </div>

        {/* Video */}
        {embedUrl && (
          <Card className="mb-8 overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={aula.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>
        )}

        {/* Audio */}
        {aula.audio_url && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="w-4 h-4 text-gold" />
                Áudio da Aula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <audio controls className="w-full">
                <source src={aula.audio_url} />
              </audio>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {aula.texto_aula && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(aula.texto_aula.replace(/\n/g, '<br/>')) 
                }}
              />
            </CardContent>
          </Card>
        )}

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

        {/* Mark as Complete */}
        <div className="flex justify-center mb-8">
          <Button
            variant={isCompleted ? 'outline' : 'gold'}
            size="lg"
            onClick={markAsCompleted}
            disabled={isCompleted || isMarking}
            className="gap-2"
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
            onClick={() => prevAula ? navigate(`/aulas/${prevAula.id}`) : portal ? navigate(`/portal/${portal.id}`) : navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {prevAula ? 'Aula Anterior' : 'Voltar ao Portal'}
          </Button>
          
          {nextAula ? (
            <Button
              variant="gold"
              onClick={() => navigate(`/aulas/${nextAula.id}`)}
              className="gap-2"
            >
              Próxima Aula
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => portal ? navigate(`/portal/${portal.id}`) : navigate('/dashboard')}
              className="gap-2"
            >
              Finalizar Portal
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
