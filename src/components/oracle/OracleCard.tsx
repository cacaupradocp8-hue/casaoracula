import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OracleCardProps {
  frontImage?: string | null;
  backImage?: string | null;
  title: string;
  isRevealed: boolean;
  primaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showGlow?: boolean;
}

export function OracleCard({
  frontImage,
  backImage,
  title,
  isRevealed,
  primaryColor = 'hsl(var(--gold))',
  size = 'md',
  onClick,
  className,
  showGlow = false,
}: OracleCardProps) {
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    if (isRevealed && !hasFlipped) {
      setHasFlipped(true);
    }
  }, [isRevealed, hasFlipped]);

  const sizeClasses = {
    sm: 'w-20 md:w-24',
    md: 'w-28 md:w-36',
    lg: 'w-36 md:w-44',
  };

  return (
    <div
      className={cn(
        'perspective-1000 cursor-pointer transition-transform duration-300 hover:scale-105',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative aspect-[2/3] transform-style-3d transition-transform duration-700 ease-out',
          isRevealed ? 'rotate-y-0' : 'rotate-y-180',
          showGlow && isRevealed && 'animate-card-glow'
        )}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Face (Card Image) */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-xl overflow-hidden',
            'ring-1 ring-white/10'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontImage ? (
            <img
              src={frontImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Sparkles className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
          )}
        </div>

        {/* Back Face (Card Back Design) */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-xl overflow-hidden rotate-y-180',
            'ring-1 ring-white/10',
            'flex items-center justify-center'
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {backImage ? (
            <img
              src={backImage}
              alt="Card back"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}40 0%, ${primaryColor}10 50%, ${primaryColor}30 100%)`,
              }}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-2 border border-white/10 rounded-lg" />
              <div className="absolute inset-4 border border-white/5 rounded-md" />
              <Sparkles
                className="w-10 h-10 animate-breathe"
                style={{ color: `${primaryColor}80` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
