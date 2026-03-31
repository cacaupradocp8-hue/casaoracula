import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, TrendingUp } from 'lucide-react';

interface Props {
  totalCases: number;
  completedCount: number;
  nivelAtual: string | null;
}

const NIVEL_LABEL: Record<string, string> = {
  guiado: 'Guiado',
  semi_guiado: 'Semi-guiado',
  livre: 'Livre',
};

export function ProgressCard({ totalCases, completedCount, nivelAtual }: Props) {
  const pct = totalCases > 0 ? Math.round((completedCount / totalCases) * 100) : 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Seu progresso</p>
            <p className="text-xs text-muted-foreground">
              {completedCount} de {totalCases} caso{totalCases !== 1 ? 's' : ''} concluído{completedCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Progress value={pct} className="h-2 mb-3" />
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{pct}% completo</span>
          </div>
          {nivelAtual && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Nível: {NIVEL_LABEL[nivelAtual] || nivelAtual}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
