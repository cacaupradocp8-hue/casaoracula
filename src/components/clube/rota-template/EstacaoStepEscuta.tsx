import React, { useState } from 'react';
import { Headphones, Sparkles, BookOpen, Music } from 'lucide-react';
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
}

export const EstacaoStepEscuta: React.FC<EstacaoStepEscutaProps> = ({
  obraRegente,
  livroCapaUrl,
  audioVozClareiraUrl,
  audioAberturaUrl,
  audioFlorestaUrl,
  spotifyPlaylistUrl,
  spotifyPlaylists,
  vozClareiraTexto
}) => {
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);

  const playlists = spotifyPlaylists && spotifyPlaylists.length > 0 
    ? spotifyPlaylists 
    : (spotifyPlaylistUrl ? [{ url: spotifyPlaylistUrl, label: 'Playlist Principal' }] : []);

  return (
    <div className="space-y-10 text-center max-w-2xl mx-auto pb-20">
      <RotaLivroBanner 
        obraRegente={obraRegente}
        capaUrl={livroCapaUrl}
        fraseObra="Onde a voz silenciada volta a encontrar o corpo."
        onAction={() => {}}
      />

      <div className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Headphones className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Voz da Clareira</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white italic">A Voz da Floresta</h2>
          
          {vozClareiraTexto && (
            <div className="max-w-lg mx-auto p-6 rounded-3xl bg-gold/5 border border-gold/10">
              <p className="text-sm font-serif italic text-white/70 leading-relaxed whitespace-pre-line">
                {vozClareiraTexto}
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-10">
          {audioAberturaUrl && (
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Abertura Imersiva</span>
              <EscutaPremium audioUrl={audioAberturaUrl} titulo="Abertura da Estação" />
            </div>
          )}

          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Voz da Clareira</span>
            <EscutaPremium audioUrl={audioVozClareiraUrl} />
          </div>

          {audioFlorestaUrl && (
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Sons da Floresta</span>
              <EscutaPremium audioUrl={audioFlorestaUrl} titulo="Voz da Floresta" />
            </div>
          )}
        </div>
        
        {playlists.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-white/10">
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

      <div className="grid grid-cols-2 gap-4 pt-8">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <Sparkles className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Série de Áudios</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <BookOpen className="w-5 h-5 text-gold/40 mx-auto" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Leitura Regente</p>
        </div>
      </div>
    </div>
  );
};
