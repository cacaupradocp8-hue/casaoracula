import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Loader2,
  GraduationCap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Formacao {
  id: string;
  titulo: string;
  status: string;
}

interface AlunaProgresso {
  user_id: string;
  nome: string | null;
  email: string | null;
  portal: string;
  formacao_id: string;
  formacao_titulo: string;
  total_modulos: number;
  modulos_concluidos: number;
  percentual: number;
  ultima_atividade: string | null;
}

export function AdminProgressoTab() {
  const { toast } = useToast();
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [progresso, setProgresso] = useState<AlunaProgresso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormacao, setFilterFormacao] = useState<string>('todas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch formações
    const { data: formData } = await supabase
      .from('formacoes')
      .select('id, titulo, status')
      .order('ordem');

    setFormacoes(formData || []);

    // Fetch all progress with user info
    const { data: progressData, error } = await supabase
      .from('progresso_aluna')
      .select(`
        user_id,
        formacao_id,
        modulo_id,
        status,
        completed_at
      `)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar progresso:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Fetch profiles for user info
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nome, email');

    // Fetch user_roles for portal info
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, portal');

    // Fetch modulos count per formacao
    const { data: modulos } = await supabase
      .from('formacao_modulos')
      .select('id, formacao_id');

    // Aggregate data by user + formacao
    const aggregated: Record<string, AlunaProgresso> = {};

    (progressData || []).forEach(p => {
      const key = `${p.user_id}-${p.formacao_id}`;
      const profile = profiles?.find(pr => pr.id === p.user_id);
      const role = roles?.find(r => r.user_id === p.user_id);
      const formacao = formData?.find(f => f.id === p.formacao_id);
      const totalModulos = modulos?.filter(m => m.formacao_id === p.formacao_id).length || 0;

      if (!aggregated[key]) {
        aggregated[key] = {
          user_id: p.user_id,
          nome: profile?.nome || null,
          email: profile?.email || null,
          portal: role?.portal || 'visitante',
          formacao_id: p.formacao_id,
          formacao_titulo: formacao?.titulo || 'Formação',
          total_modulos: totalModulos,
          modulos_concluidos: 0,
          percentual: 0,
          ultima_atividade: null,
        };
      }

      if (p.status === 'concluido') {
        aggregated[key].modulos_concluidos++;
      }

      if (p.completed_at) {
        if (!aggregated[key].ultima_atividade || p.completed_at > aggregated[key].ultima_atividade!) {
          aggregated[key].ultima_atividade = p.completed_at;
        }
      }
    });

    // Calculate percentages
    Object.values(aggregated).forEach(a => {
      if (a.total_modulos > 0) {
        a.percentual = Math.round((a.modulos_concluidos / a.total_modulos) * 100);
      }
    });

    setProgresso(Object.values(aggregated));
    setLoading(false);
  };

  const filteredProgresso = progresso.filter(p => {
    const matchesSearch = 
      !searchTerm ||
      p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFormacao = 
      filterFormacao === 'todas' || 
      p.formacao_id === filterFormacao;

    return matchesSearch && matchesFormacao;
  });

  const getPortalBadge = (portal: string) => {
    switch (portal) {
      case 'visitante':
        return <Badge variant="outline">Visitante</Badge>;
      case 'pre_iniciada':
        return <Badge variant="secondary">Pré-Iniciada</Badge>;
      case 'iniciada':
        return <Badge className="bg-gold text-black">Iniciada</Badge>;
      case 'admin':
        return <Badge className="bg-purple-600">Admin</Badge>;
      default:
        return <Badge variant="outline">{portal}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Progresso das Alunas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterFormacao} onValueChange={setFilterFormacao}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por formação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as formações</SelectItem>
                {formacoes.map(f => (
                  <SelectItem key={f.id} value={f.id}>{f.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProgresso.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {progresso.length === 0 
                  ? 'Nenhum progresso registrado ainda.'
                  : 'Nenhum resultado encontrado para os filtros aplicados.'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluna</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Formação</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Última Atividade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgresso.map((item, index) => (
                  <TableRow key={`${item.user_id}-${item.formacao_id}-${index}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.nome || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPortalBadge(item.portal)}</TableCell>
                    <TableCell>{item.formacao_titulo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Progress value={item.percentual} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12">
                          {item.percentual}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.modulos_concluidos}/{item.total_modulos} módulos
                      </p>
                    </TableCell>
                    <TableCell>
                      {item.ultima_atividade ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(item.ultima_atividade), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(progresso.map(p => p.user_id)).size}</p>
                <p className="text-sm text-muted-foreground">Alunas com progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {progresso.filter(p => p.percentual === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Formações completas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(progresso.reduce((acc, p) => acc + p.percentual, 0) / (progresso.length || 1))}%
                </p>
                <p className="text-sm text-muted-foreground">Média de conclusão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
