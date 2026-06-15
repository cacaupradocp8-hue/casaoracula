import React, { useState, useMemo, useEffect } from 'react';
import { Headphones, Sparkles, BookOpen, Music, ChevronRight, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { RotaLivroBanner } from './RotaLivroBanner';
import { SpotifyPlaylistEmbed } from '@/components/clube/SpotifyPlaylistEmbed';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface EstacaoStepEscutaProps {
  estacaoId: string;
  obraRegente: string;
  livroCapaUrl: string;
  livroBannerUrl: string;
  audioVozClareiraUrl?: string;
  audioAberturaUrl?: string;
  audioFlorestaUrl?: string;
  spotifyPlaylistUrl?: string;
  spotifyPlaylists?: any[];
  vozClareiraTexto?: string;
  onNext: () => void;
}

export const EstacaoStepEscuta: React.FC<EstacaoStepEscutaProps> = ({
  estacaoId,
  obraRegente,
  livroCapaUrl,
  audioVozClareiraUrl,
  audioAberturaUrl,
  audioFlorestaUrl,
  spotifyPlaylistUrl,
  spotifyPlaylists,
  vozClareiraTexto,
  onNext
}) => {
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [adminAudios, setAdminAudios] = useState<Array<{ url: string; title: string }>>([]);

  useEffect(() => {
    if (!estacaoId) return;
    (async () => {
      const { data, error } = await (supabase as any)
        .from('clube_v3_station_audios')
        .select('audio_url,title,display_order,destino,status')
        .eq('station_id', estacaoId)
        .eq('destino', 'escuta_ritual')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      if (!error && data) {
        setAdminAudios(data.map((a: any) => ({ url: a.audio_url, title: a.title })));
      }
    })();
  }, [estacaoId]);

  // Categorias fixas, na ordem de escuta
  type AudioItem = { url: string; title: string };
  type Categoria = { key: string; label: string; descricao: string; icon: any; items: AudioItem[] };

  const categorias = useMemo<Categoria[]>(() => {
    const rastros = adminAudios.filter(a => /rastro/i.test(a.title));
    const treinamento = adminAudios.filter(a => /treinamento|treino/i.test(a.title));
    const outros = adminAudios.filter(a => !/rastro|treinamento|treino/i.test(a.title));

    return [
      {
        key: 'abertura',
        label: 'Abertura da Estação',
        descricao: 'Convite inicial — escute antes de prosseguir.',
        icon: Music,
        items: audioAberturaUrl ? [{ url: audioAberturaUrl, title: 'Abertura da Estação' }] : [],
      },
      {
        key: 'clareira',
        label: 'A Clareira Onde Tudo Começou',
        descricao: 'O eixo simbólico desta travessia.',
        icon: Headphones,
        items: audioVozClareiraUrl ? [{ url: audioVozClareiraUrl, title: 'A Clareira onde tudo começou' }] : [],
      },
      {
        key: 'floresta',
        label: 'A Voz da Floresta',
        descricao: 'Ambiência e silêncio guiado.',
        icon: TreePine,
        items: audioFlorestaUrl ? [{ url: audioFlorestaUrl, title: 'A Voz da Floresta' }] : [],
      },
      {
        key: 'rastro',
        label: 'Rastro',
        descricao: 'Fragmentos para escuta contínua.',
        icon: Headphones,
        items: [...rastros, ...outros],
      },
      {
        key: 'treinamento',
        label: 'Áudio de Treinamento',
        descricao: 'Material formativo de prática.',
        icon: Sparkles,
        items: treinamento,
      },
    ].filter(c => c.items.length > 0);
  }, [audioVozClareiraUrl, audioAberturaUrl, audioFlorestaUrl, adminAudios]);

  const totalAudios = categorias.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="pb-20">
      <div className="space-y-8 text-center max-w-2xl mx-auto mb-20">
        <div className="space-y-12">
          {/* Main Title */}
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-8xl font-display font-black text-white tracking-[0.1em] sm:tracking-[0.15em] leading-tight uppercase relative inline-block px-4 break-words">
                <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  Voz da Clareira
                </span>
              </h1>
            </div>
          </div>

          {vozClareiraTexto && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              <p className="text-base md:text-lg font-serif italic text-white/80 leading-relaxed whitespace-pre-line relative z-10">
                {vozClareiraTexto}
              </p>
              <Sparkles className="absolute bottom-6 right-6 w-8 h-8 text-gold/10 group-hover:text-gold/20 transition-colors" />
            </motion.div>
          )}
        </div>

        {/* Biblioteca de Áudios — Timeline Categorizada */}
        {totalAudios > 0 && (
          <div className="space-y-10 text-left">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Biblioteca de Escuta</span>
              </div>
              <p className="text-[11px] text-white/40 italic font-serif">
                Siga a ordem das estações — toque cada áudio quando estiver pronta.
              </p>
            </div>

            <div className="relative pl-6 md:pl-8 space-y-12 border-l border-white/10">
              {(() => {
                let counter = 0;
                return categorias.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <section key={cat.key} className="relative space-y-5">
                      <div className="absolute -left-[33px] md:-left-[41px] top-0 w-7 h-7 rounded-full bg-background border border-gold/30 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-gold/80" />
                      </div>
                      <header className="space-y-1">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gold/60">
                          Categoria
                        </span>
                        <h2 className="font-display text-lg md:text-2xl text-white tracking-wide">
                          {cat.label}
                        </h2>
                        <p className="text-xs md:text-sm text-white/40 italic font-serif">
                          {cat.descricao}
                        </p>
                      </header>

                      <ol className="space-y-6">
                        {cat.items.map((audio) => {
                          counter += 1;
                          const numero = String(counter).padStart(2, '0');
                          return (
                            <li key={audio.url} className="space-y-2">
                              <div className="flex items-baseline gap-3">
                                <span className="text-[10px] font-mono font-bold text-gold/50 tabular-nums">
                                  {numero}
                                </span>
                                <span className="text-sm text-white/70 font-serif italic">
                                  {audio.title}
                                </span>
                              </div>
                              <EscutaPremium
                                audioUrl={audio.url}
                                titulo={audio.title}
                                imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
                                className="py-0"
                              />
                            </li>
                          );
                        })}
                      </ol>
                    </section>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-12 pt-8">

        <Button 
          onClick={onNext}
          className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-14 rounded-full uppercase tracking-[0.2em] text-[10px] transition-all group"
        >
          Próximo Passo
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};