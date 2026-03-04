import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MapPin, Wrench, MessageCircle, Shield, Loader2 } from 'lucide-react';
import { getGpsSuggestion, type GpsSuggestion } from '@/lib/gps-cidadela';

interface Props {
  clientId: string;
  checkin: string;
  onApply?: (suggestion: GpsSuggestion) => void;
}

export function GpsSuggestionCard({ clientId, checkin, onApply }: Props) {
  const [suggestion, setSuggestion] = useState<GpsSuggestion | null>(null);
  const [meta, setMeta] = useState<{ currentDistrict: string | null; lastTool: string | null }>({ currentDistrict: null, lastTool: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    getGpsSuggestion(clientId, checkin).then(res => {
      setSuggestion(res.suggestion);
      setMeta(res.meta);
      setLoading(false);
    });
  }, [clientId, checkin]);

  if (loading) {
    return (
      <Card className="border-[#C9A24A]/20 bg-gradient-to-br from-[#0B1B2B] to-[#0B1B2B]/80 mb-4">
        <CardContent className="p-4 flex items-center justify-center gap-2 text-[#C9A24A]/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Calculando GPS…</span>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) return null;

  return (
    <Card className="border-[#C9A24A]/20 bg-gradient-to-br from-[#0B1B2B] to-[#1a2d3d] mb-4 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-[#C9A24A]/0 via-[#C9A24A] to-[#C9A24A]/0" />
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C9A24A]" />
            <span className="text-xs font-semibold text-[#C9A24A] uppercase tracking-wider">GPS da CidaDELA</span>
          </div>
          <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]/60">
            {suggestion.rule}
          </Badge>
        </div>

        {/* Meta resumo */}
        <div className="flex gap-4 text-[10px] text-[#F5F1E8]/40">
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
            <span className="text-[9px] text-[#C9A24A]/50 uppercase block mb-0.5">Distrito sugerido</span>
            <p className="text-sm font-medium text-[#F5F1E8]">{suggestion.distrito_sugerido}</p>
          </div>
          <div>
            <span className="text-[9px] text-[#C9A24A]/50 uppercase block mb-0.5">Ferramenta</span>
            <p className="text-sm font-medium text-[#F5F1E8]">{suggestion.ferramenta_recomendada}</p>
          </div>
        </div>

        {/* Pergunta clínica */}
        <div className="bg-[#F5F1E8]/5 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-[#C9A24A]/60 mt-0.5 shrink-0" />
            <p className="text-xs text-[#F5F1E8]/70 italic leading-relaxed">
              "{suggestion.pergunta_clinica}"
            </p>
          </div>
        </div>

        {/* Postura */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#556B57]/10 rounded-md p-2">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-[#556B57]" />
              <span className="text-[8px] text-[#556B57] uppercase font-semibold">Sustentar</span>
            </div>
            <p className="text-[10px] text-[#F5F1E8]/50">{suggestion.postura.sustentar}</p>
          </div>
          <div className="flex-1 bg-red-500/5 rounded-md p-2">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-red-400/60" />
              <span className="text-[8px] text-red-400/60 uppercase font-semibold">Evitar</span>
            </div>
            <p className="text-[10px] text-[#F5F1E8]/50">{suggestion.postura.evitar}</p>
          </div>
        </div>

        {/* Apply button */}
        {onApply && (
          <button
            onClick={() => onApply(suggestion)}
            className="w-full text-xs py-2 rounded-md bg-[#C9A24A]/10 text-[#C9A24A] hover:bg-[#C9A24A]/20 transition-colors"
          >
            Aplicar sugestão
          </button>
        )}
      </CardContent>
    </Card>
  );
}
