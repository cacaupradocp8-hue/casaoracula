import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AudioCard } from '@/components/audio/AudioCard';
import { 
  Headphones, 
  Loader2, 
  Music,
  Home,
  ChevronRight
} from 'lucide-react';

interface AudioAsset {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  duracao_segundos: number | null;
  capa_url: string | null;
  categoria: string | null;
  portal_minimo: string;
  porta_psiquica: string | null;
}

export default function Audios() {
  const [audios, setAudios] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    const { data, error } = await supabase
      .from('audio_assets')
      .select('*')
      .eq('publicado', true)
      .order('ordem');

    if (!error && data) {
      setAudios(data);
    }
    setLoading(false);
  };

  const getAudioUrl = (filePath: string) => {
    const { data } = supabase.storage.from('audios').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePlay = (id: string) => {
    setCurrentPlayingId(id);
  };

  const handlePause = () => {
    setCurrentPlayingId(null);
  };

  const groupedAudios = audios.reduce((acc, audio) => {
    const cat = audio.categoria || 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(audio);
    return acc;
  }, {} as Record<string, AudioAsset[]>);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageShell
        badge="Biblioteca"
        title="Ofício da Voz Oracular™"
        subtitle="Áudios de treino para prática narrativa e simbólica"
        collapsibles={[
          {
            title: "O que é o Ofício da Voz?",
            children: "Uma coleção de áudios de treino para desenvolver sua prática narrativa e simbólica. Cada áudio é organizado por categoria e porta psíquica.",
          },
          {
            title: "Como usar",
            children: "Escolha uma categoria, selecione um áudio e pratique no seu ritmo. Use fones de ouvido para uma experiência mais imersiva.",
          },
        ]}
      >
        <div className="pb-20">
        {audios.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum áudio disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedAudios).map(([categoria, categoryAudios]) => (
              <div key={categoria}>
                <div className="flex items-center gap-3 mb-5">
                  <Badge variant="outline" className="text-gold border-gold/40">
                    {categoria}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    ({categoryAudios.length} {categoryAudios.length === 1 ? 'áudio' : 'áudios'})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categoryAudios.map((audio) => (
                    <AudioCard
                      key={audio.id}
                      id={audio.id}
                      title={audio.titulo}
                      porta={audio.porta_psiquica}
                      coverImageUrl={audio.capa_url}
                      audioUrl={getAudioUrl(audio.file_path)}
                      currentPlayingId={currentPlayingId}
                      onPlay={handlePlay}
                      onPause={handlePause}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </MobilePageShell>
    </AppLayout>
  );
}
