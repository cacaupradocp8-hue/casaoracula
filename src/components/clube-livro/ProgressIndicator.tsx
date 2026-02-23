import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/hooks/useProgress';

interface ProgressIndicatorProps {
  status: keyof typeof STATUS_CONFIG;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressIndicator({ status, size = 'sm', showLabel = true }: ProgressIndicatorProps) {
  const config = STATUS_CONFIG[status];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <span className={cn('inline-flex items-center gap-1.5', config.className)}>
      <span className={cn(iconSize, 'leading-none select-none')}>{config.icon}</span>
      {showLabel && <span className={textSize}>{config.label}</span>}
    </span>
  );
}
