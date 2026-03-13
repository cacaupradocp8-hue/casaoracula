import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Loader2, Sparkles, X, BookOpen, Heart, Sunset,
  Eye, Download, RefreshCw, MapPin, Calendar, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { EthicalNotice } from '@/components/shared/EthicalNotice';

type NarrativeType = 'sintese' | 'relatorio' | 'devolutiva' | 'fechamento';

interface NarrativeResult {
  type: NarrativeType;
  narrative: Record<string, string>;
  metadata: {
    total_sessions: number;
    districts_active: number;
    districts_integrated: number;
    generated_at: string;
    client_name: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNome?: string;
}

const NARRATIVE_TYPES: { key: NarrativeType; label: string; icon: typeof FileText; description: string }[] = [
  { key: 'sintese', label: 'Síntese', icon: Sparkles, description: 'Resumo breve da fase atual' },
  { key: 'relatorio', label: 'Relatório', icon: BookOpen, description: 'Narrativa completa da jornada' },
  { key: 'devolutiva', label: 'Devolutiva', icon: Heart, description: 'Texto para a cliente' },
  { key: 'fechamento', label: 'Fechamento', icon: Sunset, description: 'Encerramento de ciclo' },
];

const SECTION_TITLES: Record<string, string> = {
  // Síntese
  sintese: 'Síntese da Jornada',
  fase_atual: 'Fase Atual',
  proximo_horizonte: 'Próximo Horizonte',
  // Relatório
  titulo_narrativo: 'Título da Fase',
  ponto_partida: 'Ponto de Partida',
  movimentos_principais: 'Movimentos Principais',
  repeticoes: 'Repetições e Padrões',
  momentos_virada: 'Momentos de Virada',
  integracao: 'Integração',
  // Devolutiva
  abertura: 'Abertura',
  caminho_percorrido: 'O Caminho Percorrido',
  o_que_se_revela: 'O Que Se Revela',
  convite: 'Convite',
  frase_ancora: 'Frase-Âncora',
  // Fechamento
  honra_travessia: 'Honrando a Travessia',
  integracoes: 'Integrações Conquistadas',
  em_movimento: 'O Que Permanece em Movimento',
  abertura_futuro: 'O Que Se Abre',
  bencao_simbolica: 'Bênção Simbólica',
};

// Ordered field keys per type for proper rendering
const TYPE_FIELDS: Record<NarrativeType, string[]> = {
  sintese: ['sintese', 'fase_atual', 'proximo_horizonte'],
  relatorio: ['titulo_narrativo', 'ponto_partida', 'movimentos_principais', 'repeticoes', 'momentos_virada', 'integracao', 'proximo_horizonte'],
  devolutiva: ['abertura', 'caminho_percorrido', 'o_que_se_revela', 'convite', 'frase_ancora'],
  fechamento: ['honra_travessia', 'integracoes', 'em_movimento', 'abertura_futuro', 'bencao_simbolica'],
};

export function RelatorioNarrativo({ open, onClose, clienteId, clienteNome }: Props) {
  const [activeType, setActiveType] = useState<NarrativeType>('relatorio');
  const [results, setResults] = useState<Partial<Record<NarrativeType, NarrativeResult>>>({});
  const [loading, setLoading] = useState<NarrativeType | null>(null);

  const generate = async (type: NarrativeType) => {
    setLoading(type);
    try {
      const { data, error } = await supabase.functions.invoke('generate-journey-narrative', {
        body: { client_id: clienteId, narrative_type: type },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults(prev => ({ ...prev, [type]: data }));
    } catch (e: any) {
      console.error('Narrative generation error:', e);
      toast.error(e.message || 'Erro ao gerar narrativa');
    } finally {
      setLoading(null);
    }
  };

  const currentResult = results[activeType];

  const handleCopyText = () => {
    if (!currentResult) return;
    const fields = TYPE_FIELDS[activeType];
    const text = fields
      .filter(k => currentResult.narrative[k])
      .map(k => `${SECTION_TITLES[k] || k}\n${currentResult.narrative[k]}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Texto copiado');
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[800px] w-[95vw] max-h-[90vh] h-[90vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#C9A24A]/10 shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#C9A24A]/60" />
            <div>
              <h2 className="text-sm font-medium text-[#F5F1E8]/80">Relatório Narrativo da Jornada</h2>
              <p className="text-[10px] text-[#F5F1E8]/30">
                {clienteNome || 'Cliente'} · Guardião da Jornada Terapêutica
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[#F5F1E8]/30 hover:text-[#F5F1E8]/60 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Type selector */}
        <div className="px-5 pt-3 shrink-0">
          <Tabs value={activeType} onValueChange={v => setActiveType(v as NarrativeType)}>
            <TabsList className="bg-[#0B1B2B] border border-[#C9A24A]/10 h-auto p-1 w-full grid grid-cols-4 gap-1">
              {NARRATIVE_TYPES.map(nt => (
                <TabsTrigger
                  key={nt.key}
                  value={nt.key}
                  className="text-[10px] py-2 px-2 data-[state=active]:bg-[#C9A24A]/10 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/40 flex flex-col items-center gap-1"
                >
                  <nt.icon className="w-3.5 h-3.5" />
                  {nt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-[10px] text-[#F5F1E8]/25 mt-2 text-center">
            {NARRATIVE_TYPES.find(n => n.key === activeType)?.description}
          </p>
        </div>

        {/* Content area */}
        <ScrollArea className="flex-1 px-5 py-4">
          {!currentResult && loading !== activeType ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#C9A24A]/5 border border-[#C9A24A]/15 flex items-center justify-center">
                <FileText className="w-7 h-7 text-[#C9A24A]/40" />
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h3 className="text-sm text-[#F5F1E8]/60 font-medium">
                  {activeType === 'sintese' && 'Síntese da Jornada'}
                  {activeType === 'relatorio' && 'Relatório Narrativo'}
                  {activeType === 'devolutiva' && 'Devolutiva Simbólica'}
                  {activeType === 'fechamento' && 'Fechamento de Ciclo'}
                </h3>
                <p className="text-[11px] text-[#F5F1E8]/30 leading-relaxed">
                  {activeType === 'sintese' && 'Uma síntese breve e contemplativa da fase atual da jornada terapêutica.'}
                  {activeType === 'relatorio' && 'Uma narrativa completa que percorre toda a travessia, do ponto de partida ao horizonte que se abre.'}
                  {activeType === 'devolutiva' && 'Um texto acolhedor que a facilitadora pode adaptar para compartilhar com a cliente.'}
                  {activeType === 'fechamento' && 'Um texto de encerramento de ciclo que honra a travessia e abre espaço para o que vem.'}
                </p>
              </div>
              <Button
                onClick={() => generate(activeType)}
                className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] h-10 px-6 text-xs gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gerar {NARRATIVE_TYPES.find(n => n.key === activeType)?.label}
              </Button>
            </div>
          ) : loading === activeType ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#C9A24A]/50" />
              <div className="text-center space-y-1">
                <p className="text-xs text-[#F5F1E8]/50">Tecendo a narrativa da jornada…</p>
                <p className="text-[10px] text-[#F5F1E8]/20 italic">O mapa revela suas memórias.</p>
              </div>
            </div>
          ) : currentResult ? (
            /* Narrative content */
            <div className="space-y-6">
              {/* Metadata bar */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#F5F1E8]/20" />
                  <span className="text-[9px] text-[#F5F1E8]/30">
                    Gerado em {fmtDate(currentResult.metadata.generated_at)}
                  </span>
                </div>
                <Badge variant="outline" className="text-[8px] border-[#C9A24A]/15 text-[#C9A24A]/50">
                  {currentResult.metadata.total_sessions} sessões
                </Badge>
                <Badge variant="outline" className="text-[8px] border-[#C9A24A]/15 text-[#C9A24A]/50">
                  <MapPin className="w-2.5 h-2.5 mr-1" />
                  {currentResult.metadata.districts_active} ativos
                </Badge>
                <Badge variant="outline" className="text-[8px] border-[#556B57]/20 text-[#556B57]">
                  <TrendingUp className="w-2.5 h-2.5 mr-1" />
                  {currentResult.metadata.districts_integrated} integrados
                </Badge>
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Narrative sections */}
              <div className="space-y-5">
                {TYPE_FIELDS[activeType].map(fieldKey => {
                  const value = currentResult.narrative[fieldKey];
                  if (!value) return null;
                  const title = SECTION_TITLES[fieldKey] || fieldKey;
                  const isHighlight = ['frase_ancora', 'bencao_simbolica', 'titulo_narrativo', 'fase_atual'].includes(fieldKey);
                  const isShort = ['proximo_horizonte', 'fase_atual', 'frase_ancora', 'bencao_simbolica', 'titulo_narrativo'].includes(fieldKey);

                  if (isHighlight) {
                    return (
                      <div key={fieldKey} className="text-center py-4">
                        <p className="text-[9px] text-[#C9A24A]/40 uppercase tracking-wider mb-2">{title}</p>
                        <p className="text-sm text-[#C9A24A] italic font-medium leading-relaxed">"{value}"</p>
                      </div>
                    );
                  }

                  return (
                    <Card key={fieldKey} className="border-[#C9A24A]/8 bg-[#C9A24A]/[0.02]">
                      <CardContent className="p-4">
                        <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 font-semibold mb-2">
                          {title}
                        </h4>
                        <p className={`text-[#F5F1E8]/55 leading-relaxed ${isShort ? 'text-xs' : 'text-[11px]'}`}>
                          {value}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => generate(activeType)}
                  disabled={loading === activeType}
                  className="border-[#C9A24A]/15 text-[#F5F1E8]/40 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerar
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={handleCopyText}
                  className="border-[#C9A24A]/15 text-[#F5F1E8]/40 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  Copiar Texto
                </Button>
              </div>
            </div>
          ) : null}
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-[#C9A24A]/10 shrink-0 flex items-center justify-center gap-1.5">
          <Eye className="w-3 h-3 text-[#C9A24A]/30" />
          <span className="text-[8px] text-[#C9A24A]/30 italic">
            Leitura simbólica da jornada. Não substitui julgamento clínico. A interpretação pertence à facilitadora.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
