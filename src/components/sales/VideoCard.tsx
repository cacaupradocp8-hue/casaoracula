import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  title: string;
  videoUrl: string;
  microcopy?: string;
  className?: string;
}

/**
 * VideoCard — Componente minimalista para vídeo-cards na página de vendas
 * Estilo: editorial, ritual, institucional
 * Sem ícones decorativos, bordas chamativas ou elementos visuais excessivos
 */
export function VideoCard({ title, videoUrl, microcopy, className = '' }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detecta se é YouTube, Vimeo ou embed direto
  const getEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s?]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?enablejsapi=1&rel=0&modestbranding=1`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbeddable = videoUrl.includes('youtube') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo') || videoUrl.includes('embed');

  const handleOpenExternal = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  if (hasError) {
    return (
      <section className={`py-16 px-6 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative aspect-video bg-card/5 rounded-lg border border-border/20 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm mb-4">Não foi possível carregar o vídeo</p>
            <Button variant="ghost" size="sm" onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir em nova aba
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  // Placeholder state (before play)
  if (!isPlaying) {
    return (
      <section className={`py-16 px-6 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Title */}
          <p className="text-gold/60 uppercase tracking-[0.2em] text-xs mb-6 text-center">
            {title}
          </p>
          
          {/* Video Container with Play Button */}
          <div 
            className="relative aspect-video bg-[hsl(220,20%,6%)] rounded-lg border border-border/10 cursor-pointer group overflow-hidden"
            onClick={() => setIsPlaying(true)}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            
            {/* Play button - centered, minimal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center transition-all duration-300 group-hover:border-gold/60 group-hover:scale-105 bg-black/30 backdrop-blur-sm">
                <Play className="w-6 h-6 text-gold/70 group-hover:text-gold ml-1" />
              </div>
            </div>
            
            {/* Optional: subtle text prompt */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-foreground/30 text-xs uppercase tracking-wider">
                Assistir
              </span>
            </div>
          </div>
          
          {/* Microcopy below video */}
          {microcopy && (
            <p className="text-foreground/35 text-center text-xs italic mt-6 leading-relaxed">
              {microcopy}
            </p>
          )}
        </motion.div>
      </section>
    );
  }

  // Playing state
  return (
    <section className={`py-16 px-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        {/* Title */}
        <p className="text-gold/60 uppercase tracking-[0.2em] text-xs mb-6 text-center">
          {title}
        </p>
        
        {/* Video iframe */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {isEmbeddable ? (
            <iframe
              ref={iframeRef}
              src={`${embedUrl}&autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setHasError(true)}
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              onError={() => setHasError(true)}
              className="w-full h-full object-contain"
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          )}
        </div>
        
        {/* Close/Pause control */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsPlaying(false)}
            className="text-foreground/30 hover:text-foreground/50 text-xs uppercase tracking-wider transition-colors"
          >
            Fechar vídeo
          </button>
        </div>
      </motion.div>
    </section>
  );
}
