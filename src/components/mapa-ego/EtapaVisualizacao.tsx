// ============================================
// ETAPA 3: VISUALIZAÇÃO DO MAPA
// ============================================

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { CAMADAS_EGO, RespostaCamada } from './types';
import { cn } from '@/lib/utils';

interface EtapaVisualizacaoProps {
  respostas: Record<string, RespostaCamada>;
}

export function EtapaVisualizacao({ respostas }: EtapaVisualizacaoProps) {
  // Calcular intensidade de cada camada baseado nas respostas
  const intensidades = useMemo(() => {
    return CAMADAS_EGO.map((camada) => {
      const resp = respostas[camada.id];
      if (!resp) return { camada, valor: 0.2 };

      const totalChars = resp.respostas.reduce((sum, r) => sum + r.trim().length, 0);
      // Normalizar: 0-100 chars = baixo, 100-300 = médio, 300+ = alto
      const valor = Math.min(1, Math.max(0.2, totalChars / 300));
      return { camada, valor };
    });
  }, [respostas]);

  // Camada mais ativa
  const camadaDominante = intensidades.reduce((max, item) =>
    item.valor > max.valor ? item : max
  );

  return (
    <div className="space-y-6">
      <Card className="bg-card/30 border-gold/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-gold mb-6">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Contemple seu Mapa</span>
          </div>

          {/* Mandala visual */}
          <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
            {/* Círculos concêntricos */}
            {intensidades.map(({ camada, valor }, index) => {
              const tamanho = 280 - index * 50;
              const opacity = 0.3 + valor * 0.5;

              return (
                <div
                  key={camada.id}
                  className={cn(
                    'absolute rounded-full transition-all duration-500',
                    'flex items-center justify-center',
                    camadaDominante.camada.id === camada.id && 'ring-2 ring-gold/50'
                  )}
                  style={{
                    width: tamanho,
                    height: tamanho,
                    left: (280 - tamanho) / 2,
                    top: (280 - tamanho) / 2,
                    backgroundColor: `color-mix(in srgb, ${camada.cor} ${Math.round(opacity * 100)}%, transparent)`,
                    border: `2px solid color-mix(in srgb, ${camada.cor} 60%, transparent)`,
                    boxShadow: valor > 0.5 ? `0 0 ${valor * 20}px color-mix(in srgb, ${camada.cor} 30%, transparent)` : 'none',
                  }}
                >
                  {index === intensidades.length - 1 && (
                    <span className="text-xs text-center px-2 text-white/80 font-medium">
                      Eu
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {CAMADAS_EGO.map((camada) => {
              const intensidade = intensidades.find((i) => i.camada.id === camada.id);
              const isDominante = camadaDominante.camada.id === camada.id;

              return (
                <div
                  key={camada.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs',
                    isDominante ? 'bg-gold/20 text-gold' : 'bg-muted/30 text-muted-foreground'
                  )}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: camada.cor,
                      opacity: intensidade?.valor || 0.3,
                    }}
                  />
                  {camada.nome}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insight da visualização */}
      <Card className="bg-gradient-to-br from-gold/5 to-purple-900/10 border-gold/20">
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            A camada mais presente em sua exploração foi:
          </p>
          <p
            className="text-lg font-medium text-center"
            style={{ color: camadaDominante.camada.cor }}
          >
            {camadaDominante.camada.nome}
          </p>
          <p className="text-sm text-muted-foreground text-center italic">
            "{camadaDominante.camada.descricao}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
