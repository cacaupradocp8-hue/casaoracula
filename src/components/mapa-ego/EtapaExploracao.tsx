// ============================================
// ETAPA 1: EXPLORAÇÃO DAS CAMADAS
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAMADAS_EGO, RespostaCamada } from './types';

interface EtapaExploracaoProps {
  respostas: Record<string, RespostaCamada>;
  onAtualizarResposta: (camadaId: string, respostas: string[], intensidade?: 'baixa' | 'media' | 'alta') => void;
}

export function EtapaExploracao({ respostas, onAtualizarResposta }: EtapaExploracaoProps) {
  const [camadaExpandida, setCamadaExpandida] = useState<string | null>(null);

  const getProgressoCamada = (camadaId: string) => {
    const camada = CAMADAS_EGO.find((c) => c.id === camadaId);
    if (!camada) return 0;
    const respostasCamada = respostas[camadaId]?.respostas || [];
    const respondidas = respostasCamada.filter((r) => r.trim().length > 0).length;
    return (respondidas / camada.convites.length) * 100;
  };

  const progressoTotal = () => {
    const totalConvites = CAMADAS_EGO.reduce((sum, c) => sum + c.convites.length, 0);
    const totalRespondidos = Object.values(respostas).reduce(
      (sum, r) => sum + r.respostas.filter((resp) => resp.trim().length > 0).length,
      0
    );
    return totalConvites > 0 ? (totalRespondidos / totalConvites) * 100 : 0;
  };

  const atualizarRespostaCamada = (camadaId: string, index: number, valor: string) => {
    const camada = CAMADAS_EGO.find((c) => c.id === camadaId);
    if (!camada) return;

    const respostasAtuais = respostas[camadaId]?.respostas || camada.convites.map(() => '');
    const novasRespostas = [...respostasAtuais];
    novasRespostas[index] = valor;

    onAtualizarResposta(camadaId, novasRespostas);
  };

  return (
    <div className="space-y-6">
      {/* Progresso geral */}
      <Card className="bg-card/30 border-gold/20">
        <CardContent className="pt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold" />
              Travessia das Camadas
            </span>
            <span>{Math.round(progressoTotal())}%</span>
          </div>
          <Progress value={progressoTotal()} className="h-2" />
        </CardContent>
      </Card>

      {/* Camadas */}
      <div className="relative py-4">
        <div className="flex flex-col items-center gap-3">
          {CAMADAS_EGO.map((camada, index) => {
            const isExpandida = camadaExpandida === camada.id;
            const progresso = getProgressoCamada(camada.id);
            const largura = 100 - index * 8;

            return (
              <div key={camada.id} className="w-full" style={{ maxWidth: `${largura}%` }}>
                <button
                  onClick={() => setCamadaExpandida(isExpandida ? null : camada.id)}
                  className={cn(
                    'w-full px-4 py-4 rounded-xl border-2 transition-all duration-300',
                    'flex items-center justify-between',
                    'hover:scale-[1.01] hover:shadow-lg',
                    isExpandida && 'ring-2 ring-gold/50 shadow-xl'
                  )}
                  style={{
                    borderColor: camada.cor,
                    backgroundColor: `color-mix(in srgb, ${camada.cor} 15%, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: camada.cor }}
                    />
                    <div>
                      <span className="font-medium block">{camada.nome}</span>
                      <span className="text-xs text-muted-foreground">{camada.descricao}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {progresso > 0 && (
                      <span className="text-xs text-muted-foreground">{Math.round(progresso)}%</span>
                    )}
                    {isExpandida ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Convites de escuta expandidos */}
                {isExpandida && (
                  <div
                    className="mt-3 p-5 rounded-xl space-y-5 animate-in slide-in-from-top-2 duration-300"
                    style={{ backgroundColor: `color-mix(in srgb, ${camada.cor} 8%, transparent)` }}
                  >
                    {camada.convites.map((convite, conviteIndex) => {
                      const respostasArray = respostas[camada.id]?.respostas || [];
                      return (
                        <div key={conviteIndex} className="space-y-2">
                          <label className="text-sm font-medium text-foreground/90">{convite}</label>
                          <Textarea
                            placeholder="Escreva livremente..."
                            value={respostasArray[conviteIndex] || ''}
                            onChange={(e) => atualizarRespostaCamada(camada.id, conviteIndex, e.target.value)}
                            className="bg-background/60 min-h-[90px] resize-none border-border/50"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
