// ============================================
// RADIAL SYMBOLIC CHART
// Elements distributed around a center point
// ============================================

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import {
  SymbolicVisualizationProps,
  SIZE_MAP,
  COLOR_SCHEMES,
  INTENSITY_OPACITY,
} from './types';

export function RadialVisualization({
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
  const radius = size.container / 2 - size.element;

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size.container, height: size.container }}
    >
      {/* Connection lines from center to elements */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${size.container} ${size.container}`}
      >
        {elements.map((element, index) => {
          const angle = (360 / elements.length) * index - 90;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * radius + size.container / 2;
          const y = Math.sin(radians) * radius + size.container / 2;
          const color = element.color || colors[index % colors.length];
          const isSelected = selectedElement === element.id;

          return (
            <line
              key={`line-${element.id}`}
              x1={size.container / 2}
              y1={size.container / 2}
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth={isSelected ? 2 : 1}
              strokeOpacity={isSelected ? 0.6 : 0.2}
              strokeDasharray={isSelected ? undefined : '4 4'}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Background circle */}
      <div
        className={cn(
          'absolute rounded-full border border-gold/20',
          config.animated && 'animate-pulse'
        )}
        style={{
          width: radius * 2 + size.element,
          height: radius * 2 + size.element,
          animationDuration: '4s',
        }}
      />

      {/* Center element */}
      <div
        className={cn(
          'absolute z-10 rounded-full flex flex-col items-center justify-center',
          'bg-gradient-to-br from-background to-background/80',
          'border-2 border-gold/40',
          config.glowEffect && 'shadow-lg shadow-gold/30'
        )}
        style={{ width: size.element * 2, height: size.element * 2 }}
      >
        <Sparkles className="w-6 h-6 text-gold mb-1" />
        {config.centerLabel && (
          <span className="text-[9px] text-muted-foreground text-center px-1 leading-tight">
            {config.centerLabel}
          </span>
        )}
      </div>

      {/* Symbolic elements */}
      {elements.map((element, index) => {
        const angle = (360 / elements.length) * index - 90;
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        const color = element.color || colors[index % colors.length];
        const isSelected = selectedElement === element.id;
        const opacity = INTENSITY_OPACITY[element.intensity || 'medium'];

        // Position label based on angle
        const labelPosition = angle > -90 && angle < 90 ? 'right' : 'left';
        const labelTop = angle > 0 && angle < 180 ? 'below' : 'above';

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
                'flex items-center justify-center',
                'border-2',
                config.interactive && 'hover:scale-110 cursor-pointer',
                isSelected && 'ring-2 ring-gold scale-125 z-20',
                !config.interactive && 'cursor-default'
              )}
              style={{
                width: size.element,
                height: size.element,
                backgroundColor: `${color}30`,
                borderColor: color,
                opacity,
                boxShadow: config.glowEffect
                  ? `0 0 ${isSelected ? 25 : 15}px ${color}50`
                  : undefined,
              }}
              title={element.label}
            >
              {element.intensity === 'dominant' && (
                <Sparkles className="w-4 h-4" style={{ color }} />
              )}
            </button>

            {/* Label */}
            {config.showLabels && (
              <span
                className={cn(
                  'absolute text-[10px] font-medium whitespace-nowrap max-w-[80px] truncate',
                  labelPosition === 'right' ? 'left-full ml-2' : 'right-full mr-2',
                  labelTop === 'below' ? 'top-1/2' : 'top-1/2',
                  'transform -translate-y-1/2'
                )}
                style={{ color }}
              >
                {element.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
