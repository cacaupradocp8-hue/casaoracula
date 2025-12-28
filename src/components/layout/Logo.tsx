import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Sacred Geometry Symbol */}
      <div className={cn('relative', sizes[size])}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#goldGradient)"
            strokeWidth="2"
          />
          {/* Inner triangle pointing up */}
          <polygon
            points="50,15 85,75 15,75"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Inner triangle pointing down */}
          <polygon
            points="50,85 85,25 15,25"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#goldGradient)"
          />
          {/* Eye symbol in center */}
          <ellipse
            cx="50"
            cy="50"
            rx="12"
            ry="6"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            fill="none"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45, 70%, 55%)" />
              <stop offset="100%" stopColor="hsl(35, 65%, 45%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-display font-semibold tracking-wide text-gold-gradient leading-none',
            textSizes[size]
          )}>
            Casa ORÁCULA
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Formação Simbólica
            </span>
          )}
        </div>
      )}
    </div>
  );
}
