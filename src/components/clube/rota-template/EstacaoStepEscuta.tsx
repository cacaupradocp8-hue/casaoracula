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

  // Flatten in order, preserving category metadata per item
  const trilha = useMemo(() => {
    const list: { numero: string; categoriaLabel: string; categoriaIcon: any; categoriaDescricao: string; title: string; url: string; categoriaKey: string }[] = [];
    categorias.forEach((cat) => {
      cat.items.forEach((it) => {
        list.push({
          numero: '',
          categoriaLabel: cat.label,
          categoriaIcon: cat.icon,
          categoriaDescricao: cat.descricao,
          categoriaKey: cat.key,
          title: it.title,
          url: it.url,
        });
      });
    });

    // Override: promove o áudio da posição 8 para a posição 4 e renomeia para "A Clareira"
    if (list.length >= 8) {
      const [movido] = list.splice(7, 1);
      movido.title = 'A Clareira';
      list.splice(3, 0, movido);
    }

    // Renumera sequencialmente após o reordenamento
    return list.map((item, idx) => ({
      ...item,
      numero: String(idx + 1).padStart(2, '0'),
    }));
  }, [categorias]);

  const [openUrl, setOpenUrl] = useState<string | null>(null);

  return (
    <div className="pb-20">
      <div className="space-y-8 text-center max-w-2xl mx-auto mb-10 px-1 sm:px-0">
        <div className="space-y-5 py-4">
          <h1 className="text-2xl md:text-4xl font-display font-black text-white tracking-[0.15em] uppercase leading-tight">
            <span className="bg-gradient-to-b from-white to-gold/70 bg-clip-text text-transparent">
              Voz da Clareira
            </span>
          </h1>

          {/* Caixa: Orientação da Casa */}
          <div className="mx-auto max-w-xl rounded-2xl border border-gold/15 bg-white/[0.03] backdrop-blur-md px-5 py-5 sm:px-7 sm:py-6 text-left space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">
                Orientação da Casa
              </span>
            </div>
            {vozClareiraTexto && (
              <p className="text-[15px] sm:text-base font-serif italic text-white/85 leading-[1.75] whitespace-pre-line break-words">
                {vozClareiraTexto}
              </p>
            )}
            <p className="text-xs sm:text-sm text-white/65 leading-relaxed border-t border-white/10 pt-3">
              Escute os áudios <span className="text-gold/90 font-semibold">na ordem numerada</span> da trilha abaixo —
              cada faixa prepara a seguinte. Toque um por vez, sem pular.
            </p>
          </div>
        </div>

        {/* Trilha vertical compacta */}
        {trilha.length > 0 && (
          <div className="text-left">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Trilha de Escuta</span>
              </div>
            </div>

            <ol className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md divide-y divide-white/5 overflow-hidden">
              {trilha.map((item) => {
                const Icon = item.categoriaIcon;
                const isOpen = openUrl === item.url;
                return (
                  <li key={item.url}>
                    <button
                      type="button"
                      onClick={() => setOpenUrl(isOpen ? null : item.url)}
                      className={cn(
                        "w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 text-left transition-colors",
                        isOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
                      )}
                    >
                      {/* Número */}
                      <span className="w-6 text-[11px] font-mono font-bold tabular-nums text-gold/60 text-center shrink-0">
                        {item.numero}
                      </span>

                      {/* Disco girando (no lugar da capa) */}
                      <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0">
                        <div
                          className={cn(
                            "absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-800 border border-white/15 shadow-inner",
                            isOpen && "[animation:spin_4s_linear_infinite]"
                          )}
                          style={{
                            backgroundImage:
                              "repeating-radial-gradient(circle at center, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
                          }}
                        >
                          <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-gold/80 border border-black/60" />
                        </div>
                      </div>

                      {/* Título + categoria */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm md:text-base font-serif text-white/90 leading-snug truncate">
                          {item.title}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Icon className="w-3 h-3 text-gold/60 shrink-0" />
                          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold/60 truncate">
                            {item.categoriaLabel}
                          </span>
                        </div>
                      </div>

                      {/* Play indicator */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all",
                          isOpen
                            ? "bg-gold text-midnight border-gold"
                            : "border-gold/30 text-gold/70"
                        )}
                      >
                        {isOpen ? (
                          <span className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 h-2 bg-midnight animate-pulse" />
                            <span className="w-0.5 h-3 bg-midnight animate-pulse [animation-delay:150ms]" />
                            <span className="w-0.5 h-1.5 bg-midnight animate-pulse [animation-delay:300ms]" />
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 md:px-4 pb-4">
                            <EscutaPremium
                              audioUrl={item.url}
                              titulo={item.title}
                              imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
                              className="py-0"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
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