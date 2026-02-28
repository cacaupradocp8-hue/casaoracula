import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Headphones, BookOpen } from 'lucide-react';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { useAuth } from '@/contexts/AuthContext';

export default function EstudioOracular() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data } = await supabase
        .from('studio_episodes')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      setEpisodes(data || []);
      setLoading(false);
    };
    fetchEpisodes();
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        <SectionHeader
          title="Estúdio Oracular"
          subtitle="Leituras terapêuticas simbólicas — ouça, absorva, integre."
          icon={<Headphones className="w-5 h-5" />}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : episodes.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Nenhum episódio disponível ainda. Em breve.
          </p>
        ) : (
          <div className="space-y-4 mt-8">
            {selected ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Voltar à biblioteca
                </button>

                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {selected.titulo || selected.livro}
                  </h2>
                  {selected.descricao && (
                    <p className="text-muted-foreground">{selected.descricao}</p>
                  )}

                  {selected.audio_full_url && (
                    <UnifiedAudioPlayer
                      audioUrl={selected.audio_full_url}
                      title="Leitura Completa"
                      size="lg"
                    />
                  )}

                  {selected.roteiro_completo && (
                    <Card className="bg-card/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-4 h-4 text-gold" />
                          <span className="text-sm font-medium text-gold">Roteiro da Leitura</span>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground/80">
                          {selected.roteiro_completo}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              episodes.map((ep) => (
                <Card
                  key={ep.id}
                  className="bg-card/50 hover:bg-card/80 transition-all cursor-pointer group"
                  onClick={() => setSelected(ep)}
                >
                  <CardContent className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Headphones className="w-5 h-5 text-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate">
                          {ep.titulo || ep.livro}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {ep.descricao || `${ep.livro}${ep.capitulo ? ` — ${ep.capitulo}` : ''}`}
                        </p>
                      </div>
                      {ep.visibility !== 'exclusive' && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          Público
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
