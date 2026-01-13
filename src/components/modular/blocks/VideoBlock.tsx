import { useState } from 'react';
import { ContentBlock, VideoContent } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface VideoBlockProps {
  block: ContentBlock;
}

function getEmbedUrl(url: string, provider?: string): string {
  // YouTube - multiple formats
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s?]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo - multiple formats
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If already an embed URL or custom, return as-is
  return url;
}

function isEmbeddable(url: string): boolean {
  return url.includes('youtube') || 
         url.includes('youtu.be') || 
         url.includes('vimeo') ||
         url.includes('embed');
}

export function VideoBlock({ block }: VideoBlockProps) {
  const content = block.content as VideoContent;
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!content.url) {
    return null;
  }

  const embedUrl = getEmbedUrl(content.url, content.provider);
  const isCustom = content.provider === 'custom' || !isEmbeddable(content.url);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(content.url);
      setCopied(true);
      toast.success('URL copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar');
    }
  };

  const handleOpenExternal = () => {
    window.open(content.url, '_blank', 'noopener,noreferrer');
  };

  // Error fallback UI
  if (hasError) {
    return (
      <div className="animate-fade-in">
        {block.titulo && (
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{block.titulo}</h3>
        )}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border flex flex-col items-center justify-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-4">
            Não foi possível carregar o vídeo
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button variant="outline" size="sm" onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir em nova aba
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyUrl}>
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copiado!' : 'Copiar URL'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{block.titulo}</h3>
      )}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/20 shadow-2xl">
        {isCustom ? (
          <video
            src={content.url}
            controls
            autoPlay={content.autoplay}
            loop={content.loop}
            muted={content.muted}
            poster={content.thumbnail}
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            title={block.titulo || 'Video'}
            frameBorder="0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
      {block.descricao && (
        <p className="mt-3 text-center text-sm text-muted-foreground">{block.descricao}</p>
      )}
    </div>
  );
}
