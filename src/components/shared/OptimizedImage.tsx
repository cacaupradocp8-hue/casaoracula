import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  containerClassName?: string;
}

/**
 * World-Class Optimized Image Component
 * Features:
 * - Native Lazy Loading
 * - Async Decoding (off-main-thread)
 * - Skeleton support during load
 * - Elegant Error handling
 * - Responsive aspect-ratio preservation
 */
export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fallback,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-muted/20", containerClassName)}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40 text-muted-foreground">
          {fallback || <ImageOff className="w-8 h-8 opacity-20" />}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "transition-opacity duration-500 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
