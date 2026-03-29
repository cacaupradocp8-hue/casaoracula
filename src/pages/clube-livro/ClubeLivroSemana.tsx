import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, BookOpen, Headphones, Scroll, HelpCircle, Flower2 } from 'lucide-react';
import { AudioOracular } from '@/components/audio/AudioOracular';

interface SemanaData {
  id: string;
  livro: string;
  capitulo_trecho: string;
  semana_numero: number;
  podcast_roteiro: string | null;
  podcast_audio_url: string | null;
  carta_semana: string | null;
  pergunta_contemplativa: string | null;
  pratica_terapeutica: string | null;
  publicado_em: string | null;
}

export default function ClubeLivroSemana() {
  const [semana, setSemana] = useState<SemanaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('clube_livro_semana')
        .select('*')
        .eq('status', 'publicado')
        .order('publicado_em', { ascending: false })
        .limit(1)
        .maybeSingle();
      setSemana(data as SemanaData | null);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        <SectionHeader
          title="Ritual da Semana"
          subtitle="Travessia simbólica do Clube de Leitura Oracular"
          icon={<BookOpen className="w-5 h-5" />}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !semana ? (
          <Card className="bg-card/30 mt-8">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Nenhum conteúdo publicado para esta semana.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Em breve, a próxima travessia.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 mt-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary/60">Semana {semana.semana_numero}</p>
              <h2 className="text-2xl font-display font-bold text-foreground">{semana.livro}</h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto line-clamp-2">{semana.capitulo_trecho}</p>
            </div>

            {/* Podcast */}
            {(semana.podcast_audio_url || semana.podcast_roteiro) && (
              <ContentCard
                icon={<Headphones className="w-4 h-4" />}
                title="🎧 Podcast Oracular"
                accentClass="text-primary"
              >
                {semana.podcast_audio_url && (
                  <AudioOracular audioUrl={semana.podcast_audio_url} titulo="Escuta da Semana" />
                )}
                {semana.podcast_roteiro && (
                  <details className="mt-3">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      Ver roteiro
                    </summary>
                    <p className="text-sm text-foreground/70 whitespace-pre-wrap mt-2 pl-3 border-l-2 border-primary/20">
                      {semana.podcast_roteiro}
                    </p>
                  </details>
                )}
              </ContentCard>
            )}

            {/* Carta da Semana */}
            {semana.carta_semana && (
              <ContentCard
                icon={<Scroll className="w-4 h-4" />}
                title="📜 Carta da Semana"
                accentClass="text-amber-400"
              >
                <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed italic">
                  {semana.carta_semana}
                </p>
              </ContentCard>
            )}

            {/* Pergunta Contemplativa */}
            {semana.pergunta_contemplativa && (
              <ContentCard
                icon={<HelpCircle className="w-4 h-4" />}
                title="❓ Pergunta Contemplativa"
                accentClass="text-violet-400"
              >
                <blockquote className="text-lg font-display text-foreground/90 text-center py-4 px-6 border-l-4 border-primary/30 bg-primary/5 rounded-r-lg">
                  "{semana.pergunta_contemplativa}"
                </blockquote>
              </ContentCard>
            )}

            {/* Prática Terapêutica */}
            {semana.pratica_terapeutica && (
              <ContentCard
                icon={<Flower2 className="w-4 h-4" />}
                title="🌿 Prática da Semana"
                accentClass="text-emerald-400"
              >
                <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {semana.pratica_terapeutica}
                </div>
              </ContentCard>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ContentCard({ icon, title, accentClass, children }: {
  icon: React.ReactNode;
  title: string;
  accentClass: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card/40 border-border/20 overflow-hidden">
      <CardContent className="pt-5 space-y-3">
        <div className={`flex items-center gap-2 text-sm font-semibold ${accentClass}`}>
          {icon}
          {title}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
