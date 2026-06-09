import React from 'react';
import { cn } from '@/lib/utils';
import { Music2 } from 'lucide-react';

interface SpotifyPlaylistEmbedProps {
  url: string | null | undefined;
  className?: string;
  territorio?: string;
}

export function SpotifyPlaylistEmbed({ url, className, territorio }: SpotifyPlaylistEmbedProps) {
  if (!url) return null;

  // Extrair o ID da playlist ou a URL completa formatada para embed
  // Formatos aceitos: 
  // - https://open.spotify.com/playlist/ID
  // - spotify:playlist:ID
  // - ID
  
  let embedUrl = '';
  const playlistIdMatch = url.match(/playlist\/([a-zA-Z0-9]+)/) || url.match(/playlist:([a-zA-Z0-9]+)/);
  const playlistId = playlistIdMatch ? playlistIdMatch[1] : url;

  if (playlistId && playlistId.length > 10) {
    embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  } else {
    return null;
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
      <div className="flex items-center gap-2 text-gold/60 mb-2">
        <Music2 className="w-4 h-4" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
          {territorio ? `Trilha: ${territorio}` : 'Trilha Sonora da Estação'}
        </span>
      </div>
      <div className="relative rounded-[2rem] overflow-hidden bg-[#121212] border border-white/10 shadow-2xl min-h-[152px]">
        <iframe
          style={{ borderRadius: '12px' }}
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="relative z-10"
        ></iframe>
        <div className="absolute inset-0 flex items-center justify-center -z-0">
          <div className="flex flex-col items-center gap-2 opacity-20">
            <Music2 className="w-8 h-8 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Carregando Playlist...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
