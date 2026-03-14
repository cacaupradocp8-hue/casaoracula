import { ContentBlock, AudioContent } from '@/types/modular';
import { PlayerOracular } from '@/components/audio/PlayerOracular';

interface AudioBlockProps {
  block: ContentBlock;
}

export function AudioBlock({ block }: AudioBlockProps) {
  const content = block.content as AudioContent;

  if (!content.url) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{block.titulo}</h3>
      )}

      <PlayerOracular
        audioUrl={content.url}
        titulo={content.title || undefined}
        subtitulo={content.artist || undefined}
        hideInsight={false}
      />
    </div>
  );
}
