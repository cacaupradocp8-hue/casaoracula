import { ContentBlock, VideoContent } from '@/types/modular';
import { cn } from '@/lib/utils';

interface VideoBlockProps {
  block: ContentBlock;
}

function getEmbedUrl(url: string, provider?: string): string {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If already an embed URL or custom, return as-is
  return url;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const content = block.content as VideoContent;
  
  if (!content.url) {
    return null;
  }

  const embedUrl = getEmbedUrl(content.url, content.provider);
  const isCustom = content.provider === 'custom' || 
    (!content.url.includes('youtube') && !content.url.includes('vimeo') && !content.url.includes('embed'));

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
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            title={block.titulo || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
