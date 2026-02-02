import { useState, useMemo } from 'react';
import { ContentBlock, VideoContent } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, RefreshCw } from 'lucide-react';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';

interface VideoBlockProps {
  block: ContentBlock;
}

/**
 * VideoBlock - Cloudflare Stream exclusive video player
 * 
 * Security features:
 * - Videos are private by default
 * - Signed tokens with expiration
 * - User-specific access based on portal level
 * - Playback logging for security auditing
 * - No download, share, or related videos
 */
export function VideoBlock({ block }: VideoBlockProps) {
  const content = block.content as VideoContent;
  const [hasError, setHasError] = useState(false);
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();
  
  if (!content.url) {
    return null;
  }

  // Extract Cloudflare video ID from URL or use directly if it's already an ID
  const videoId = useMemo(() => {
    // First check if we have a cloudflare_video_id in the block
    if ((block as any).cloudflare_video_id) {
      return (block as any).cloudflare_video_id;
    }
    
    // Check if the URL is a Cloudflare video ID
    if (isCloudflareVideoId(content.url)) {
      return content.url;
    }
    
    // Try to extract from URL
    return extractVideoId(content.url);
  }, [content.url, block, extractVideoId, isCloudflareVideoId]);

  // If we can't get a Cloudflare video ID, show unsupported message
  // This enforces Cloudflare Stream as the exclusive video provider
  if (!videoId) {
    return (
      <div className="animate-fade-in">
        {block.titulo && (
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            {block.titulo}
          </h3>
        )}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border flex flex-col items-center justify-center p-6">
          <Lock className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-2">
            Formato de vídeo não suportado
          </p>
          <p className="text-xs text-muted-foreground/60 text-center">
            Este vídeo precisa ser hospedado no Cloudflare Stream.
          </p>
        </div>
      </div>
    );
  }

  // Error fallback UI
  if (hasError) {
    return (
      <div className="animate-fade-in">
        {block.titulo && (
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            {block.titulo}
          </h3>
        )}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border flex flex-col items-center justify-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-4">
            Não foi possível carregar o vídeo
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setHasError(false)}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
          {block.titulo}
        </h3>
      )}
      
      <CloudflareStreamPlayer
        videoId={videoId}
        title={block.titulo || 'Video'}
        contextType="content_block"
        contextId={block.id}
        requiredPortal={block.portalMinimo}
        onError={(error) => {
          console.error('[VideoBlock] Player error:', error);
          setHasError(true);
        }}
      />
      
      {block.descricao && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {block.descricao}
        </p>
      )}
    </div>
  );
}
