import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo-casa-oracula.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export function Logo({ className, size = 'md', iconOnly = false }: LogoProps) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  };

  const logoSizes = {
    sm: 'h-14',
    md: 'h-20',
    lg: 'h-36',
  };

  if (iconOnly) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <svg
          viewBox="0 0 100 100"
          className={cn(sizes[size])}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House roof */}
          <path
            d="M50 10 L90 45 L90 90 L10 90 L10 45 Z"
            stroke="url(#goldGradientIcon)"
            strokeWidth="3"
            fill="none"
          />
          {/* Roof peak accent */}
          <path
            d="M50 10 L90 45"
            stroke="url(#goldGradientIcon)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M50 10 L10 45"
            stroke="url(#goldGradientIcon)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Door */}
          <rect
            x="38"
            y="55"
            width="24"
            height="35"
            rx="2"
            stroke="url(#goldGradientIcon)"
            strokeWidth="2"
            fill="none"
          />
          {/* Window left */}
          <rect
            x="18"
            y="52"
            width="14"
            height="14"
            rx="1"
            stroke="url(#goldGradientIcon)"
            strokeWidth="2"
            fill="none"
          />
          {/* Window right */}
          <rect
            x="68"
            y="52"
            width="14"
            height="14"
            rx="1"
            stroke="url(#goldGradientIcon)"
            strokeWidth="2"
            fill="none"
          />
          {/* Eye symbol in door */}
          <ellipse
            cx="50"
            cy="70"
            rx="8"
            ry="4"
            stroke="url(#goldGradientIcon)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="70"
            r="2"
            fill="url(#goldGradientIcon)"
          />
          <defs>
            <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45, 90%, 55%)" />
              <stop offset="50%" stopColor="hsl(40, 85%, 50%)" />
              <stop offset="100%" stopColor="hsl(35, 80%, 45%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img
        src={logoImage}
        alt="Casa ORÁCULA"
        className={cn('w-auto object-contain', logoSizes[size])}
      />
    </div>
  );
}
