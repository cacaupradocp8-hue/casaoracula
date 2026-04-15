import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { MapaVivoEntry } from '@/lib/cabine/motorMapaVivo';

const TIPO_LABELS: Record<string, string> = {
  sessao: 'Sessão',
  movimento: 'Movimento',
  reavaliacao: 'Reavaliação',
};

const ESTADO_SHORT: Record<string, string> = {
  excesso_de_mente: 'Exc. mente',
  repeticao_de_padrao: 'Repetição',
  divisao_interna: 'Divisão',
  desorganizacao_leve: 'Desorg.',
  integracao_emergente: 'Integração',
  ciclo_em_fechamento: 'Fechamento',
  inicio_de_processo: 'Início',
  campo_estavel: 'Estável',
};

interface Props {
  entries: MapaVivoEntry[];
}

export function MapaVivoLinhaJornada({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <Card className="border-border/20 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Movimento da Travessia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-6">
            Nenhum registro ainda. A travessia se formará com as sessões.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          Movimento da Travessia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <div key={entry.id} className="relative pl-6 pb-3 border-l border-border/30 last:border-l-0">
              <div className="absolute left-0 top-0.5 w-2.5 h-2.5 rounded-full bg-primary/60 -translate-x-[5.5px]" />
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(entry.created_at), "dd/MM/yy", { locale: ptBR })}
                </span>
                <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                  {TIPO_LABELS[entry.tipo_registro] || entry.tipo_registro}
                </Badge>
              </div>
              <p className="text-xs text-foreground/90 font-medium">
                {ESTADO_SHORT[entry.estado_campo] || entry.estado_campo}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {entry.direcao_conducao.replace(/_/g, ' ')}
                {entry.ferramenta_utilizada && ` · ${entry.ferramenta_utilizada}`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
