// ============================================
// MANDALA VISUALIZATION
// Concentric circles with symbolic elements
// ============================================

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import {
  SymbolicVisualizationProps,
  SIZE_MAP,
  COLOR_SCHEMES,
  INTENSITY_OPACITY,
} from './types';

export function MandalaVisualization({
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

  // Calculate ring positions
  const totalRings = Math.ceil(elements.length / 6) + 1;
  const ringSpacing = (size.container / 2 - 30) / totalRings;

  // Distribute elements across rings
  const getRingAndPosition = (index: number) => {
    const ring = Math.floor(index / 6) + 1;
    const positionInRing = index % 6;
    const elementsInThisRing = Math.min(6, elements.length - (ring - 1) * 6);
    const angle = (360 / elementsInThisRing) * positionInRing - 90;
    const radius = ring * ringSpacing;
    
    return { ring, angle, radius };
  };

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size.container, height: size.container }}
    >
      {/* Background rings */}
      {Array.from({ length: totalRings }).map((_, i) => (
        <div
          key={`ring-${i}`}
          className={cn(
            'absolute rounded-full border border-gold/10',
            config.animated && 'animate-pulse'
          )}
          style={{
            width: (i + 1) * ringSpacing * 2,
            height: (i + 1) * ringSpacing * 2,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '4s',
          }}
        />
      ))}

      {/* Center element */}
      <div
        className={cn(
          'absolute z-10 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-gold/20 to-gold/5',
          'border border-gold/30',
          config.glowEffect && 'shadow-lg shadow-gold/20'
        )}
        style={{ width: size.element * 1.5, height: size.element * 1.5 }}
      >
        <Sparkles className="w-6 h-6 text-gold" />
        {config.centerLabel && (
          <span className="absolute -bottom-6 text-xs text-muted-foreground whitespace-nowrap">
            {config.centerLabel}
          </span>
        )}
      </div>

      {/* Symbolic elements */}
      {elements.map((element, index) => {
        const { angle, radius } = getRingAndPosition(index);
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        const color = element.color || colors[index % colors.length];
        const isSelected = selectedElement === element.id;
        const opacity = INTENSITY_OPACITY[element.intensity || 'medium'];

        return (
          <button
            key={element.id}
            onClick={() => onElementSelect?.(element)}
            disabled={!config.interactive}
            className={cn(
              'absolute rounded-full transition-all duration-300',
              'flex items-center justify-center',
              config.interactive && 'hover:scale-110 cursor-pointer',
              isSelected && 'ring-2 ring-gold scale-110 z-20',
              !config.interactive && 'cursor-default'
            )}
            style={{
              left: `calc(50% + ${x}px - ${size.element / 2}px)`,
              top: `calc(50% + ${y}px - ${size.element / 2}px)`,
              width: size.element,
              height: size.element,
              backgroundColor: color,
              opacity,
              boxShadow: config.glowEffect
                ? `0 0 ${isSelected ? 20 : 10}px ${color}40`
                : undefined,
            }}
            title={element.label}
          >
            {config.showLabels && (
              <span
                className="absolute -bottom-5 text-[10px] text-center whitespace-nowrap max-w-[60px] truncate"
                style={{ color }}
              >
                {element.label}
              </span>
            )}
          </button>
        );
      })}

      {/* Outer glow */}
      {config.glowEffect && (
        <div
          className="absolute rounded-full bg-gradient-to-br from-gold/5 to-transparent pointer-events-none"
          style={{
            width: size.container,
            height: size.container,
            filter: 'blur(20px)',
          }}
        />
      )}
    </div>
  );
}
