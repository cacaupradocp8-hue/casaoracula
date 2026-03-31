import { Card, CardContent } from '@/components/ui/card';
import { Target, Brain, Wrench, Award } from 'lucide-react';
import { ScoreBreakdown } from './scoringEngine';

interface Props {
  score: ScoreBreakdown;
}

function ScoreItem({ icon: Icon, label, value, max }: { icon: React.ElementType; label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
  const bg = pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </div>
        <span className={`text-xs font-medium ${color}`}>{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div className={`h-full ${bg} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ScoreDisplay({ score }: Props) {
  const pctTotal = Math.round((score.total / 9) * 100);
  const color = pctTotal >= 70 ? 'text-emerald-400' : pctTotal >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <Card className="border-border/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pontuação Clínica</p>
          </div>
          <span className={`text-lg font-bold ${color}`}>{score.total}<span className="text-xs text-muted-foreground font-normal">/9</span></span>
        </div>

        <div className="space-y-2">
          <ScoreItem icon={Target} label="Distrito" value={score.distrito} max={3} />
          <ScoreItem icon={Brain} label="Hipótese" value={score.hipotese} max={3} />
          <ScoreItem icon={Wrench} label="Ferramenta" value={score.ferramenta} max={3} />
        </div>
      </CardContent>
    </Card>
  );
}
