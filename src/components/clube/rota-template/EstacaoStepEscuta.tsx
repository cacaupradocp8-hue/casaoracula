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

  // Audio Playlist Logic — ordem fixa:
  // 1) Abertura da Estação  2) A Clareira onde tudo começou  3-6) Rastros (admin)
  // 7) Voz da Floresta  8+) Demais áudios (admin / treinamento)
  const audioPlaylist = useMemo(() => {
    const list: Array<{ url: string; title: string; type: string; icon: any }> = [];
    if (audioAberturaUrl) list.push({ url: audioAberturaUrl, title: "Abertura da Estação", type: "intro", icon: Music });
    if (audioVozClareiraUrl) list.push({ url: audioVozClareiraUrl, title: "A Clareira onde tudo começou", type: "content", icon: Headphones });
    const rastros = adminAudios.filter(a => /rastro/i.test(a.title));
    const outros = adminAudios.filter(a => !/rastro/i.test(a.title));
    rastros.forEach(a => list.push({ url: a.url, title: a.title, type: "content", icon: Headphones }));
    if (audioFlorestaUrl) list.push({ url: audioFlorestaUrl, title: "A Voz da Floresta", type: "ambient", icon: TreePine });
    outros.forEach(a => list.push({ url: a.url, title: a.title, type: "content", icon: Headphones }));
    return list;
  }, [audioVozClareiraUrl, audioAberturaUrl, audioFlorestaUrl, adminAudios]);

  const [activeAudioIndex, setActiveAudioIndex] = useState(0);

  const playlists = spotifyPlaylists && spotifyPlaylists.length > 0 
    ? spotifyPlaylists 
    : (spotifyPlaylistUrl ? [{ url: spotifyPlaylistUrl, label: 'Playlist Principal' }] : []);

  return (
    <div className="pb-20">
      <div className="space-y-8 text-center max-w-2xl mx-auto mb-20">
        <div className="space-y-12">
          {/* Main Title - Compacted for better mobile flow */}
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
        
        {/* Unified Audio Playlist Section */}
        {audioPlaylist.length > 0 && (
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Rastros Sonoros</span>
              </div>
              
              {/* Main Player for Active Audio */}
              <div className="relative">
                <EscutaPremium 
                  key={audioPlaylist[activeAudioIndex]?.url}
                  audioUrl={audioPlaylist[activeAudioIndex]?.url} 
                  titulo={audioPlaylist[activeAudioIndex]?.title} 
                  imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
                  className="py-0"
                  autoPlay
                  onEnded={() => setActiveAudioIndex((i) => Math.min(i + 1, audioPlaylist.length - 1))}
                />
              </div>

              {/* Selection List - Discreta e Sofisticada */}
              <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mb-2">Anexos desta Estação</p>
                {audioPlaylist.map((audio, idx) => {
                  const Icon = audio.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveAudioIndex(idx)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group",
                        activeAudioIndex === idx 
                          ? "bg-gold/10 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border transition-colors",
                          activeAudioIndex === idx ? "border-gold/30 bg-gold/10" : "border-white/10 bg-white/5"
                        )}>
                          <Icon className={cn("w-4 h-4", activeAudioIndex === idx ? "text-gold" : "text-white/40")} />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-serif italic block tracking-wide">{audio.title}</span>
                          <span className="text-[8px] uppercase tracking-widest font-bold opacity-40">
                            {audio.type === 'content' ? 'Conteúdo Principal' : audio.type === 'ambient' ? 'Ambiência' : 'Introdução'}
                          </span>
                        </div>
                      </div>
                      {activeAudioIndex === idx && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-0.5 h-3 bg-gold animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
          

        {/* Spotify Playlists — Ressonâncias da Clareira */}
        {playlists.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-gold/20 bg-gold/5">
              <Music className="w-3 h-3 text-gold" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">
                Ressonâncias da Clareira
              </span>
            </div>
            {playlists.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {playlists.map((pl: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActivePlaylistIndex(idx)}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full border transition-all",
                      activePlaylistIndex === idx
                        ? "bg-gold/15 border-gold/40 text-gold"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                    )}
                  >
                    {pl.label || `Playlist ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}
            <SpotifyPlaylistEmbed
              url={playlists[activePlaylistIndex]?.url}
              territorio={playlists[activePlaylistIndex]?.label}
            />
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