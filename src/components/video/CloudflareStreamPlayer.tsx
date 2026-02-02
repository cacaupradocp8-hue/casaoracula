import { useState, useEffect, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Hls from 'hls.js';

interface CloudflareStreamPlayerProps {
  videoId: string;
  title?: string;
  contextType?: string;
  contextId?: string;
  requiredPortal?: string;
  className?: string;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

interface TokenResponse {
  success: boolean;
  manifestUrl: string;
  expiresAt: string;
  videoId: string;
  error?: string;
  message?: string;
  requiredPortal?: string;
  userPortal?: string;
}

export function CloudflareStreamPlayer({
  videoId,
  title,
  contextType = 'unknown',
  contextId,
  requiredPortal = 'visitante',
  className = '',
  autoPlay = false,
  onError,
  onLoad,
}: CloudflareStreamPlayerProps) {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const fetchToken = useCallback(async () => {
    if (!videoId) {
      setError('ID do vídeo não fornecido');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAccessDenied(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke<TokenResponse>(
        'cloudflare-video-token',
        {
          body: {
            videoId,
            contextType,
            contextId,
            requiredPortal,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message || 'Erro ao carregar vídeo');
      }

      if (!data) {
        throw new Error('Resposta inválida do servidor');
      }

      if (data.error) {
        if (data.error === 'Access denied') {
          setAccessDenied(true);
          setError(data.message || 'Acesso negado');
        } else {
          throw new Error(data.message || data.error);
        }
        return;
      }

      if (data.success && data.manifestUrl) {
        setManifestUrl(data.manifestUrl);
        setExpiresAt(new Date(data.expiresAt));
        onLoad?.();
      } else {
        throw new Error('URL do vídeo não recebida');
      }
    } catch (err) {
      console.error('[CloudflareStreamPlayer] Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [videoId, contextType, contextId, requiredPortal, onError, onLoad]);

  // Fetch token on mount and when videoId changes
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Initialize HLS player when manifestUrl is available
  useEffect(() => {
    if (!manifestUrl || !videoRef.current) return;

    const video = videoRef.current;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        // Security: prevent manifest caching
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });

      hls.loadSource(manifestUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[CloudflareStreamPlayer] Manifest loaded');
        if (autoPlay) {
          video.play().catch(e => {
            console.log('[CloudflareStreamPlayer] Autoplay blocked:', e);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[CloudflareStreamPlayer] HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log('[CloudflareStreamPlayer] Network error, attempting recovery...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('[CloudflareStreamPlayer] Media error, attempting recovery...');
              hls.recoverMediaError();
              break;
            default:
              setError('Erro ao reproduzir vídeo');
              onError?.('Fatal HLS error');
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = manifestUrl;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) {
          video.play().catch(e => {
            console.log('[CloudflareStreamPlayer] Autoplay blocked:', e);
          });
        }
      });
    } else {
      setError('Seu navegador não suporta reprodução de vídeo HLS');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [manifestUrl, autoPlay, onError]);

  // Auto-refresh token before expiration (30 min before)
  useEffect(() => {
    if (!expiresAt) return;

    // Refresh 30 minutes before expiration
    const refreshTime = expiresAt.getTime() - Date.now() - 30 * 60 * 1000;
    
    if (refreshTime > 0) {
      const timeout = setTimeout(() => {
        console.log('[CloudflareStreamPlayer] Refreshing token before expiration');
        fetchToken();
      }, refreshTime);

      return () => clearTimeout(timeout);
    }
  }, [expiresAt, fetchToken]);

  // Prevent right-click context menu on video
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative aspect-video ${className}`}>
        <Skeleton className="w-full h-full rounded-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">
            Carregando vídeo...
          </div>
        </div>
      </div>
    );
  }

  // Access denied state
  if (accessDenied) {
    return (
      <div className={`relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border flex flex-col items-center justify-center p-6 ${className}`}>
        <Lock className="w-12 h-12 text-gold/60 mb-4" />
        <p className="text-foreground font-medium text-center mb-2">
          Conteúdo Restrito
        </p>
        <p className="text-muted-foreground text-sm text-center max-w-sm">
          {error || 'Você não tem acesso a este vídeo.'}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`relative aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border flex flex-col items-center justify-center p-6 ${className}`}>
        <AlertCircle className="w-12 h-12 text-destructive/60 mb-4" />
        <p className="text-muted-foreground text-center mb-4">
          Não foi possível carregar o vídeo
        </p>
        <Button variant="outline" size="sm" onClick={fetchToken} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // HLS Player with security measures
  return (
    <div 
      className={`relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ${className}`}
      onContextMenu={handleContextMenu}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        playsInline
        title={title || 'Video'}
        // Security: prevent easy downloading
        onContextMenu={handleContextMenu}
      >
        Seu navegador não suporta a reprodução de vídeo.
      </video>
    </div>
  );
}
