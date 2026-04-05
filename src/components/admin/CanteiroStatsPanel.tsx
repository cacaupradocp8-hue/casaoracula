import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sprout, Users, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CanteiroGlobalStats {
  total_registros_jardim: number;
  usuarias_ativas_jardim: number;
  total_publicacoes_canteiro: number;
  publicacoes_aprovadas: number;
  publicacoes_rejeitadas: number;
  usuarias_que_publicaram: number;
  publicacoes_ultimos_30_dias: number;
  registros_jardim_ultimos_30_dias: number;
}

interface CanteiroStudentRow {
  user_id: string;
  nome: string | null;
  email: string | null;
  total_publicacoes: number;
  em_curadoria: number;
  publicadas: number;
  recusadas: number;
  ultimo_compartilhamento: string | null;
}

export function CanteiroStatsPanel() {
  const [globalStats, setGlobalStats] = useState<CanteiroGlobalStats | null>(null);
  const [perStudent, setPerStudent] = useState<CanteiroStudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [globalRes, studentRes] = await Promise.all([
        supabase.from('v_canteiro_admin_stats').select('*').single(),
        supabase.from('v_canteiro_per_student_stats' as any).select('*').order('total_publicacoes', { ascending: false }).limit(50),
      ]);
      if (globalRes.data) setGlobalStats(globalRes.data as unknown as CanteiroGlobalStats);
      if (studentRes.data) setPerStudent(studentRes.data as unknown as CanteiroStudentRow[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!globalStats) return null;

  const participationRate = globalStats.usuarias_ativas_jardim > 0
    ? Math.round((globalStats.usuarias_que_publicaram / globalStats.usuarias_ativas_jardim) * 100)
    : 0;

  const emCuradoria = globalStats.total_publicacoes_canteiro - globalStats.publicacoes_aprovadas - globalStats.publicacoes_rejeitadas;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sprout className="w-5 h-5 text-primary" />
        Atividade no Canteiro
      </h3>

      {/* Global metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatMini icon={Sprout} label="Publicações (30d)" value={globalStats.publicacoes_ultimos_30_dias} />
        <StatMini icon={Users} label="Participação" value={`${participationRate}%`} sub={`${globalStats.usuarias_que_publicaram} de ${globalStats.usuarias_ativas_jardim}`} />
        <StatMini icon={CheckCircle2} label="Aprovadas" value={globalStats.publicacoes_aprovadas} />
        <StatMini icon={Clock} label="Em curadoria" value={emCuradoria} />
      </div>

      {/* Status breakdown */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          Em curadoria: {emCuradoria}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Publicadas: {globalStats.publicacoes_aprovadas}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
          Recusadas: {globalStats.publicacoes_rejeitadas}
        </Badge>
      </div>

      {/* Per-student table */}
      {perStudent.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participação por aluna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluna</TableHead>
                  <TableHead className="text-center">Publicações</TableHead>
                  <TableHead className="text-center">Aprovadas</TableHead>
                  <TableHead className="text-center">Recusadas</TableHead>
                  <TableHead>Último compartilhamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perStudent.map(s => (
                  <TableRow key={s.user_id}>
                    <TableCell>
                      <p className="font-medium text-sm">{s.nome || 'Sem nome'}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </TableCell>
                    <TableCell className="text-center font-medium">{s.total_publicacoes}</TableCell>
                    <TableCell className="text-center">{s.publicadas}</TableCell>
                    <TableCell className="text-center">{s.recusadas}</TableCell>
                    <TableCell>
                      {s.ultimo_compartilhamento ? (
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(s.ultimo_compartilhamento), { addSuffix: true, locale: ptBR })}
                        </span>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatMini({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
