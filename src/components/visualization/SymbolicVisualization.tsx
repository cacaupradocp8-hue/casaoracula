// ============================================
// SYMBOLIC VISUALIZATION - MAIN COMPONENT
// Unified entry point for all visualization types
// ============================================

import { cn } from '@/lib/utils';
import { SymbolicVisualizationProps } from './types';
import { MandalaVisualization } from './MandalaVisualization';
import { RadialVisualization } from './RadialVisualization';
import { SpiralVisualization } from './SpiralVisualization';

export function SymbolicVisualization(props: SymbolicVisualizationProps) {
  const { config, className } = props;

  const renderVisualization = () => {
    switch (config.type) {
      case 'mandala':
        return <MandalaVisualization {...props} />;
      case 'radial':
        return <RadialVisualization {...props} />;
      case 'spiral':
        return <SpiralVisualization {...props} />;
      default:
        return <RadialVisualization {...props} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Title */}
      {config.title && (
        <h3 className="font-display text-lg text-gold mb-1">{config.title}</h3>
      )}
      {config.subtitle && (
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          {config.subtitle}
        </p>
      )}

      {/* Visualization */}
      <div className="relative">
        {renderVisualization()}
      </div>

      {/* Selected element description */}
      {props.selectedElement && config.showDescriptions && (
        <div className="mt-6 p-4 rounded-lg bg-card/50 border border-gold/20 max-w-sm text-center">
          {props.elements.find((e) => e.id === props.selectedElement)
            ?.description && (
            <p className="text-sm text-muted-foreground italic">
              {
                props.elements.find((e) => e.id === props.selectedElement)
                  ?.description
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Re-export types and components
export * from './types';
export { MandalaVisualization } from './MandalaVisualization';
export { RadialVisualization } from './RadialVisualization';
export { SpiralVisualization } from './SpiralVisualization';
