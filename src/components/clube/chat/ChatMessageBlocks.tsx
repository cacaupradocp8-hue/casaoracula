import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, Compass, Layers, MessageSquareQuote, Sparkles, Stethoscope } from 'lucide-react';

interface Props {
  content: string;
  className?: string;
}

interface Block {
  type: 'sintese' | 'campo' | 'sessao' | 'grupo' | 'pergunta' | 'alerta' | 'text';
  title: string;
  content: string;
  icon: React.ElementType;
}

function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const sections = raw.split(/^## /gm).filter(Boolean);

  if (sections.length <= 1) {
    return [{ type: 'text', title: '', content: raw, icon: Sparkles }];
  }

  for (const section of sections) {
    const nl = section.indexOf('\n');
    const heading = nl > -1 ? section.slice(0, nl).trim() : section.trim();
    const body = nl > -1 ? section.slice(nl + 1).trim() : '';
    const lower = heading.toLowerCase();

    if (lower.includes('síntese simbólica') || lower.includes('sintese simbolica')) {
      blocks.push({ type: 'sintese', title: 'Síntese Simbólica', content: body, icon: Sparkles });
    } else if (lower.includes('campo em jogo')) {
      blocks.push({ type: 'campo', title: 'Campo em Jogo', content: body, icon: Compass });
    } else if (lower.includes('cartografia')) {
      blocks.push({ type: 'campo', title: 'Cartografia Possível', content: body, icon: Compass });
    } else if (lower.includes('aplicação prática') || lower.includes('aplicacao pratica')) {
      blocks.push({ type: 'sessao', title: 'Aplicação Prática', content: body, icon: Stethoscope });
    } else if (lower.includes('pergunta')) {
      blocks.push({ type: 'pergunta', title: 'Pergunta Terapêutica', content: body, icon: MessageSquareQuote });
    } else if (lower.includes('limite ético') || lower.includes('limite etico')) {
      blocks.push({ type: 'alerta', title: 'Limite Ético', content: body, icon: AlertTriangle });
    } else {
      blocks.push({ type: 'text', title: heading, content: body, icon: Sparkles });
    }
  }

  return blocks;
}

const blockStyles: Record<Block['type'], string> = {
  sintese: 'border-[hsl(var(--gold)_/_0.2)] bg-[hsl(var(--gold)_/_0.04)]',
  campo: 'border-purple-500/20 bg-purple-500/[0.04]',
  sessao: 'border-emerald-500/20 bg-emerald-500/[0.04]',
  grupo: 'border-sky-500/20 bg-sky-500/[0.04]',
  pergunta: 'border-amber-400/30 bg-amber-400/[0.06]',
  alerta: 'border-red-400/20 bg-red-400/[0.04]',
  text: 'border-border/30 bg-muted/20',
};

const iconStyles: Record<Block['type'], string> = {
  sintese: 'text-[hsl(var(--gold))]',
  campo: 'text-purple-400',
  sessao: 'text-emerald-400',
  grupo: 'text-sky-400',
  pergunta: 'text-amber-400',
  alerta: 'text-red-400',
  text: 'text-muted-foreground',
};

export function ChatMessageBlocks({ content, className }: Props) {
  const blocks = parseBlocks(content);

  if (blocks.length === 1 && blocks[0].type === 'text' && !blocks[0].title) {
    return (
      <div className={cn('prose prose-sm prose-invert max-w-none text-sm leading-relaxed', className)}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {blocks.map((block, i) => {
        const Icon = block.icon;
        return (
          <div
            key={i}
            className={cn(
              'rounded-xl border px-4 py-3 transition-colors',
              blockStyles[block.type]
            )}
          >
            {block.title && (
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', iconStyles[block.type])} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {block.title}
                </span>
              </div>
            )}
            <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:mt-1 [&>ul]:mb-0">
              <ReactMarkdown>{block.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
