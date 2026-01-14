// ============================================
// PROFESSIONAL INTRO BLOCK
// ============================================
// Bloco obrigatório para todas as ferramentas
// Comunica o valor profissional da ferramenta

import { ContentBlock } from '@/types/modular';
import DOMPurify from 'dompurify';
import { Clock, Clipboard, Lightbulb, CheckCircle2 } from 'lucide-react';

export interface ProfessionalIntroContent {
  // O que é esta ferramenta
  whatIs?: string;
  // Para que serve (economia de tempo, organização, etc.)
  whatFor?: string;
  // Como usar (antes/durante/depois da sessão)
  howToUse?: string;
  // Bullets de valor profissional
  professionalValue?: string[];
  // Tipo de ferramenta para adaptar o tom
  toolType?: 'diagnostic' | 'ritual' | 'diary' | 'ai' | 'tracking' | 'general';
  // Mostrar ícones
  showIcons?: boolean;
}

interface ProfessionalIntroBlockProps {
  block: ContentBlock;
}

const SECTION_ICONS = {
  whatIs: Clipboard,
  whatFor: Clock,
  howToUse: Lightbulb,
};

export function ProfessionalIntroBlock({ block }: ProfessionalIntroBlockProps) {
  const content = block.content as ProfessionalIntroContent;
  const showIcons = content.showIcons !== false;
  
  // Verificar se há conteúdo para exibir
  const hasContent = content.whatIs || content.whatFor || content.howToUse || 
                    (content.professionalValue && content.professionalValue.length > 0);
  
  if (!hasContent) {
    return null;
  }

  const sanitize = (html: string) => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return (
    <div className="animate-fade-in bg-card/50 border border-border rounded-lg p-6 space-y-6">
      {/* Header opcional do bloco */}
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">
          {block.titulo}
        </h3>
      )}

      {/* O que é */}
      {content.whatIs && (
        <Section
          icon={showIcons ? SECTION_ICONS.whatIs : undefined}
          title="O que é esta ferramenta"
          content={sanitize(content.whatIs)}
        />
      )}

      {/* Para que serve */}
      {content.whatFor && (
        <Section
          icon={showIcons ? SECTION_ICONS.whatFor : undefined}
          title="Para que serve"
          content={sanitize(content.whatFor)}
        />
      )}

      {/* Como usar */}
      {content.howToUse && (
        <Section
          icon={showIcons ? SECTION_ICONS.howToUse : undefined}
          title="Como usar"
          content={sanitize(content.howToUse)}
        />
      )}

      {/* Valor Profissional - Bullets */}
      {content.professionalValue && content.professionalValue.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-gold uppercase tracking-wide mb-4">
            Valor Profissional
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {content.professionalValue.map((item, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para seções
interface SectionProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}

function Section({ icon: Icon, title, content }: SectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gold" />}
        <h4 className="text-base font-medium text-foreground">{title}</h4>
      </div>
      <div 
        className="prose prose-sm prose-invert max-w-none text-muted-foreground pl-7"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
