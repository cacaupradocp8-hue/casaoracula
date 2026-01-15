// ============================================
// SPIRAL OF TRAVERSAL
// Elements following a symbolic spiral path
// ============================================

import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight } from 'lucide-react';
import {
  SymbolicVisualizationProps,
  SIZE_MAP,
  COLOR_SCHEMES,
  INTENSITY_OPACITY,
} from './types';

export function SpiralVisualization({
  elements,
  config,
  selectedElement,
  onElementSelect,
  className,
}: SymbolicVisualizationProps) {
  const size = SIZE_MAP[config.size || 'md'];
  const colors = config.customColors?.length
    ? config.customColors
    : COLOR_SCHEMES[config.colorScheme || 'gold'];

  // Generate spiral path points
  const getSpiralPosition = (index: number, total: number) => {
    const maxRotations = 2;
    const progress = index / (total - 1 || 1);
    const angle = progress * maxRotations * 2 * Math.PI - Math.PI / 2;
    const minRadius = 30;
    const maxRadius = size.container / 2 - size.element / 2 - 10;
    const radius = minRadius + (maxRadius - minRadius) * progress;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return { x, y, angle, radius };
  };

  // Generate SVG spiral path
  const generateSpiralPath = () => {
    const points: string[] = [];
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const angle = progress * 2 * 2 * Math.PI - Math.PI / 2;
      const minRadius = 30;
      const maxRadius = size.container / 2 - 20;
      const radius = minRadius + (maxRadius - minRadius) * progress;
      
      const x = Math.cos(angle) * radius + size.container / 2;
      const y = Math.sin(angle) * radius + size.container / 2;
      
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size.container, height: size.container }}
    >
      {/* Spiral path */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${size.container} ${size.container}`}
      >
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d={generateSpiralPath()}
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn(config.animated && 'animate-pulse')}
          style={{ animationDuration: '4s' }}
        />
      </svg>

      {/* Center - Origin point */}
      <div
        className={cn(
          'absolute z-10 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-gold/30 to-gold/10',
          'border border-gold/50',
          config.glowEffect && 'shadow-lg shadow-gold/40'
        )}
        style={{ width: size.element * 1.2, height: size.element * 1.2 }}
      >
        <Sparkles className="w-5 h-5 text-gold" />
      </div>

      {/* Elements along spiral */}
      {elements.map((element, index) => {
        const { x, y } = getSpiralPosition(index, elements.length);
        const color = element.color || colors[index % colors.length];
        const isSelected = selectedElement === element.id;
        const opacity = INTENSITY_OPACITY[element.intensity || 'medium'];
        const isFirst = index === 0;
        const isLast = index === elements.length - 1;

        return (
          <div
            key={element.id}
            className="absolute transition-all duration-300"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <button
              onClick={() => onElementSelect?.(element)}
              disabled={!config.interactive}
              className={cn(
                'rounded-full transition-all duration-300',
                'flex items-center justify-center relative',
                config.interactive && 'hover:scale-110 cursor-pointer',
                isSelected && 'ring-2 ring-gold scale-125 z-20',
                !config.interactive && 'cursor-default',
                isLast && 'ring-1 ring-gold/50'
              )}
              style={{
                width: size.element * (isFirst ? 0.7 : isLast ? 1.1 : 0.9),
                height: size.element * (isFirst ? 0.7 : isLast ? 1.1 : 0.9),
                backgroundColor: color,
                opacity,
                boxShadow: config.glowEffect
                  ? `0 0 ${isSelected ? 25 : isLast ? 20 : 12}px ${color}50`
                  : undefined,
              }}
              title={element.label}
            >
              {isLast && <ArrowRight className="w-4 h-4 text-background/80" />}
            </button>

            {/* Label */}
            {config.showLabels && (
              <span
                className={cn(
                  'absolute left-full ml-2 text-[10px] font-medium whitespace-nowrap',
                  'transform -translate-y-1/2 top-1/2 max-w-[70px] truncate'
                )}
                style={{ color }}
              >
                {element.label}
              </span>
            )}
          </div>
        );
      })}

      {/* Labels */}
      {config.centerLabel && (
        <span className="absolute top-full mt-4 text-xs text-muted-foreground text-center">
          {config.centerLabel}
        </span>
      )}
    </div>
  );
}
