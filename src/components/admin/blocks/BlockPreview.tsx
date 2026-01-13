import { ContentBlock, ContentBlockType } from '@/types/modular';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Bot, 
  MousePointerClick 
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
};

const typeLabels: Record<ContentBlockType, string> = {
  rich_text: 'Texto Rico',
  image: 'Imagem',
  video: 'Vídeo',
  audio: 'Áudio',
  ai_chat: 'Chat IA',
  cta_button: 'Botão CTA',
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
      </div>
    </div>
  );
}
