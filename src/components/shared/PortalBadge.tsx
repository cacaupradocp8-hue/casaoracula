import React from 'react';
import { PortalType, getPortal } from '@/types/portal';
import { cn } from '@/lib/utils';
import { Crown, Eye, Heart, GraduationCap, Sparkles, Star } from 'lucide-react';

interface PortalBadgeProps {
  portal: PortalType;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const portalIcons: Record<PortalType, typeof Eye> = {
  visitante: Eye,
  mentorada: Heart,
  aluna_formacao: GraduationCap,
  assinante: Sparkles,
  oracula: Star,
  admin: Crown,
};

const portalColors: Record<PortalType, string> = {
  visitante: 'bg-muted text-muted-foreground',
  mentorada: 'bg-burgundy/30 text-burgundy-light',
  aluna_formacao: 'bg-purple-500/20 text-purple-300',
  assinante: 'bg-emerald-500/20 text-emerald-300',
  oracula: 'bg-gold/20 text-gold',
  admin: 'bg-accent text-accent-foreground',
};

export const PortalBadge = React.forwardRef<HTMLDivElement, PortalBadgeProps>(
  ({ portal, size = 'md', showName = false, className }, ref) => {
    const portalData = getPortal(portal);
    const Icon = portalIcons[portal];

    const sizes = {
      sm: 'h-6 px-2 text-xs gap-1',
      md: 'h-8 px-3 text-sm gap-2',
      lg: 'h-10 px-4 text-base gap-2',
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <div 
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium transition-all',
          portalColors[portal],
          sizes[size],
          className
        )}
      >
        <Icon className={iconSizes[size]} />
        <span>{portalData.name}</span>
        {showName && (
          <span className="text-muted-foreground">
            • {portalData.description}
          </span>
        )}
      </div>
    );
  }
);

PortalBadge.displayName = 'PortalBadge';
