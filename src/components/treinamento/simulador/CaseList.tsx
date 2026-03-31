import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { TrainingCase } from './types';

interface Props {
  cases: TrainingCase[];
  getCaseStatus: (id: string) => 'nao_iniciado' | 'em_andamento' | 'concluido';
  onSelectCase: (index: number) => void;
}

const NIVEL_STYLES: Record<string, string> = {
  guiado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  semi_guiado: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  livre: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const NIVEL_LABEL: Record<string, string> = {
  guiado: 'Guiado',
  semi_guiado: 'Semi-guiado',
  livre: 'Livre',
};

const STATUS_CONFIG = {
  nao_iniciado: { icon: Play, label: 'Não iniciado', className: 'text-muted-foreground' },
  em_andamento: { icon: Clock, label: 'Em andamento', className: 'text-amber-400' },
  concluido: { icon: CheckCircle2, label: 'Concluído', className: 'text-emerald-400' },
};

export function CaseList({ cases, getCaseStatus, onSelectCase }: Props) {
  // Group by nivel
  const grouped = cases.reduce<Record<string, { cases: TrainingCase[]; indices: number[] }>>((acc, c, i) => {
    if (!acc[c.nivel]) acc[c.nivel] = { cases: [], indices: [] };
    acc[c.nivel].cases.push(c);
    acc[c.nivel].indices.push(i);
    return acc;
  }, {});

  const nivelOrder = ['guiado', 'semi_guiado', 'livre'];

  return (
    <div className="space-y-6">
      {nivelOrder.map(nivel => {
        const group = grouped[nivel];
        if (!group) return null;
        return (
          <div key={nivel} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] ${NIVEL_STYLES[nivel] || ''}`}>
                {NIVEL_LABEL[nivel] || nivel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {group.cases.length} caso{group.cases.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-2">
              {group.cases.map((c, idx) => {
                const status = getCaseStatus(c.id);
                const StatusIcon = STATUS_CONFIG[status].icon;
                return (
                  <Card
                    key={c.id}
                    className="border-border/30 hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => onSelectCase(group.indices[idx])}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        status === 'concluido' ? 'bg-emerald-500/10' : 'bg-primary/10 group-hover:bg-primary/20'
                      }`}>
                        <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[status].className}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.tema && <span className="text-xs text-muted-foreground">{c.tema}</span>}
                          <span className={`text-[10px] ${STATUS_CONFIG[status].className}`}>
                            {STATUS_CONFIG[status].label}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground/50">
                        {c.signals?.length || 0} sinais
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
