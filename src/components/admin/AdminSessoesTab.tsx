import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Loader2, 
  FolderOpen, 
  Archive, 
  Clock, 
  Users,
  Eye 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCase {
  id: string;
  therapist_id: string;
  client_id: string;
  title: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  terapeuta_nome?: string;
  terapeuta_email?: string;
  cliente_nome?: string;
  cliente_email?: string;
}

export function AdminSessoesTab() {
  const { toast } = useToast();
  const [cases, setCases] = useState<SessionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: casesData, error: casesError } = await supabase
        .from('session_cases')
        .select('*')
        .order('updated_at', { ascending: false });

      if (casesError) {
        console.error('Erro ao carregar casos:', casesError);
        toast({ title: 'Erro ao carregar casos', description: casesError.message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email');

      if (profilesError) {
        console.error('Erro ao carregar perfis:', profilesError);
      }

      const usersMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedCases = (casesData || []).map(c => ({
        ...c,
        terapeuta_nome: usersMap.get(c.therapist_id)?.nome || 'Desconhecido',
        terapeuta_email: usersMap.get(c.therapist_id)?.email || '',
        cliente_nome: usersMap.get(c.client_id)?.nome || 'Desconhecido',
        cliente_email: usersMap.get(c.client_id)?.email || '',
      }));

      setCases(enrichedCases as SessionCase[]);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    }

    setLoading(false);
  };

  const updateStatus = async (caseId: string, status: 'active' | 'archived') => {
    const { error } = await supabase
      .from('session_cases')
      .update({ status })
      .eq('id', caseId);

    if (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
      return;
    }

    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
    toast({ title: status === 'archived' ? 'Caso arquivado' : 'Caso reativado' });
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.terapeuta_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'active').length,
    archived: cases.filter(c => c.status === 'archived').length,
    therapists: new Set(cases.map(c => c.therapist_id)).size,
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
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FolderOpen className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total de Casos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-display font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Archive className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{stats.archived}</p>
            <p className="text-xs text-muted-foreground">Arquivados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-display font-bold">{stats.therapists}</p>
            <p className="text-xs text-muted-foreground">Terapeutas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, terapeuta ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Casos de Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum caso encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Terapeuta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{c.terapeuta_nome}</p>
                        <p className="text-xs text-muted-foreground">{c.terapeuta_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{c.cliente_nome}</p>
                        <p className="text-xs text-muted-foreground">{c.cliente_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>
                        {c.status === 'active' ? 'Ativo' : 'Arquivado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(c.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/session-room/${c.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatus(c.id, c.status === 'active' ? 'archived' : 'active')}
                        >
                          {c.status === 'active' ? (
                            <Archive className="w-4 h-4" />
                          ) : (
                            <FolderOpen className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
