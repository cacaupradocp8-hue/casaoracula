import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart3, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Map as MapIcon,
  MessageSquare,
  Filter,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeedbackData {
  id: string;
  created_at: string;
  utilidade: 'Muito útil' | 'Parcialmente útil' | 'Pouco útil';
  observacao: string | null;
  territorios: string[];
}

export function AdminConducaoFeedbackTab() {
  const [filterTerritory, setFilterTerritory] = useState<string>('all');

  const { data: feedbacks = [], isLoading, refetch } = useQuery<FeedbackData[]>({
    queryKey: ['admin-conducao-feedbacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conducao_clinica_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FeedbackData[];
    }
  });

  const stats = {
    total: feedbacks.length,
    muitoUtil: feedbacks.filter(f => f.utilidade === 'Muito útil').length,
    parcialmenteUtil: feedbacks.filter(f => f.utilidade === 'Parcialmente útil').length,
    poucoUtil: feedbacks.filter(f => f.utilidade === 'Pouco útil').length,
  };

  const utilityToScore = {
    'Muito útil': 3,
    'Parcialmente útil': 2,
    'Pouco útil': 1
  };

  // Grouping by territory
  const territoryStats: Record<string, { count: number; totalScore: number; observations: string[] }> = {};

  feedbacks.forEach(f => {
    f.territorios.forEach(t => {
      if (!territoryStats[t]) {
        territoryStats[t] = { count: 0, totalScore: 0, observations: [] };
      }
      territoryStats[t].count += 1;
      territoryStats[t].totalScore += utilityToScore[f.utilidade];
      if (f.observacao) {
        territoryStats[t].observations.push(f.observacao);
      }
    });
  });

  const sortedTerritories = Object.entries(territoryStats).sort((a, b) => b[1].count - a[1].count);

  const exportToCSV = () => {
    if (feedbacks.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    const headers = ["Data", "Utilidade", "Territorios", "Observacao"];
    const rows = feedbacks.map(f => [
      new Date(f.created_at).toLocaleDateString(),
      f.utilidade,
      f.territorios.join('; '),
      (f.observacao || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => `"${row.join('","')}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `feedbacks_conducao_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportação concluída");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif text-foreground">Aprendizagem da Condução Clínica</h3>
          <p className="text-sm text-muted-foreground">Validação da camada simbólica pela equipe da Casa Orácula</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="default" size="sm" onClick={exportToCSV} className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total de Feedbacks" 
          value={stats.total} 
          icon={<BarChart3 className="h-4 w-4 text-primary" />} 
        />
        <MetricCard 
          title="Muito Útil" 
          value={stats.muitoUtil} 
          icon={<ThumbsUp className="h-4 w-4 text-emerald-500" />} 
          percentage={stats.total > 0 ? Math.round((stats.muitoUtil / stats.total) * 100) : 0}
        />
        <MetricCard 
          title="Parcialmente Útil" 
          value={stats.parcialmenteUtil} 
          icon={<HelpCircle className="h-4 w-4 text-amber-500" />} 
          percentage={stats.total > 0 ? Math.round((stats.parcialmenteUtil / stats.total) * 100) : 0}
        />
        <MetricCard 
          title="Pouco Útil" 
          value={stats.poucoUtil} 
          icon={<ThumbsDown className="h-4 w-4 text-red-500" />} 
          percentage={stats.total > 0 ? Math.round((stats.poucoUtil / stats.total) * 100) : 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agrupamento por Território */}
        <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Métricas por Território
            </CardTitle>
            <CardDescription>Uso e utilidade por distrito da CidadELA</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedTerritories.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground italic">
                Aguardando os primeiros feedbacks de território.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Território</TableHead>
                    <TableHead className="text-center">Utilizações</TableHead>
                    <TableHead className="text-right">Avaliação Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTerritories.map(([name, data]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="text-center">{data.count}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={cn(
                          "font-mono",
                          (data.totalScore / data.count) >= 2.5 ? "border-emerald-500/50 text-emerald-500" :
                          (data.totalScore / data.count) >= 1.5 ? "border-amber-500/50 text-amber-500" :
                          "border-red-500/50 text-red-500"
                        )}>
                          {(data.totalScore / data.count).toFixed(1)} / 3.0
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Observações Livres */}
        <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              "O que faltou nesta leitura?"
            </CardTitle>
            <CardDescription>Aprendizados e observações agrupadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {sortedTerritories.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground italic">
                  Nenhuma observação registrada ainda.
                </div>
              ) : (
                sortedTerritories.map(([name, data]) => (
                  data.observations.length > 0 && (
                    <div key={name} className="space-y-2">
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                        {name}
                      </Badge>
                      <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                        {data.observations.map((obs, i) => (
                          <div key={i} className="text-xs bg-muted/30 p-2 rounded italic text-foreground/80">
                            "{obs}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, percentage }: { title: string, value: string | number, icon: React.ReactNode, percentage?: number }) {
  return (
    <Card className="bg-card/60 border-primary/10">
      <CardContent className="p-4 pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          {icon}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {percentage !== undefined && (
            <span className="text-xs text-muted-foreground">({percentage}%)</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
