import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface CloudflareStreamPlayerProps {
  videoId: string;
  title?: string;
  contextType?: string;
  contextId?: string;
  requiredPortal?: string;
  className?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

interface TokenResponse {
  success: boolean;
  embedUrl: string;
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
  onError,
  onLoad,
}: CloudflareStreamPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

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

      if (data.success && data.embedUrl) {
        setEmbedUrl(data.embedUrl);
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

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!expiresAt) return;

    // Refresh 5 minutes before expiration
    const refreshTime = expiresAt.getTime() - Date.now() - 5 * 60 * 1000;
    
    if (refreshTime > 0) {
      const timeout = setTimeout(() => {
        console.log('[CloudflareStreamPlayer] Refreshing token before expiration');
        fetchToken();
      }, refreshTime);

      return () => clearTimeout(timeout);
    }
  }, [expiresAt, fetchToken]);

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

  // Player - Minimal UI, no download, no share, no related videos
  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-black/20 shadow-2xl ${className}`}>
      <iframe
        src={embedUrl || ''}
        title={title || 'Video'}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        // Security: prevent downloading and sharing
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
