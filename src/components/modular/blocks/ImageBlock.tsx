import { ContentBlock, ImageContent } from '@/types/modular';
import { cn } from '@/lib/utils';

interface ImageBlockProps {
  block: ContentBlock;
}

const sizeClasses = {
  small: 'max-w-sm',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
  full: 'max-w-full',
};

const aspectRatioClasses = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '3:4': 'aspect-[3/4]',
  'auto': '',
};

export function ImageBlock({ block }: ImageBlockProps) {
  const content = block.content as ImageContent;
  
  if (!content.url) {
    return null;
  }

  const sizeClass = sizeClasses[content.size || 'medium'];
  const aspectClass = aspectRatioClasses[content.aspectRatio || 'auto'];

  return (
    <figure className={cn("mx-auto animate-fade-in", sizeClass)}>
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-3 text-center">{block.titulo}</h3>
      )}
      <div className={cn("overflow-hidden rounded-lg", aspectClass)}>
        <img
          src={content.url}
          alt={content.alt || block.titulo || ''}
          className={cn(
            "w-full object-cover transition-transform duration-500 hover:scale-105",
            aspectClass ? 'h-full' : 'h-auto'
          )}
          loading="lazy"
        />
      </div>
      {content.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}
