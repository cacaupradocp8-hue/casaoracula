import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { AudioOracular } from '@/components/audio/AudioOracular';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music, Headphones, BookOpen, Heart, Sparkles, Flower2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

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

const CATEGORIAS_CONFIG: Record<string, { icon: typeof Music; label: string }> = {
  'Meditações': { icon: Heart, label: 'Meditações' },
  'Narroterapia': { icon: BookOpen, label: 'Narroterapia' },
  'Clube de Leitura Oracular': { icon: Flower2, label: 'Clube de Leitura Oracular' },
  'Práticas Terapêuticas': { icon: Sparkles, label: 'Práticas Terapêuticas' },
  'Cartas Oraculares': { icon: Headphones, label: 'Cartas Oraculares' },
  'Geral': { icon: Music, label: 'Geral' },
};

export default function TemploEscuta() {
  const [audios, setAudios] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('*')
        .eq('publicado', true)
        .order('ordem');
      if (!error && data) setAudios(data);
      setLoading(false);
    })();
  }, []);

  const categorias = useMemo(() => {
    const cats = new Set<string>();
    audios.forEach(a => cats.add(a.categoria || 'Geral'));
    return Array.from(cats);
  }, [audios]);

  const filteredAudios = useMemo(() => {
    if (!categoriaAtiva) return audios;
    return audios.filter(a => (a.categoria || 'Geral') === categoriaAtiva);
  }, [audios, categoriaAtiva]);

  const selectedAudio = useMemo(
    () => audios.find(a => a.id === selectedAudioId),
    [audios, selectedAudioId]
  );

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* ══════ HERO ══════ */}
        <section className="relative py-20 md:py-28 flex flex-col items-center text-center overflow-hidden">
          {/* Breathing mandala */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, hsl(var(--gold) / 0.25) 0%, hsl(var(--mystic) / 0.1) 55%, transparent 100%)',
              }}
            />
          </div>

          {/* Sacred geometry rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="w-40 h-40 rounded-full border border-gold/10"
            />
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              className="absolute w-56 h-56 rounded-full border border-mystic/8"
            />
          </div>

          <div className="relative z-10 space-y-5 px-4">
            {/* Small mandala symbol */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 mx-auto rounded-full border border-gold/20 flex items-center justify-center"
            >
              <div className="w-7 h-7 rounded-full border border-gold/15 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold/40" />
              </div>
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-wide">
              Templo de Escuta
            </h1>
            <p className="text-sm md:text-base text-muted-foreground/60 max-w-md mx-auto leading-relaxed font-body italic">
              Um espaço para ouvir a linguagem da psique.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-gold/60" />
          </div>
        ) : audios.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground/50">Nenhum áudio disponível no momento.</p>
          </div>
        ) : (
          <ResponsiveContainer className="pb-24 space-y-12">
            {/* ══════ CATEGORY FILTERS ══════ */}
            {categorias.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setCategoriaAtiva(null)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-display tracking-wider transition-all duration-300 border",
                    !categoriaAtiva
                      ? "bg-gold/15 border-gold/25 text-gold"
                      : "bg-card/40 border-border/20 text-muted-foreground/60 hover:border-gold/15 hover:text-gold/70"
                  )}
                >
                  Todos
                </button>
                {categorias.map(cat => {
                  const config = CATEGORIAS_CONFIG[cat] || CATEGORIAS_CONFIG['Geral'];
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoriaAtiva(cat)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-display tracking-wider transition-all duration-300 border flex items-center gap-1.5",
                        categoriaAtiva === cat
                          ? "bg-gold/15 border-gold/25 text-gold"
                          : "bg-card/40 border-border/20 text-muted-foreground/60 hover:border-gold/15 hover:text-gold/70"
                      )}
                    >
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ══════ SELECTED AUDIO — IMMERSIVE PLAYER ══════ */}
            <AnimatePresence mode="wait">
              {selectedAudio && (
                <motion.div
                  key={selectedAudio.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-lg mx-auto"
                >
                  <AudioOracular
                    audioUrl={getPublicAudioUrl(selectedAudio.file_path)}
                    titulo={selectedAudio.titulo}
                    subtitulo={selectedAudio.porta_psiquica || selectedAudio.categoria || undefined}
                  />
                  <div className="text-center mt-3">
                    <button
                      onClick={() => setSelectedAudioId(null)}
                      className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                    >
                      ← Voltar à biblioteca
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ══════ AUDIO GRID ══════ */}
            {!selectedAudio && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAudios.map((audio, i) => (
                  <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <button
                      onClick={() => setSelectedAudioId(audio.id)}
                      className="w-full text-left group"
                    >
                      <Card className="border-border/10 bg-card/40 backdrop-blur-sm hover:-translate-y-1 hover:border-gold/15 hover:shadow-[0_8px_25px_-8px_hsl(var(--gold)/0.08)] transition-all duration-500">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Cover / Symbol */}
                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold/10 to-mystic/5 border border-gold/10 flex items-center justify-center shrink-0 group-hover:border-gold/20 transition-colors">
                              {audio.capa_url ? (
                                <img
                                  src={audio.capa_url}
                                  alt={audio.titulo}
                                  className="w-full h-full rounded-lg object-cover"
                                />
                              ) : (
                                <Headphones className="w-5 h-5 text-gold/50 group-hover:text-gold/70 transition-colors" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-sm text-foreground group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                                {audio.titulo}
                              </h3>
                              {audio.porta_psiquica && (
                                <p className="text-[10px] text-gold/50 mt-1 tracking-wide uppercase">
                                  {audio.porta_psiquica}
                                </p>
                              )}
                              {audio.descricao && (
                                <p className="text-xs text-muted-foreground/40 mt-1.5 line-clamp-2 leading-relaxed">
                                  {audio.descricao}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {audio.categoria && (
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/20 text-muted-foreground/50">
                                    {audio.categoria}
                                  </Badge>
                                )}
                                {audio.duracao_segundos && (
                                  <span className="text-[10px] text-muted-foreground/40 tabular-nums">
                                    {Math.floor(audio.duracao_segundos / 60)}min
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </AppLayout>
  );
}
