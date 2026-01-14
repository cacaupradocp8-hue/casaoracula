// ============================================
// MODULAR PAGE RENDERER
// ============================================

import { ContentBlock, BlockContextType } from '@/types/modular';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import {
  RichTextBlock,
  ImageBlock,
  VideoBlock,
  AudioBlock,
  AIChatBlock,
  CTAButtonBlock,
  ProfessionalIntroBlock,
  ChakraWheelBlock,
  EnergySliderBlock,
  PatternDiaryBlock,
  LunarCalendarBlock,
  PendulumMapBlock,
  EgoLayersBlock,
  ArchetypeCardBlock,
  ReflectionPromptBlock,
  PlasticityMapBlock,
} from './blocks';

interface ModularPageRendererProps {
  contextType: BlockContextType;
  contextId: string;
  contextData?: Record<string, unknown>;
  className?: string;
  blockSpacing?: 'sm' | 'md' | 'lg' | 'xl';
  showLoading?: boolean;
  fallback?: React.ReactNode;
  onBlockAction?: (action: string, data?: unknown) => void;
  onSaveRegistro?: (blockId: string, data: unknown) => void;
}

const spacingClasses = {
  sm: 'space-y-4',
  md: 'space-y-8',
  lg: 'space-y-12',
  xl: 'space-y-16',
};

export function ModularPageRenderer({
  contextType,
  contextId,
  contextData,
  className,
  blockSpacing = 'lg',
  showLoading = true,
  fallback,
  onBlockAction,
  onSaveRegistro,
}: ModularPageRendererProps) {
  const { blocks, isLoading, error } = useContentBlocks({
    contextType,
    contextId,
    enabled: !!contextId,
  });

  if (isLoading && showLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Erro ao carregar conteúdo.</p>
      </div>
    );
  }

  if (blocks.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className={cn(spacingClasses[blockSpacing], className)}>
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          contextData={contextData}
          onAction={onBlockAction}
          onSaveRegistro={onSaveRegistro ? (data) => onSaveRegistro(block.id, data) : undefined}
        />
      ))}
    </div>
  );
}

// Internal block renderer
interface BlockRendererProps {
  block: ContentBlock;
  contextData?: Record<string, unknown>;
  onAction?: (action: string, data?: unknown) => void;
  onSaveRegistro?: (data: unknown) => void;
}

function BlockRenderer({ block, contextData, onAction, onSaveRegistro }: BlockRendererProps) {
  switch (block.blockType) {
    case 'rich_text':
      return <RichTextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'audio':
      return <AudioBlock block={block} />;
    case 'ai_chat':
      return <AIChatBlock block={block} contextData={contextData} />;
    case 'cta_button':
      return <CTAButtonBlock block={block} onAction={onAction} />;
    case 'professional_intro':
      return <ProfessionalIntroBlock block={block} />;
    // New interactive blocks
    case 'chakra_wheel':
      return <ChakraWheelBlock block={block} onSave={onSaveRegistro} />;
    case 'energy_slider':
      return <EnergySliderBlock block={block} onSave={onSaveRegistro} />;
    case 'pattern_diary':
      return <PatternDiaryBlock block={block} onSave={onSaveRegistro} />;
    case 'lunar_calendar':
      return <LunarCalendarBlock block={block} onSave={onSaveRegistro} />;
    case 'pendulum_map':
      return <PendulumMapBlock block={block} onSave={onSaveRegistro} />;
    case 'ego_layers':
      return <EgoLayersBlock block={block} onSave={onSaveRegistro} />;
    case 'archetype_card':
      return <ArchetypeCardBlock block={block} />;
    case 'reflection_prompt':
      return <ReflectionPromptBlock block={block} onSave={onSaveRegistro} />;
    case 'plasticity_map':
      return <PlasticityMapBlock block={block} onSave={onSaveRegistro} />;
    default:
      console.warn(`Unknown block type: ${block.blockType}`);
      return null;
  }
}

export { BlockRenderer };
