// ============================================
// ETAPA 2: INTEGRAÇÃO SIMBÓLICA
// ============================================

import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link2, Sparkles } from 'lucide-react';
import { CAMADAS_EGO, RespostaCamada } from './types';

interface EtapaIntegracaoProps {
  respostas: Record<string, RespostaCamada>;
}

export function EtapaIntegracao({ respostas }: EtapaIntegracaoProps) {
  // Identificar camadas com mais conteúdo
  const camadasAtivas = CAMADAS_EGO.filter((camada) => {
    const resp = respostas[camada.id];
    return resp && resp.respostas.some((r) => r.trim().length > 10);
  });

  const camadasVazias = CAMADAS_EGO.filter((camada) => {
    const resp = respostas[camada.id];
    return !resp || !resp.respostas.some((r) => r.trim().length > 10);
  });

  return (
    <div className="space-y-6">
      {/* Visão geral das camadas preenchidas */}
      <Card className="bg-card/30 border-gold/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Camadas Exploradas</span>
          </div>

          {camadasAtivas.length > 0 ? (
            <div className="grid gap-3">
              {camadasAtivas.map((camada) => {
                const resp = respostas[camada.id];
                const primeiraResposta = resp?.respostas.find((r) => r.trim().length > 0) || '';
                return (
                  <div
                    key={camada.id}
                    className="p-3 rounded-lg border"
                    style={{
                      borderColor: `color-mix(in srgb, ${camada.cor} 40%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${camada.cor} 8%, transparent)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: camada.cor }}
                      />
                      <span className="text-sm font-medium">{camada.nome}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {primeiraResposta.substring(0, 120)}
                      {primeiraResposta.length > 120 && '...'}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhuma camada foi explorada ainda. Volte à etapa anterior.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Convite de integração */}
      <Card className="bg-gradient-to-br from-purple-900/10 to-gold/5 border-purple-500/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-purple-300">
            <Link2 className="w-5 h-5" />
            <span className="font-medium">Conexões entre Camadas</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Observe o que escreveu em cada camada. Há padrões que se repetem? 
            Tensões entre o que pensa e o que sente? Acolhimentos ou resistências?
          </p>

          <div className="space-y-2">
            <Label className="text-sm">O que você percebe ao olhar para o todo?</Label>
            <Textarea
              placeholder="Anote livremente suas percepções..."
              className="min-h-[100px] bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Camadas não exploradas */}
      {camadasVazias.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Camadas ainda não exploradas:{' '}
            {camadasVazias.map((c) => c.nome).join(', ')}
          </p>
          <p className="mt-1 text-xs">
            Você pode voltar a qualquer momento para completar.
          </p>
        </div>
      )}
    </div>
  );
}
