import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';

interface AulaMediaBlockProps {
  videoUrl: string | null;
  audioUrl: string | null;
  videoId: string | null;
  titulo: string;
  aulaId: string;
  portalMinimo: string;
}

export function AulaMediaBlock({ videoUrl, audioUrl, videoId, titulo, aulaId, portalMinimo }: AulaMediaBlockProps) {
  const hasVideo = !!videoUrl;
  const hasAudio = !!audioUrl;

  if (!hasVideo && !hasAudio) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Video — Cloudflare Stream only */}
      {hasVideo && (
        videoId ? (
          <CloudflareStreamPlayer
            videoId={videoId}
            title={titulo}
            contextType="aula"
            contextId={aulaId}
            requiredPortal={portalMinimo}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-muted/30">
              <div className="text-center p-6">
                <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Vídeo não disponível no Cloudflare Stream
                </p>
              </div>
            </div>
          </Card>
        )
      )}

      {/* Audio — only renders if no video is playing */}
      {hasAudio && (
        <UnifiedAudioPlayer
          audioUrl={audioUrl!}
          title="Áudio da Aula"
          size="lg"
        />
      )}
    </div>
  );
}
