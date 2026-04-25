import { memo } from 'react';
import { Sparkles, Brain, Briefcase, Compass, Sun, FileText, BookOpen, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import DOMPurify from 'dompurify';

export interface AulaBloco {
  tipo: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

const BLOCO_CONFIG: Record<string, { icon: LucideIcon; label: string; accent: string }> = {
  essencia: { icon: Sparkles, label: 'Essência', accent: 'text-amber-400' },
  raiz_psiquica: { icon: Brain, label: 'Raiz Psíquica', accent: 'text-violet-400' },
  traducao_profissional: { icon: Briefcase, label: 'Tradução Profissional', accent: 'text-teal-400' },
  atravessamento: { icon: Compass, label: 'Atravessamento', accent: 'text-rose-400' },
  integracao_oracular: { icon: Sun, label: 'Integração Oracular', accent: 'text-gold' },
  registro: { icon: FileText, label: 'Registro', accent: 'text-sky-400' },
  texto_livre: { icon: BookOpen, label: 'Texto', accent: 'text-muted-foreground' },
};

interface BlocoRendererProps {
  bloco: AulaBloco;
}

export const BlocoRenderer = memo(({ bloco }: BlocoRendererProps) => {
  const config = BLOCO_CONFIG[bloco.tipo] || BLOCO_CONFIG.texto_livre;
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden border-border/30 bg-card/40 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 border-b border-border/10">
          <Icon className={cn("w-3.5 h-3.5", config.accent)} />
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/80">
            {bloco.titulo || config.label}
          </span>
        </div>
        <div 
          className="p-4 prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(bloco.conteudo.replace(/\n/g, '<br/>')) 
          }}
        />
      </CardContent>
    </Card>
  );
});

BlocoRenderer.displayName = 'BlocoRenderer';
