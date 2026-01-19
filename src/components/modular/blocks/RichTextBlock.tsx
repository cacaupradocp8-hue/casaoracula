import { ContentBlock, RichTextContent } from '@/types/modular';
import DOMPurify from 'dompurify';

interface RichTextBlockProps {
  block: ContentBlock;
}

export function RichTextBlock({ block }: RichTextBlockProps) {
  const content = block.content as RichTextContent;
  
  if (!content.html) {
    return null;
  }

  const sanitizedHtml = DOMPurify.sanitize(content.html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                   'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });

  return (
    <div className="animate-fade-in">
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-3">{block.titulo}</h3>
      )}
      <div 
        className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-gold hover:prose-a:text-gold/80"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
