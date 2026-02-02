import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoTokenResult {
  success: boolean;
  embedUrl?: string;
  expiresAt?: string;
  error?: string;
  message?: string;
}

interface UseCloudflareVideoOptions {
  contextType?: string;
  contextId?: string;
  requiredPortal?: string;
}

export function useCloudflareVideo(options: UseCloudflareVideoOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideoUrl = useCallback(async (videoId: string): Promise<string | null> => {
    if (!videoId) {
      setError('Video ID is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke<VideoTokenResult>(
        'cloudflare-video-token',
        {
          body: {
            videoId,
            contextType: options.contextType || 'unknown',
            contextId: options.contextId,
            requiredPortal: options.requiredPortal || 'visitante',
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        setError(data.message || data.error);
        return null;
      }

      if (data?.success && data.embedUrl) {
        return data.embedUrl;
      }

      throw new Error('Invalid response');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options.contextType, options.contextId, options.requiredPortal]);

  /**
   * Check if a URL is a Cloudflare Stream video ID
   * Cloudflare video IDs are 32-character alphanumeric strings
   */
  const isCloudflareVideoId = useCallback((url: string): boolean => {
    // Cloudflare Stream video IDs are 32 characters, alphanumeric
    const cfIdPattern = /^[a-f0-9]{32}$/i;
    return cfIdPattern.test(url);
  }, []);

  /**
   * Extract video ID from various URL formats
   */
  const extractVideoId = useCallback((url: string): string | null => {
    if (!url) return null;

    // Already a Cloudflare video ID
    if (isCloudflareVideoId(url)) {
      return url;
    }

    // Cloudflare Stream URL patterns
    const cfPatterns = [
      /cloudflarestream\.com\/([a-f0-9]{32})/i,
      /watch\.cloudflarestream\.com\/([a-f0-9]{32})/i,
      /customer-[^.]+\.cloudflarestream\.com\/([a-f0-9]{32})/i,
    ];

    for (const pattern of cfPatterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }, [isCloudflareVideoId]);

  return {
    getVideoUrl,
    isCloudflareVideoId,
    extractVideoId,
    isLoading,
    error,
  };
}
