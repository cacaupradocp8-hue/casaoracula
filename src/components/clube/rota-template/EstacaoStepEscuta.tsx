import React, { useState } from 'react';
import { Headphones, Sparkles, BookOpen, Music, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { RotaLivroBanner } from './RotaLivroBanner';
import { SpotifyPlaylistEmbed } from '@/components/clube/SpotifyPlaylistEmbed';
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

  const playlists = spotifyPlaylists && spotifyPlaylists.length > 0 
    ? spotifyPlaylists 
    : (spotifyPlaylistUrl ? [{ url: spotifyPlaylistUrl, label: 'Playlist Principal' }] : []);

  return (
    <div className="pb-20">
      <div className="space-y-16 text-center max-w-2xl mx-auto mb-20">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Headphones className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Câmara da Escuta</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-white italic tracking-tight leading-tight">Clareira do Chamado</h2>
            <div className="flex items-center justify-center gap-4 text-gold/60">
              <div className="h-px w-8 bg-gold/20" />
              <span className="text-lg md:text-xl font-serif italic tracking-[0.1em]">Rota dos Lobos</span>
              <div className="h-px w-8 bg-gold/20" />
            </div>
          </div>
          
          {vozClareiraTexto && (
            <div className="max-w-lg mx-auto p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <p className="text-sm md:text-base font-serif italic text-white/70 leading-relaxed whitespace-pre-line">
                {vozClareiraTexto}
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-24">
          {audioVozClareiraUrl && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Voz da Clareira</span>
              </div>
              <EscutaPremium 
                audioUrl={audioVozClareiraUrl} 
                titulo="A Voz da Clareira" 
                imagemEscuta={livroCapaUrl}
                className="py-0"
              />
            </div>
          )}

          {audioFlorestaUrl && (
            <div className="space-y-6 pt-12 border-t border-white/5">
              <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Sons da Natureza</span>
              </div>
              <EscutaPremium 
                audioUrl={audioFlorestaUrl} 
                titulo="Voz da Floresta" 
                imagemEscuta="/clareira-disco.png"
                className="py-0"
              />
            </div>
          )}
        </div>
          
        {playlists.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-white/10">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {playlists.map((pl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePlaylistIndex(idx)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border",
                    activePlaylistIndex === idx 
                      ? "bg-gold text-midnight border-gold" 
                      : "bg-white/5 text-white/40 border-white/10 hover:border-gold/30"
                  )}
                >
                  <Music className="w-3 h-3 inline mr-2" />
                  {pl.label || pl.territorio || `Playlist ${idx + 1}`}
                </button>
              ))}
            </div>

            <SpotifyPlaylistEmbed 
              url={playlists[activePlaylistIndex].url} 
              territorio={playlists[activePlaylistIndex].territorio}
            />
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-12 pt-8">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
            <Sparkles className="w-5 h-5 text-gold/40 mx-auto" />
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Série de Áudios</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
            <BookOpen className="w-5 h-5 text-gold/40 mx-auto" />
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Leitura Regente</p>
          </div>
        </div>

        <Button 
          onClick={onNext}
          className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-14 rounded-full uppercase tracking-[0.2em] text-[10px] transition-all group"
        >
          Entrar na Câmara da Escuta
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
