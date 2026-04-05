import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Loader2,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Activity,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudentProgress {
  user_id: string;
  nome: string | null;
  email: string | null;
  portal: string | null;
  current_track: string;
  progress_percent: number;
  lessons_completed: number;
  practices_started: number;
  practices_completed: number;
  questions_to_ai_count: number;
  reflections_count: number;
  training_cases_completed: number;
  last_access_at: string | null;
  engagement_level: string;
  consistency_pattern: string;
  current_bottleneck: string | null;
  learning_pattern: string | null;
  pedagogical_signal: string | null;
  suggested_next_step: string | null;
  ready_for_next_step: boolean;
}

interface LearningEvent {
  id: string;
  context_area: string;
  action_type: string;
  object_type: string | null;
  object_id: string | null;
  metadata_short: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminAlunaAcompanhamento() {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEngagement, setFilterEngagement] = useState('todos');
  const [filterConsistency, setFilterConsistency] = useState('todos');
  const [filterSignal, setFilterSignal] = useState('todos');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [studentEvents, setStudentEvents] = useState<LearningEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('v_student_tracking')
      .select('*')
      .order('last_access_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar alunas:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } else {
      setStudents((data as unknown as StudentProgress[]) || []);
    }
    setLoading(false);
  };

  const refreshAllProgress = async () => {
    setRefreshing(true);
    // Get all user_ids from events
    const { data: userIds } = await supabase
      .from('student_learning_events')
      .select('user_id')
      .limit(1000);

    const uniqueIds = [...new Set(userIds?.map(u => u.user_id) || [])];

    for (const uid of uniqueIds) {
      await supabase.rpc('refresh_student_progress', { _user_id: uid });
    }

    await fetchStudents();
    setRefreshing(false);
    toast({ title: 'Progresso atualizado' });
  };

  const openStudentDetail = async (student: StudentProgress) => {
    setSelectedStudent(student);
    setEventsLoading(true);
    const { data } = await supabase
      .from('student_learning_events')
      .select('*')
      .eq('user_id', student.user_id)
      .order('created_at', { ascending: false })
      .limit(50);
    setStudentEvents((data as unknown as LearningEvent[]) || []);
    setEventsLoading(false);
  };

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !searchTerm ||
        s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEngagement = filterEngagement === 'todos' || s.engagement_level === filterEngagement;
      const matchesConsistency = filterConsistency === 'todos' || s.consistency_pattern === filterConsistency;
      const matchesSignal = filterSignal === 'todos' ||
        (filterSignal === 'risco' && s.pedagogical_signal?.includes('risco')) ||
        (filterSignal === 'pronta' && s.ready_for_next_step) ||
        (filterSignal === 'estagnacao' && s.pedagogical_signal?.includes('estagnação'));
      return matchesSearch && matchesEngagement && matchesConsistency && matchesSignal;
    });
  }, [students, searchTerm, filterEngagement, filterConsistency, filterSignal]);

  // Stats
  const totalActive = students.length;
  const atRisk = students.filter(s => s.pedagogical_signal?.includes('risco') || s.pedagogical_signal?.includes('abandono')).length;
  const consistent = students.filter(s => s.consistency_pattern === 'consistente').length;
  const readyNext = students.filter(s => s.ready_for_next_step).length;

  const getEngagementBadge = (level: string) => {
    switch (level) {
      case 'alto': return <Badge className="bg-green-600 text-white">Alto</Badge>;
      case 'medio': return <Badge className="bg-amber-500 text-white">Médio</Badge>;
      case 'baixo': return <Badge variant="destructive">Baixo</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getConsistencyBadge = (pattern: string) => {
    switch (pattern) {
      case 'consistente': return <Badge className="bg-green-600 text-white">Consistente</Badge>;
      case 'ocasional': return <Badge className="bg-amber-500 text-white">Ocasional</Badge>;
      case 'interrompido': return <Badge variant="destructive">Interrompido</Badge>;
      default: return <Badge variant="outline">{pattern}</Badge>;
    }
  };

  const getSignalIcon = (signal: string | null) => {
    if (!signal) return null;
    if (signal.includes('risco') || signal.includes('abandono')) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (signal.includes('consistente') || signal.includes('avançar')) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (signal.includes('estagnação')) return <Clock className="w-4 h-4 text-amber-500" />;
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7" />
            Acompanhamento das Alunas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Leitura pedagógica da jornada formativa
          </p>
        </div>
        <Button onClick={refreshAllProgress} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar métricas
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalActive}</p>
              <p className="text-xs text-muted-foreground">Alunas ativas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{atRisk}</p>
              <p className="text-xs text-muted-foreground">Risco de abandono</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{consistent}</p>
              <p className="text-xs text-muted-foreground">Consistentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readyNext}</p>
              <p className="text-xs text-muted-foreground">Prontas p/ avançar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEngagement} onValueChange={setFilterEngagement}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Engajamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="baixo">Baixo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterConsistency} onValueChange={setFilterConsistency}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Consistência" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="consistente">Consistente</SelectItem>
                <SelectItem value="ocasional">Ocasional</SelectItem>
                <SelectItem value="interrompido">Interrompido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSignal} onValueChange={setFilterSignal}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sinal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="risco">Risco</SelectItem>
                <SelectItem value="pronta">Pronta p/ avançar</SelectItem>
                <SelectItem value="estagnacao">Estagnação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Lista de Alunas ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Nenhuma aluna encontrada com os filtros atuais.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluna</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead>Consistência</TableHead>
                  <TableHead>Sinal Pedagógico</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.user_id} className="cursor-pointer hover:bg-muted/50" onClick={() => openStudentDetail(s)}>
                    <TableCell>
                      <p className="font-medium">{s.nome || 'Sem nome'}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </TableCell>
                    <TableCell>{getEngagementBadge(s.engagement_level)}</TableCell>
                    <TableCell>{getConsistencyBadge(s.consistency_pattern)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getSignalIcon(s.pedagogical_signal)}
                        <span className="text-sm">{s.pedagogical_signal || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {s.last_access_at ? (
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(s.last_access_at), { addSuffix: true, locale: ptBR })}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={open => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {selectedStudent.nome || selectedStudent.email}
                </DialogTitle>
              </DialogHeader>

              {/* Progress blocks */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <MetricCard icon={BookOpen} label="Aulas concluídas" value={selectedStudent.lessons_completed} />
                <MetricCard icon={Target} label="Práticas concluídas" value={`${selectedStudent.practices_completed}/${selectedStudent.practices_started}`} />
                <MetricCard icon={Brain} label="Perguntas à IA" value={selectedStudent.questions_to_ai_count} />
                <MetricCard icon={Activity} label="Reflexões" value={selectedStudent.reflections_count} />
              </div>

              {/* Signals */}
              <div className="space-y-3 mt-4">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Sinal Pedagógico</p>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(selectedStudent.pedagogical_signal)}
                    <span className="font-medium">{selectedStudent.pedagogical_signal || 'Sem sinal'}</span>
                  </div>
                </div>
                {selectedStudent.suggested_next_step && (
                  <div className="p-3 rounded-lg border bg-primary/5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Próximo Passo Recomendado</p>
                    <p className="font-medium">{selectedStudent.suggested_next_step}</p>
                  </div>
                )}
                {selectedStudent.current_bottleneck && (
                  <div className="p-3 rounded-lg border bg-destructive/5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ponto de Travamento</p>
                    <p className="font-medium">{selectedStudent.current_bottleneck}</p>
                  </div>
                )}
              </div>

              {/* Event Timeline */}
              <div className="mt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Eventos Recentes
                </h4>
                {eventsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin" /></div>
                ) : studentEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento registrado.</p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {studentEvents.map(ev => (
                      <div key={ev.id} className="flex items-start gap-3 p-2 rounded border bg-muted/20 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {ev.action_type} {ev.object_type ? `— ${ev.object_type}` : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">{ev.context_area}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(ev.created_at), "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
