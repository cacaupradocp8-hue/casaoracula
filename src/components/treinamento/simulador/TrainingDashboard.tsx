import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, AlertTriangle, Target, Loader2 } from 'lucide-react';

interface AttemptData {
  score_total: number;
  score_distrito: number;
  score_hipotese: number;
  score_ferramenta: number;
  resposta_distrito: string;
  resposta_ferramenta: string;
  feedback_final: string | null;
  created_at: string;
  case_id: string;
}

export function TrainingDashboard() {
  const { user } = useAuth();

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ['training-dashboard', user?.id],
    queryFn: async (): Promise<AttemptData[]> => {
      if (!user) return [];
      const { data } = await supabase
        .from('co_training_attempts')
        .select('score_total, score_distrito, score_hipotese, score_ferramenta, resposta_distrito, resposta_ferramenta, feedback_final, created_at, case_id')
        .eq('user_id', user.id)
        .eq('status', 'concluido')
        .order('created_at', { ascending: false });
      return (data || []) as AttemptData[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <Card className="border-dashed border-border/30">
        <CardContent className="py-8 text-center">
          <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Complete casos para ver seu progresso aqui.</p>
        </CardContent>
      </Card>
    );
  }

  const coerenciaMedia = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + (a.score_total || 0), 0) / attempts.length * 100 / 9)
    : 0;

  const taxaDistrito = attempts.length > 0
    ? Math.round(attempts.filter(a => (a.score_distrito || 0) === 3).length / attempts.length * 100)
    : 0;

  const taxaFerramenta = attempts.length > 0
    ? Math.round(attempts.filter(a => (a.score_ferramenta || 0) === 3).length / attempts.length * 100)
    : 0;

  // Erros mais comuns (distritos errados)
  const errosDistrito = attempts.filter(a => (a.score_distrito || 0) === 0);
  const distritosErrados = errosDistrito.reduce<Record<string, number>>((acc, a) => {
    const d = a.resposta_distrito || 'não informado';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const topErros = Object.entries(distritosErrados)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/30">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{coerenciaMedia}%</p>
            <p className="text-[10px] text-muted-foreground">Coerência média</p>
          </CardContent>
        </Card>
        <Card className="border-border/30">
          <CardContent className="p-3 text-center">
            <Target className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <p className="text-lg font-bold text-foreground">{taxaDistrito}%</p>
            <p className="text-[10px] text-muted-foreground">Acerto distrito</p>
          </CardContent>
        </Card>
        <Card className="border-border/30">
          <CardContent className="p-3 text-center">
            <BarChart3 className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <p className="text-lg font-bold text-foreground">{taxaFerramenta}%</p>
            <p className="text-[10px] text-muted-foreground">Acerto ferramenta</p>
          </CardContent>
        </Card>
      </div>

      {topErros.length > 0 && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Erros mais frequentes</p>
            </div>
            {topErros.map(([distrito, count]) => (
              <div key={distrito} className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">{distrito}</span>
                <span className="text-xs text-muted-foreground">{count}x escolhido incorretamente</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/30">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Histórico recente</p>
          <div className="space-y-2">
            {attempts.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-border/10 pb-1.5 last:border-0">
                <span className="text-foreground/70 text-xs">{new Date(a.created_at).toLocaleDateString('pt-BR')}</span>
                <span className={`text-xs font-medium ${
                  (a.score_total || 0) >= 7 ? 'text-emerald-400' : (a.score_total || 0) >= 4 ? 'text-amber-400' : 'text-red-400'
                }`}>{a.score_total || 0}/9</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
