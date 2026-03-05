import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PatternStat {
  id: string;
  pattern_type: string;
  pattern_name: string;
  occurrence_count: number;
  last_seen_at: string;
}

const PATTERN_ICONS: Record<string, string> = {
  district: '🌀',
  tower: '🗼',
  oracle_card: '🃏',
  intervention: '🔧',
  archetype: '🌙',
  tool: '⚙️',
};

const PATTERN_LABELS: Record<string, string> = {
  district: 'Distrito',
  tower: 'Torre',
  oracle_card: 'Carta',
  intervention: 'Intervenção',
  archetype: 'Arquétipo',
  tool: 'Ferramenta',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: 'border-[#556B57]/30 text-[#556B57]',
  medium: 'border-[#C9A24A]/30 text-[#C9A24A]',
  high: 'border-red-500/30 text-red-400',
};

function getSeverity(count: number): string {
  if (count >= 5) return 'high';
  if (count >= 3) return 'medium';
  return 'low';
}

function getPatternMessage(stat: PatternStat): string {
  const { pattern_type, pattern_name, occurrence_count } = stat;
  if (pattern_type === 'district') {
    return `O distrito ${pattern_name} foi visitado ${occurrence_count} vezes nesta jornada.`;
  }
  if (pattern_type === 'tower') {
    return `A Torre ${pattern_name} apareceu ${occurrence_count} vezes.`;
  }
  if (pattern_type === 'oracle_card') {
    return occurrence_count >= 3
      ? `Esta carta continua retornando nesta jornada.`
      : `A carta ${pattern_name} apareceu ${occurrence_count} vezes.`;
  }
  if (pattern_type === 'intervention') {
    return `A intervenção "${pattern_name}" foi aplicada ${occurrence_count} vezes.`;
  }
  if (pattern_type === 'archetype') {
    return `O arquétipo ${pattern_name} foi ativado ${occurrence_count} vezes.`;
  }
  return `${pattern_name} apareceu ${occurrence_count} vezes.`;
}

export function SinaisDaJornada({ clienteId }: { clienteId: string }) {
  const [patterns, setPatterns] = useState<PatternStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatterns();
  }, [clienteId]);

  const loadPatterns = async () => {
    const { data } = await supabase
      .from('client_pattern_stats')
      .select('*')
      .eq('client_id', clienteId)
      .order('occurrence_count', { ascending: false });

    setPatterns((data as PatternStat[]) || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" />
      </div>
    );
  }

  const alerts = patterns.filter((p) => p.occurrence_count >= 3).slice(0, 5);
  const districtStats = patterns
    .filter((p) => p.pattern_type === 'district')
    .map((p) => ({ name: p.pattern_name, sessões: p.occurrence_count }));

  const chartConfig = {
    sessões: { label: 'Sessões', color: '#C9A24A' },
  };

  return (
    <div className="space-y-6">
      {/* Aviso ético */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C9A24A]/15 bg-[#C9A24A]/5 text-[11px] text-[#F5F1E8]/50">
        <AlertTriangle className="w-3.5 h-3.5 text-[#C9A24A]/60 shrink-0" />
        Memória de padrões — apresenta recorrências, não interpretações clínicas.
      </div>

      {/* Sinais da Jornada */}
      {alerts.length > 0 && (
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#C9A24A] font-medium">
              Sinais da Jornada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((stat) => {
              const severity = getSeverity(stat.occurrence_count);
              return (
                <div
                  key={stat.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border bg-[#0B1B2B]/40 ${SEVERITY_COLORS[severity].split(' ')[0]}`}
                >
                  <span className="text-lg mt-0.5">
                    {PATTERN_ICONS[stat.pattern_type] || '📌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#F5F1E8]/80">
                        {stat.pattern_name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] ${SEVERITY_COLORS[severity]}`}
                      >
                        {stat.occurrence_count}×
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-[#F5F1E8]/10 text-[#F5F1E8]/30"
                      >
                        {PATTERN_LABELS[stat.pattern_type]}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#F5F1E8]/50">
                      {getPatternMessage(stat)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Gráfico de frequência de distritos */}
      {districtStats.length > 0 && (
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#C9A24A] font-medium">
              Frequência de Distritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={districtStats} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(201,162,74,0.1)"
                />
                <XAxis type="number" tick={{ fill: '#F5F1E8', opacity: 0.4, fontSize: 10 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fill: '#F5F1E8', opacity: 0.6, fontSize: 10 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessões" fill="#C9A24A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Todos os padrões */}
      {patterns.length > 0 && (
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#F5F1E8]/60 font-medium">
              Todos os Padrões Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {patterns.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center gap-2 p-2 rounded border border-[#C9A24A]/5 bg-[#0B1B2B]/30"
                >
                  <span className="text-sm">
                    {PATTERN_ICONS[stat.pattern_type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-[#F5F1E8]/70 truncate">
                      {stat.pattern_name}
                    </p>
                    <p className="text-[9px] text-[#F5F1E8]/30">
                      {stat.occurrence_count}× · {PATTERN_LABELS[stat.pattern_type]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {patterns.length === 0 && (
        <p className="text-center text-[#F5F1E8]/30 py-10 text-sm">
          Nenhum padrão registrado ainda.
        </p>
      )}
    </div>
  );
}
