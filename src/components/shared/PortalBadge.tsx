import { PortalType, getPortal } from '@/types/portal';
import { cn } from '@/lib/utils';
import { Crown, Eye, Flame, Star } from 'lucide-react';

interface PortalBadgeProps {
  portal: PortalType;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const portalIcons: Record<PortalType, typeof Eye> = {
  visitante: Eye,
  pre_iniciada: Flame,
  iniciada: Star,
  admin: Crown,
};

const portalColors: Record<PortalType, string> = {
  visitante: 'bg-muted text-muted-foreground',
  pre_iniciada: 'bg-burgundy/30 text-burgundy-light',
  iniciada: 'bg-gold/20 text-gold',
  admin: 'bg-accent text-accent-foreground',
};

export function PortalBadge({ portal, size = 'md', showName = false }: PortalBadgeProps) {
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
    <div className={cn(
      'inline-flex items-center rounded-full font-medium transition-all',
      portalColors[portal],
      sizes[size]
    )}>
      <Icon className={iconSizes[size]} />
      <span>{portalData.name.split('/')[0].trim()}</span>
      {showName && (
        <span className="text-muted-foreground">
          • {portalData.description}
        </span>
      )}
    </div>
  );
}
