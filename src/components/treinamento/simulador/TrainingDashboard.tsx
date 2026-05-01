import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Loader2, 
  Flame, 
  ShieldCheck, 
  Zap,
  Map
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ConversaoCTA } from './ConversaoCTA';

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

interface TrainingProgress {
  streak_days: number;
  activated_districts: string[];
  certification_potential: number;
  casos_concluidos: number;
}

export function TrainingDashboard({ mode = 'formacao' }: { mode?: 'formacao' | 'casa_maquinas' }) {
  const { user } = useAuth();

  const { data: attempts = [], isLoading: isLoadingAttempts } = useQuery({
    queryKey: ['training-dashboard-attempts', user?.id],
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

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['training-dashboard-progress', user?.id],
    queryFn: async (): Promise<TrainingProgress | null> => {
      if (!user) return null;
      const { data } = await supabase
        .from('co_training_progress')
        .select('streak_days, activated_districts, certification_potential, casos_concluidos')
        .eq('user_id', user.id)
        .maybeSingle();
      
      return {
        streak_days: data?.streak_days || 0,
        activated_districts: Array.isArray(data?.activated_districts) ? (data.activated_districts as unknown as string[]) : [],
        certification_potential: data?.certification_potential || 0,
        casos_concluidos: data?.casos_concluidos || 0
      };
    },
    enabled: !!user,
  });

  if (isLoadingAttempts || isLoadingProgress) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <Card className="border-dashed border-border/30 bg-transparent">
        <CardContent className="py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-primary/40" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-serif text-foreground">Sua jornada começa aqui</p>
            <p className="text-sm text-muted-foreground">Complete seu primeiro caso para ativar o dashboard.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const coerenciaMedia = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + (a.score_total || 0), 0) / attempts.length * 100 / 9)
    : 0;

  // Erros mais comuns
  const errosDistrito = attempts.filter(a => (a.score_distrito || 0) === 0);
  const distritosErrados = errosDistrito.reduce<Record<string, number>>((acc, a) => {
    const d = a.resposta_distrito || 'não informado';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const topErros = Object.entries(distritosErrados)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Top Stats: Streak & Potential */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900/50 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{progress?.streak_days} dias</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Streak de Treino</p>
              </div>
            </div>
            {progress?.streak_days && progress.streak_days >= 7 && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">🔥 Consistente</Badge>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-primary/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Potencial para Certificação</p>
              </div>
              <span className="text-sm font-bold text-primary">{progress?.certification_potential}%</span>
            </div>
            <Progress value={progress?.certification_potential} className="h-1.5 bg-primary/10" />
            <p className="text-[9px] text-muted-foreground text-right italic">Baseado em casos concluídos com alta coerência</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/30 bg-transparent">
          <CardContent className="p-3 text-center space-y-1">
            <TrendingUp className="w-4 h-4 mx-auto text-primary" />
            <p className="text-lg font-bold text-foreground">{coerenciaMedia}%</p>
            <p className="text-[9px] text-muted-foreground uppercase">Coerência</p>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-transparent">
          <CardContent className="p-3 text-center space-y-1">
            <Zap className="w-4 h-4 mx-auto text-amber-400" />
            <p className="text-lg font-bold text-foreground">{progress?.casos_concluidos}</p>
            <p className="text-[9px] text-muted-foreground uppercase">Casos</p>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-transparent">
          <CardContent className="p-3 text-center space-y-1">
            <Map className="w-4 h-4 mx-auto text-emerald-400" />
            <p className="text-lg font-bold text-foreground">{progress?.activated_districts.length}/6</p>
            <p className="text-[9px] text-muted-foreground uppercase">Distritos</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion CTA (Dynamic) */}
      {progress?.certification_potential && progress.certification_potential > 60 ? (
        <ConversaoCTA type="desempenho" mode={mode} />
      ) : progress?.streak_days && progress.streak_days >= 7 ? (
        <ConversaoCTA type="streak" mode={mode} />
      ) : topErros.length > 0 ? (
        <ConversaoCTA type="erros" mode={mode} />
      ) : null}

      {/* Activated Districts Chips */}
      {progress?.activated_districts && progress.activated_districts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Distritos Ativados</p>
          <div className="flex flex-wrap gap-2">
            {progress.activated_districts.map(d => (
              <Badge key={d} variant="outline" className="bg-primary/5 border-primary/20 text-primary/80 text-[10px] px-2 py-0.5">
                {d}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Erros frequentes */}
      {topErros.length > 0 && (
        <Card className="border-border/30 bg-zinc-900/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Zonas de Refinamento</p>
            </div>
            <div className="space-y-2">
              {topErros.map(([distrito, count]) => (
                <div key={distrito} className="flex items-center justify-between text-xs">
                  <span className="text-foreground/70">{distrito}</span>
                  <Badge variant="outline" className="text-[9px] text-muted-foreground border-border/20">
                    {count}x inconsistente
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent History */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Práticas Recentes</p>
        <div className="space-y-2">
          {attempts.slice(0, 3).map((a, i) => (
            <Card key={i} className="border-border/10 bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-foreground/80 font-medium">Caso #{a.case_id.slice(0,4)}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      (a.score_total || 0) >= 7 ? 'text-emerald-400' : (a.score_total || 0) >= 4 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {a.score_total || 0}/9
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase">Coerência</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
