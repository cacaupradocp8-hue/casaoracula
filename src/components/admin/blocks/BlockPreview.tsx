import { ContentBlock, ContentBlockType, BLOCK_TYPE_META } from '@/types/modular';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Bot, 
  MousePointerClick,
  Circle,
  Gauge,
  BookOpen,
  Moon,
  Target,
  Layers,
  Sparkles,
  MessageSquare,
  Brain,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockPreviewProps {
  block: ContentBlock;
  compact?: boolean;
}

const typeIcons: Record<ContentBlockType, React.ElementType> = {
  rich_text: FileText,
  image: Image,
  video: Video,
  audio: Music,
  ai_chat: Bot,
  cta_button: MousePointerClick,
  professional_intro: Briefcase,
  chakra_wheel: Circle,
  energy_slider: Gauge,
  pattern_diary: BookOpen,
  lunar_calendar: Moon,
  pendulum_map: Target,
  ego_layers: Layers,
  archetype_card: Sparkles,
  reflection_prompt: MessageSquare,
  plasticity_map: Brain,
};

const typeLabels: Record<ContentBlockType, string> = {
  rich_text: 'Texto Rico',
  image: 'Imagem',
  video: 'Vídeo',
  audio: 'Áudio',
  ai_chat: 'Chat IA',
  cta_button: 'Botão CTA',
  professional_intro: 'Introdução Profissional',
  chakra_wheel: 'Roda de Chakras',
  energy_slider: 'Slider de Energia',
  pattern_diary: 'Diário de Padrões',
  lunar_calendar: 'Calendário Lunar',
  pendulum_map: 'Mapa de Pêndulo',
  ego_layers: 'Camadas do Ego',
  archetype_card: 'Card de Arquétipo',
  reflection_prompt: 'Prompt de Reflexão',
  plasticity_map: 'Mapa de Plasticidade',
};

export function BlockPreview({ block, compact = false }: BlockPreviewProps) {
  const Icon = typeIcons[block.blockType];
  const content = block.content as Record<string, unknown>;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span>{typeLabels[block.blockType]}</span>
        {block.titulo && (
          <span className="text-foreground truncate max-w-[200px]">
            — {block.titulo}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "border rounded-lg p-4 bg-card",
      !block.ativo && "opacity-50"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium">{typeLabels[block.blockType]}</span>
        {block.titulo && (
          <span className="text-muted-foreground">— {block.titulo}</span>
        )}
      </div>

      <div className="text-sm">
        {block.blockType === 'rich_text' && (
          <div 
            className="prose prose-sm dark:prose-invert max-h-24 overflow-hidden"
            dangerouslySetInnerHTML={{ 
              __html: (content.html as string)?.slice(0, 200) + '...' || '<em>Sem conteúdo</em>' 
            }}
          />
        )}

        {block.blockType === 'image' && (
          <div className="space-y-2">
            {content.url ? (
              <img 
                src={content.url as string} 
                alt={content.alt as string || ''} 
                className="max-h-32 rounded object-cover"
              />
            ) : (
              <div className="h-20 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}
            {content.caption && (
              <p className="text-muted-foreground text-xs">{content.caption as string}</p>
            )}
          </div>
        )}

        {block.blockType === 'video' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">
              URL: {(content.url as string)?.slice(0, 50) || 'Não definida'}...
            </p>
            <p className="text-xs">
              Provider: {content.provider as string || 'youtube'}
            </p>
          </div>
        )}

        {block.blockType === 'audio' && (
          <div className="space-y-1">
            <p>{content.title as string || 'Áudio sem título'}</p>
            {content.artist && (
              <p className="text-muted-foreground text-xs">{content.artist as string}</p>
            )}
          </div>
        )}

        {block.blockType === 'ai_chat' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">
              {content.welcomeMessage as string || 'Chat com IA'}
            </p>
            {block.agenteId && (
              <p className="text-xs">Agente vinculado</p>
            )}
          </div>
        )}

        {block.blockType === 'cta_button' && (
          <div className="space-y-1">
            <p className="font-medium">{content.text as string || 'Botão'}</p>
            <p className="text-muted-foreground text-xs">
              Ação: {content.action as string || 'navigate'} → {content.href as string || '#'}
            </p>
          </div>
        )}

        {/* New interactive blocks preview */}
        {block.blockType === 'chakra_wheel' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Visualização dos 7 chakras</p>
            <p className="text-xs">Seleção múltipla: {content.allowMultipleSelection ? 'Sim' : 'Não'}</p>
          </div>
        )}

        {block.blockType === 'energy_slider' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Escala de energia/Hawkins</p>
            <p className="text-xs">Range: {(content.minValue as number) || 20} - {(content.maxValue as number) || 1000}</p>
          </div>
        )}

        {block.blockType === 'pattern_diary' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Diário de padrões comportamentais</p>
            <p className="text-xs">Campos: {(content.fields as Array<{label: string}> | undefined)?.map(f => f.label).join(', ') || 'Gatilho, Emoção, Resposta'}</p>
          </div>
        )}

        {block.blockType === 'lunar_calendar' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Calendário lunar cíclico</p>
            <p className="text-xs">Meses: {(content.monthsToShow as number) || 1}</p>
          </div>
        )}

        {block.blockType === 'pendulum_map' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Pêndulo interativo</p>
            <p className="text-xs">Mapas: {(content.maps as Array<{name: string}> | undefined)?.map(m => m.name).join(', ') || 'Sim/Não, Chakras'}</p>
          </div>
        )}

        {block.blockType === 'ego_layers' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">Camadas do ego antroposóficas</p>
            <p className="text-xs">Camadas: {(content.layers as Array<{name: string}>)?.map(l => l.name).join(', ') || 'Físico, Etérico, Astral, Mental'}</p>
          </div>
        )}

        {block.blockType === 'archetype_card' && (
          <div className="space-y-1">
            <p className="font-medium">{content.title as string || 'Card de Arquétipo'}</p>
            {content.subtitle && <p className="text-muted-foreground text-xs">{content.subtitle as string}</p>}
          </div>
        )}

        {block.blockType === 'reflection_prompt' && (
          <div className="space-y-1">
            <p className="text-muted-foreground">{(content.prompt as string)?.slice(0, 100) || 'Prompt de reflexão'}</p>
            <p className="text-xs">Resposta IA: {content.showAIResponse ? 'Sim' : 'Não'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
