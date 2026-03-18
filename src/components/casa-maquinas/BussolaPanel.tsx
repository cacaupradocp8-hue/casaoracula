import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BussolaResult } from '@/hooks/useBussola';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Compass, MapPin, Wrench, Sparkles, MessageCircle,
  FlaskConical, Check, X, RefreshCw, Loader2
} from 'lucide-react';

interface BussolaPanelProps {
  result: BussolaResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (recommendationId: string, aceita: boolean, observacao?: string) => void;
  onAlternative?: () => void;
  loading?: boolean;
  modoSessao?: 'oracula' | 'livre';
}

export function BussolaPanel({
  result,
  open,
  onOpenChange,
  onAccept,
  onAlternative,
  loading,
  modoSessao = 'oracula',
}: BussolaPanelProps) {
  const navigate = useNavigate();
  const [observacao, setObservacao] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  if (!result) return null;

  const isLivre = modoSessao === 'livre';

  const handleAccept = () => {
    onAccept(result.recommendation_id, true, observacao || undefined);
    onOpenChange(false);
    // Navigate to tool if available
    if (result.tool_principal?.slug) {
      navigate(`/casa-das-maquinas/ferramentas/${result.tool_principal.slug}`);
    }
  };

  const handleReject = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }
    onAccept(result.recommendation_id, false, observacao || undefined);
    onOpenChange(false);
  };

  const confiancaColor =
    result.confianca >= 80 ? 'text-emerald-400' :
    result.confianca >= 60 ? 'text-[#C9A24A]' :
    'text-[#F5F1E8]/40';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-[#0B1B2B] border-l border-[#C9A24A]/15 w-full sm:max-w-md p-0"
      >
        <SheetHeader className="p-5 pb-3 border-b border-[#C9A24A]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A24A]/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#C9A24A]" />
            </div>
            <div>
              <SheetTitle className="text-[#F5F1E8] text-base">
                Bússola da Cartógrafa
              </SheetTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]">
                  {result.fase_jornada}
                </Badge>
                <span className={`text-[10px] ${confiancaColor}`}>
                  {result.confianca}% confiança
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-90px)]">
            <div className="p-5 space-y-5">

              {/* Ethical notice */}
              <div className="bg-[#556B57]/8 border border-[#556B57]/15 rounded-lg px-3 py-2">
                <p className="text-[10px] text-[#F5F1E8]/40 leading-relaxed italic">
                  A Bússola orienta, não diagnostica. Use como apoio à sua condução clínica.
                </p>
              </div>

              {/* Distrito sugerido */}
              {result.distrito_sugerido && (
                <div className="bg-[#C9A24A]/[0.04] border border-[#C9A24A]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60">
                      Distrito Sugerido
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#F5F1E8]">
                    {result.distrito_sugerido}
                  </p>
                </div>
              )}

              {/* Ferramenta principal */}
              {result.tool_principal && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60">
                      Ferramenta Principal
                    </span>
                  </div>
                  <div className="bg-[#0B1B2B]/80 border border-[#C9A24A]/15 rounded-lg p-3">
                    <p className="text-sm font-medium text-[#F5F1E8]">
                      {result.tool_principal.nome}
                    </p>
                  </div>
                </div>
              )}

              {/* Ferramenta complementar */}
              {result.tool_complementar && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#556B57]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#556B57]/60">
                      Complementar
                    </span>
                  </div>
                  <div className="bg-[#0B1B2B]/80 border border-[#556B57]/15 rounded-lg p-3">
                    <p className="text-sm text-[#F5F1E8]/70">
                      {result.tool_complementar.nome}
                    </p>
                  </div>
                </div>
              )}

              <Separator className="bg-[#C9A24A]/8" />

              {/* Pergunta clínica */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60">
                    Pergunta Clínica
                  </span>
                </div>
                <p className="text-sm text-[#F5F1E8]/70 italic leading-relaxed pl-3 border-l-2 border-[#C9A24A]/15">
                  "{result.pergunta_sugerida}"
                </p>
              </div>

              {/* Ritual */}
              {result.ritual_sugerido && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-3.5 h-3.5 text-[#7B68EE]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#7B68EE]/60">
                      Ritual Sugerido
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F1E8]/50 leading-relaxed">
                    {result.ritual_sugerido}
                  </p>
                </div>
              )}

              <Separator className="bg-[#C9A24A]/8" />

              {/* Feedback area */}
              {showFeedback && (
                <div>
                  <label className="text-[10px] text-[#F5F1E8]/40 mb-1 block">
                    Observação (opcional)
                  </label>
                  <Textarea
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] min-h-[60px] text-xs"
                    placeholder="Por que esta sugestão não se aplica?"
                  />
                </div>
              )}

              {/* Actions */}
              <div className={`space-y-2 ${isLivre ? 'opacity-70' : ''}`}>
                {isLivre && (
                  <p className="text-[9px] text-[#F5F1E8]/30 text-center mb-1">
                    Modo livre — sugestões opcionais
                  </p>
                )}

                <Button
                  onClick={handleAccept}
                  className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] gap-2"
                >
                  <Check className="w-4 h-4" />
                  Aceitar sugestão
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="flex-1 border-[#F5F1E8]/10 text-[#F5F1E8]/50 hover:text-[#F5F1E8] gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    {showFeedback ? 'Confirmar' : 'Ignorar'}
                  </Button>

                  {onAlternative && (
                    <Button
                      variant="outline"
                      onClick={onAlternative}
                      className="flex-1 border-[#C9A24A]/10 text-[#C9A24A]/60 hover:text-[#C9A24A] gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Alternativa
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
