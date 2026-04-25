import { memo, useState } from 'react';
import { Sparkles, Brain, Briefcase, Compass, Sun, FileText, BookOpen, LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import DOMPurify from 'dompurify';

export interface AulaBloco {
  tipo: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

export const BLOCO_CONFIG: Record<string, { icon: LucideIcon; label: string; accent: string }> = {
  essencia: { icon: Sparkles, label: 'Essência', accent: 'text-amber-400' },
  raiz_psiquica: { icon: Brain, label: 'Raiz Psíquica', accent: 'text-violet-400' },
  traducao_profissional: { icon: Briefcase, label: 'Tradução Profissional', accent: 'text-teal-400' },
  atravessamento: { icon: Compass, label: 'Atravessamento', accent: 'text-rose-400' },
  integracao_oracular: { icon: Sun, label: 'Integração Oracular', accent: 'text-gold' },
  registro: { icon: FileText, label: 'Registro', accent: 'text-sky-400' },
  texto_livre: { icon: BookOpen, label: 'Texto', accent: 'text-muted-foreground' },
};

function formatContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^(.+)$/, '<p>$1</p>');
}

interface BlocoRendererProps {
  bloco: AulaBloco;
}

export const BlocoRenderer = memo(({ bloco }: BlocoRendererProps) => {
  const [expanded, setExpanded] = useState(true);
  const config = BLOCO_CONFIG[bloco.tipo] || BLOCO_CONFIG.texto_livre;
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden border-border/30 bg-card/40 backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/10 transition-colors"
      >
        <Icon className={cn('w-4 h-4 shrink-0', config.accent)} />
        <span className="text-sm font-display text-foreground flex-1">
          {bloco.titulo || config.label}
        </span>
        <ChevronDown 
          className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-180")} 
        />
      </button>
      
      {expanded && bloco.conteudo && (
        <CardContent className="pt-0 pb-4 px-4">
          <div
            className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(formatContent(bloco.conteudo)) 
            }}
          />
        </CardContent>
      )}
    </Card>
  );
});

BlocoRenderer.displayName = 'BlocoRenderer';
