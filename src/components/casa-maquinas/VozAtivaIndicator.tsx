import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AudioLines, X, HelpCircle, Compass, Wrench } from 'lucide-react';
import { VOZES, type Voz } from '@/data/vozes';
import { cn } from '@/lib/utils';

interface VozAtivaIndicatorProps {
  vozId: string | null;
  onClear?: () => void;
  compact?: boolean;
}

export function VozAtivaIndicator({ vozId, onClear, compact = false }: VozAtivaIndicatorProps) {
  if (!vozId) return null;
  const voz = VOZES.find(v => v.id === vozId);
  if (!voz) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: `hsl(${voz.cor})` }} />
        <span className="text-xs text-muted-foreground">
          Voz ativa: <span className="text-foreground font-medium">{voz.nome}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary/20 bg-primary/5">
      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: `hsl(${voz.cor})` }}>
        <AudioLines className="w-3 h-3 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-0.5">Voz ativa</p>
        <p className="text-sm font-display font-semibold text-foreground">{voz.nome}</p>
      </div>
      {onClear && (
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onClear}>
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

interface VozSuggestionsProps {
  vozId: string | null;
}

export function VozClinicalSuggestions({ vozId }: VozSuggestionsProps) {
  if (!vozId) return null;
  const voz = VOZES.find(v => v.id === vozId);
  if (!voz) return null;

  return (
    <div className="space-y-3 rounded-lg border border-border/30 bg-card/40 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AudioLines className="w-3.5 h-3.5" style={{ color: `hsl(${voz.cor})` }} />
        <span>Sugestões da voz <span className="font-medium text-foreground">{voz.nome}</span></span>
      </div>

      {/* Perguntas clínicas */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Perguntas clínicas
        </p>
        <ul className="space-y-1">
          {voz.perguntasClinicas.map((p, i) => (
            <li key={i} className="text-xs text-foreground/80 pl-3 border-l-2 border-primary/20 py-0.5">
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Distritos alinhados */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 flex items-center gap-1">
          <Compass className="w-3 h-3" /> Distritos alinhados
        </p>
        <div className="flex flex-wrap gap-1">
          {voz.distritos.map(d => (
            <Badge key={d} variant="outline" className="text-[10px] border-primary/20 text-primary/70">{d}</Badge>
          ))}
        </div>
      </div>

      {/* Ferramentas compatíveis */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 flex items-center gap-1">
          <Wrench className="w-3 h-3" /> Ferramentas compatíveis
        </p>
        <div className="flex flex-wrap gap-1">
          {voz.ferramentas.map(f => (
            <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Sort tools by voz compatibility — compatible tools first
 */
export function sortToolsByVoz<T extends { nome: string }>(tools: T[], vozId: string | null): T[] {
  if (!vozId) return tools;
  const voz = VOZES.find(v => v.id === vozId);
  if (!voz) return tools;

  const compatibleNames = new Set(voz.ferramentas.map(f => f.toLowerCase()));

  return [...tools].sort((a, b) => {
    const aCompat = compatibleNames.has(a.nome.toLowerCase()) ? 0 : 1;
    const bCompat = compatibleNames.has(b.nome.toLowerCase()) ? 0 : 1;
    return aCompat - bCompat;
  });
}

/**
 * Get the Voz data object for a given voz ID
 */
export function getVozData(vozId: string | null): Voz | null {
  if (!vozId) return null;
  return VOZES.find(v => v.id === vozId) || null;
}
