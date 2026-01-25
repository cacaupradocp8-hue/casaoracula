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
  aluna: GraduationCap,
  oracula: Star,
  assinante: Sparkles,
  admin: Crown,
  mentorada: GraduationCap,
  aluna_formacao: GraduationCap,
  pre_iniciada: GraduationCap,
  iniciada: Star,
};

const portalColors: Record<PortalType, string> = {
  visitante: 'bg-muted text-muted-foreground',
  aluna: 'bg-purple-500/20 text-purple-300',
  oracula: 'bg-gold/20 text-gold',
  assinante: 'bg-emerald-500/20 text-emerald-300',
  admin: 'bg-accent text-accent-foreground',
  mentorada: 'bg-purple-500/20 text-purple-300',
  aluna_formacao: 'bg-purple-500/20 text-purple-300',
  pre_iniciada: 'bg-purple-500/20 text-purple-300',
  iniciada: 'bg-gold/20 text-gold',
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
