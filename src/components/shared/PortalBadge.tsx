import { PortalLevel, getPortal } from '@/types/portal';
import { cn } from '@/lib/utils';
import { Crown, Eye, Flame, Star } from 'lucide-react';

interface PortalBadgeProps {
  level: PortalLevel;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const portalIcons = {
  1: Eye,
  2: Flame,
  3: Star,
  4: Crown,
};

const portalColors = {
  1: 'bg-muted text-muted-foreground',
  2: 'bg-burgundy/30 text-burgundy-light',
  3: 'bg-gold/20 text-gold',
  4: 'bg-accent text-accent-foreground',
};

export function PortalBadge({ level, size = 'md', showName = false }: PortalBadgeProps) {
  const portal = getPortal(level);
  const Icon = portalIcons[level];

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
      portalColors[level],
      sizes[size]
    )}>
      <Icon className={iconSizes[size]} />
      <span>Portal {level}</span>
      {showName && (
        <span className="text-muted-foreground">
          • {portal.name.split('/')[0].trim()}
        </span>
      )}
    </div>
  );
}
