// ============================================
// SYMBOLIC VISUALIZATION BLOCK
// Modular block for embedding visualizations
// ============================================

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  SymbolicVisualization,
  SymbolicElement,
  VisualizationType,
} from '@/components/visualization';

interface SymbolicVisualizationContent {
  title?: string;
  description?: string;
  visualizationType: VisualizationType;
  centerLabel?: string;
  showLabels?: boolean;
  showDescriptions?: boolean;
  animated?: boolean;
  interactive?: boolean;
  glowEffect?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme?: 'gold' | 'purple' | 'mystical' | 'earth' | 'custom';
  customColors?: string[];
  elements: Array<{
    id: string;
    label: string;
    description?: string;
    color?: string;
    intensity?: 'low' | 'medium' | 'high' | 'dominant';
  }>;
}

interface SymbolicVisualizationBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

export function SymbolicVisualizationBlock({
  block,
  onSave,
}: SymbolicVisualizationBlockProps) {
  const content = block.content as SymbolicVisualizationContent;
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const elements: SymbolicElement[] = content.elements || [];

  const handleElementSelect = (element: SymbolicElement) => {
    setSelectedElement(element.id === selectedElement ? null : element.id);
    onSave?.({ selectedElement: element.id, timestamp: new Date().toISOString() });
  };

  return (
    <Card className="border-gold/20 bg-card/50">
      {(content.title || content.description) && (
        <CardHeader className="text-center">
          {content.title && (
            <CardTitle className="font-display text-gold">
              {content.title}
            </CardTitle>
          )}
          {content.description && (
            <CardDescription>{content.description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="flex justify-center py-8">
        <SymbolicVisualization
          elements={elements}
          config={{
            type: content.visualizationType || 'radial',
            centerLabel: content.centerLabel,
            showLabels: content.showLabels ?? true,
            showDescriptions: content.showDescriptions ?? true,
            animated: content.animated ?? false,
            interactive: content.interactive ?? true,
            glowEffect: content.glowEffect ?? true,
            size: content.size || 'lg',
            colorScheme: content.colorScheme || 'gold',
            customColors: content.customColors,
          }}
          selectedElement={selectedElement}
          onElementSelect={handleElementSelect}
        />
      </CardContent>
    </Card>
  );
}
