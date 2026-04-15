import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detectarPadroes, PADRAO_LABELS, type MapaVivoEntry } from '@/lib/cabine/motorMapaVivo';
import { Eye } from 'lucide-react';

interface Props {
  entries: MapaVivoEntry[];
}

export function MapaVivoPadroes({ entries }: Props) {
  const padroes = detectarPadroes(entries);

  const ativos = [
    padroes.repeticao && 'repeticao',
    padroes.travessia_travada && 'travessia_travada',
    padroes.integracao_em_curso && 'integracao_em_curso',
    padroes.fechamento_sustentado && 'fechamento_sustentado',
    padroes.aceleracao_instavel && 'aceleracao_instavel',
  ].filter(Boolean) as string[];

  return (
    <Card className="border-border/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          Campos que Continuam Ativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ativos.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Nenhum campo significativo ativo no momento.
          </p>
        ) : (
          <div className="space-y-2">
            {ativos.map(key => {
              const info = PADRAO_LABELS[key];
              if (!info) return null;
              return (
                <div key={key} className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
                  <span className="text-sm mt-0.5">{info.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">{info.label}</p>
                    <p className="text-[10px] text-muted-foreground">{info.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
