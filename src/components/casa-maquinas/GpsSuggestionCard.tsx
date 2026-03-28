import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MapPin, Wrench, MessageCircle, Shield, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { getGpsSuggestion, type GpsSuggestion } from '@/lib/gps-cidadela';

interface Props {
  clientId: string;
  checkin: string;
  vozAtiva?: string | null;
  onApply?: (suggestion: GpsSuggestion) => void;
}

export function GpsSuggestionCard({ clientId, checkin, vozAtiva, onApply }: Props) {
  const [suggestion, setSuggestion] = useState<GpsSuggestion | null>(null);
  const [meta, setMeta] = useState<{ currentDistrict: string | null; lastTool: string | null; vozInfluencia: string | null }>({ currentDistrict: null, lastTool: null, vozInfluencia: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    getGpsSuggestion(clientId, checkin, vozAtiva).then(res => {
      setSuggestion(res.suggestion);
      setMeta(res.meta);
      setLoading(false);
    });
  }, [clientId, checkin, vozAtiva]);

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 mb-4">
        <CardContent className="p-4 flex items-center justify-center gap-2 text-primary/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Calculando GPS da Cidade Interior…</span>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/90 mb-4 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">GPS da Cidade Interior</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[8px] border-primary/20 text-primary/60">
              {suggestion.confianca}% confiança
            </Badge>
            <Badge variant="outline" className="text-[8px] border-border/30 text-muted-foreground">
              {suggestion.rule}
            </Badge>
          </div>
        </div>

        {/* Meta resumo */}
        <div className="flex gap-4 text-[10px] text-muted-foreground/60">
          {meta.currentDistrict && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Atual: {meta.currentDistrict}
            </span>
          )}
          {meta.lastTool && (
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Última: {meta.lastTool}
            </span>
          )}
        </div>

        {/* Suggestion grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[9px] text-primary/50 uppercase block mb-0.5">Distrito sugerido</span>
            <p className="text-sm font-medium text-foreground">{suggestion.distrito_sugerido}</p>
          </div>
          <div>
            <span className="text-[9px] text-primary/50 uppercase block mb-0.5">Ferramenta recomendada</span>
            <p className="text-sm font-medium text-foreground">{suggestion.ferramenta_recomendada}</p>
          </div>
        </div>

        {/* Ferramenta complementar */}
        {suggestion.ferramenta_complementar && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/20 rounded-md px-3 py-1.5">
            <Wrench className="w-3 h-3 text-primary/40" />
            <span>Complementar: <strong className="text-foreground/70">{suggestion.ferramenta_complementar}</strong></span>
          </div>
        )}

        {/* Pergunta clínica */}
        <div className="bg-foreground/5 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/70 italic leading-relaxed">
              "{suggestion.pergunta_clinica}"
            </p>
          </div>
        </div>

        {/* Ritual sugerido */}
        {suggestion.ritual && (
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-accent/5 rounded-md px-3 py-2">
            <Sparkles className="w-3 h-3 text-accent/60 mt-0.5 shrink-0" />
            <span>{suggestion.ritual}</span>
          </div>
        )}

        {/* Carta simbólica opcional */}
        {suggestion.carta_simbolica && (
          <div className="border border-primary/10 rounded-lg p-3 bg-primary/5">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary/50" />
              <span className="text-[9px] text-primary/50 uppercase font-semibold">Carta Simbólica</span>
            </div>
            <p className="text-xs font-medium text-foreground/80 mb-1">{suggestion.carta_simbolica.nome}</p>
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              {suggestion.carta_simbolica.mensagem}
            </p>
          </div>
        )}

        {/* Postura */}
        <div className="flex gap-3">
          <div className="flex-1 bg-accent/5 rounded-md p-2">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-accent" />
              <span className="text-[8px] text-accent uppercase font-semibold">Sustentar</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{suggestion.postura.sustentar}</p>
          </div>
          <div className="flex-1 bg-destructive/5 rounded-md p-2">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-destructive/60" />
              <span className="text-[8px] text-destructive/60 uppercase font-semibold">Evitar</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{suggestion.postura.evitar}</p>
          </div>
        </div>

        {/* Apply button */}
        {onApply && (
          <button
            onClick={() => onApply(suggestion)}
            className="w-full text-xs py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Aplicar sugestão na sessão
          </button>
        )}
      </CardContent>
    </Card>
  );
}
