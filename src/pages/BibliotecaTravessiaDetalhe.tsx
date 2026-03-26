import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockedContentModal } from '@/components/shared/LockedContentModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { canAccessFeature, normalizePortalType } from '@/types/portal';
import { Database } from '@/integrations/supabase/types';
import { AudioOracular } from '@/components/audio/AudioOracular';

type PortalType = Database['public']['Enums']['portal_type'];
import { 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  Heart, 
  Compass, 
  Play,
  FileText,
  Image,
  Link as LinkIcon,
  Volume2
} from 'lucide-react';

interface TravessiaItem {
  id: string;
  slug: string;
  titulo_ritual: string;
  subtitulo: string | null;
  categoria: string;
  quando_chamada: string;
  o_que_sustenta: string;
  como_atravessar: string;
  capa_url: string | null;
  portal_minimo: PortalType;
}

interface TravessiaMedia {
  id: string;
  tipo: 'image' | 'video' | 'audio' | 'pdf' | 'link';
  url: string;
  titulo: string | null;
  ordem: number;
}

export default function BibliotecaTravessiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<TravessiaItem | null>(null);
  const [media, setMedia] = useState<TravessiaMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchItem();
    }
  }, [slug]);

  const fetchItem = async () => {
    try {
      const { data: itemData, error: itemError } = await supabase
        .from('travessia_library_items')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (itemError) throw itemError;
      setItem(itemData);

      // Fetch media if user has access
      if (itemData && user && canAccessFeature(user.portal, normalizePortalType(itemData.portal_minimo as any))) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('travessia_library_media')
          .select('*')
          .eq('item_id', itemData.id)
          .order('ordem');

        if (!mediaError && mediaData) {
          setMedia(mediaData as TravessiaMedia[]);
        }
      }
    } catch (error) {
      console.error('Error fetching travessia:', error);
      navigate('/ferramentas');
    } finally {
      setLoading(false);
    }
  };

  const canAccess = item && user ? canAccessFeature(user.portal, normalizePortalType(item.portal_minimo as any)) : false;

  const renderMediaItem = (mediaItem: TravessiaMedia) => {
    const iconMap = {
      video: Play,
      audio: Volume2,
      pdf: FileText,
      image: Image,
      link: LinkIcon
    };
    const Icon = iconMap[mediaItem.tipo];

    switch (mediaItem.tipo) {
      case 'video':
        // Handle YouTube/Vimeo embeds
        const videoId = extractVideoId(mediaItem.url);
        if (videoId) {
          return (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={videoId.type === 'youtube' 
                  ? `https://www.youtube.com/embed/${videoId.id}`
                  : `https://player.vimeo.com/video/${videoId.id}`
                }
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <video src={mediaItem.url} controls className="w-full rounded-lg" />
        );

      case 'audio':
        return (
          <AudioOracular
            audioUrl={mediaItem.url}
            titulo={mediaItem.titulo || 'Áudio'}
            compact
          />
        );

      case 'image':
        return (
          <img
            src={mediaItem.url}
            alt={mediaItem.titulo || 'Imagem'}
            className="w-full rounded-lg"
          />
        );

      case 'pdf':
        return (
          <a
            href={mediaItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-medium">{mediaItem.titulo || 'Documento PDF'}</span>
          </a>
        );

      case 'link':
        return (
          <a
            href={mediaItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <LinkIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">{mediaItem.titulo || mediaItem.url}</span>
          </a>
        );

      default:
        return null;
    }
  };

  const extractVideoId = (url: string): { type: 'youtube' | 'vimeo'; id: string } | null => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1] };

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };

    return null;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Travessia não encontrada.</p>
        </div>
      </AppLayout>
    );
  }

  // Show locked view for users without access
  if (!canAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/ferramentas')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Ferramentas
          </Button>

          {/* Locked Hero */}
          <div className="relative rounded-xl overflow-hidden">
            {item.capa_url && (
              <img
                src={item.capa_url}
                alt={item.titulo_ritual}
                className="w-full h-64 object-cover filter blur-sm"
              />
            )}
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-6">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">{item.titulo_ritual}</h1>
              {item.subtitulo && (
                <p className="text-muted-foreground italic mb-4">{item.subtitulo}</p>
              )}
              <Badge variant="outline" className="mb-4">{item.categoria}</Badge>
              <Button onClick={() => setLockedModalOpen(true)}>
                Desbloquear Acesso
              </Button>
            </div>
          </div>

          <LockedContentModal
            open={lockedModalOpen}
            onOpenChange={setLockedModalOpen}
            title="Travessia Guardada"
            description="Esta passagem requer um nível de acesso maior. Complete sua jornada para desbloquear este conteúdo."
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/ferramentas')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às Ferramentas
        </Button>

        {/* Hero Section */}
        <header className="space-y-4">
          {item.capa_url && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={item.capa_url}
                alt={item.titulo_ritual}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Badge variant="secondary">{item.categoria}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {item.titulo_ritual}
            </h1>
            {item.subtitulo && (
              <p className="text-xl text-muted-foreground italic">
                {item.subtitulo}
              </p>
            )}
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Quando é chamada */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Quando ela é chamada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {item.quando_chamada}
              </p>
            </CardContent>
          </Card>

          {/* O que sustenta */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-amber-500" />
                O que ela sustenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {item.o_que_sustenta}
              </p>
            </CardContent>
          </Card>

          {/* Como é atravessada */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Compass className="h-5 w-5 text-emerald-500" />
                Como ela é atravessada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {item.como_atravessar}
              </p>
            </CardContent>
          </Card>

          {/* Mídias */}
          {media.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mídias da Travessia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {media.map((m) => (
                  <div key={m.id}>
                    {m.titulo && m.tipo !== 'audio' && m.tipo !== 'pdf' && m.tipo !== 'link' && (
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {m.titulo}
                      </p>
                    )}
                    {renderMediaItem(m)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
