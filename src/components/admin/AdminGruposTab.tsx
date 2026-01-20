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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Loader2, 
  Users, 
  Archive, 
  FolderOpen,
  Eye,
  UserPlus 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TherapeuticGroup {
  id: string;
  therapist_id: string;
  nome: string;
  descricao: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  terapeuta_nome?: string;
  terapeuta_email?: string;
  participant_count?: number;
}

interface GroupParticipant {
  id: string;
  cliente_id: string;
  cliente_nome?: string;
  cliente_email?: string;
  ativo: boolean;
  joined_at: string;
}

export function AdminGruposTab() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<TherapeuticGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [selectedGroup, setSelectedGroup] = useState<TherapeuticGroup | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('therapeutic_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupsError) {
        console.error('Erro ao carregar grupos:', groupsError);
        toast({ title: 'Erro ao carregar grupos', description: groupsError.message, variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email');

      const usersMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Get participant counts
      const { data: participantCounts } = await supabase
        .from('group_participants')
        .select('group_id')
        .eq('ativo', true);

      const countMap = new Map<string, number>();
      participantCounts?.forEach(p => {
        countMap.set(p.group_id, (countMap.get(p.group_id) || 0) + 1);
      });

      const enrichedGroups = (groupsData || []).map(g => ({
        ...g,
        terapeuta_nome: usersMap.get(g.therapist_id)?.nome || 'Desconhecido',
        terapeuta_email: usersMap.get(g.therapist_id)?.email || '',
        participant_count: countMap.get(g.id) || 0,
      }));

      setGroups(enrichedGroups as TherapeuticGroup[]);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({ title: 'Erro inesperado', variant: 'destructive' });
    }

    setLoading(false);
  };

  const fetchParticipants = async (groupId: string) => {
    setParticipantsLoading(true);
    
    const { data: participantsData, error } = await supabase
      .from('group_participants')
      .select('*')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao carregar participantes', variant: 'destructive' });
      setParticipantsLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nome, email');

    const usersMap = new Map(profiles?.map(p => [p.id, p]) || []);

    const enrichedParticipants = (participantsData || []).map(p => ({
      ...p,
      cliente_nome: usersMap.get(p.cliente_id)?.nome || 'Desconhecido',
      cliente_email: usersMap.get(p.cliente_id)?.email || '',
    }));

    setParticipants(enrichedParticipants);
    setParticipantsLoading(false);
  };

  const updateGroupStatus = async (groupId: string, status: 'active' | 'archived') => {
    const { error } = await supabase
      .from('therapeutic_groups')
      .update({ status })
      .eq('id', groupId);

    if (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
      return;
    }

    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, status } : g));
    toast({ title: status === 'archived' ? 'Grupo arquivado' : 'Grupo reativado' });
  };

  const toggleParticipantStatus = async (participantId: string, ativo: boolean) => {
    const { error } = await supabase
      .from('group_participants')
      .update({ ativo })
      .eq('id', participantId);

    if (error) {
      toast({ title: 'Erro ao atualizar participante', variant: 'destructive' });
      return;
    }

    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, ativo } : p));
    toast({ title: ativo ? 'Participante ativado' : 'Participante desativado' });
  };

  const openParticipantsDialog = (group: TherapeuticGroup) => {
    setSelectedGroup(group);
    fetchParticipants(group.id);
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = 
      g.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.terapeuta_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: groups.length,
    active: groups.filter(g => g.status === 'active').length,
    archived: groups.filter(g => g.status === 'archived').length,
    totalParticipants: groups.reduce((acc, g) => acc + (g.participant_count || 0), 0),
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
            <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total de Grupos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FolderOpen className="w-6 h-6 mx-auto mb-2 text-green-500" />
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
            <UserPlus className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-display font-bold">{stats.totalParticipants}</p>
            <p className="text-xs text-muted-foreground">Participantes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou terapeuta..."
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
          <CardTitle className="text-lg">Grupos Terapêuticos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum grupo encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Terapeuta</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{g.nome}</p>
                        {g.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{g.descricao}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{g.terapeuta_nome}</p>
                        <p className="text-xs text-muted-foreground">{g.terapeuta_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{g.participant_count || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={g.status === 'active' ? 'default' : 'secondary'}>
                        {g.status === 'active' ? 'Ativo' : 'Arquivado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(g.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openParticipantsDialog(g)}
                          title="Ver participantes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateGroupStatus(g.id, g.status === 'active' ? 'archived' : 'active')}
                          title={g.status === 'active' ? 'Arquivar' : 'Reativar'}
                        >
                          {g.status === 'active' ? (
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

      {/* Participants Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Participantes: {selectedGroup?.nome}
            </DialogTitle>
          </DialogHeader>
          
          {participantsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Nenhum participante neste grupo</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Entrou em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.cliente_nome}</TableCell>
                    <TableCell>{p.cliente_email}</TableCell>
                    <TableCell>
                      {format(new Date(p.joined_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={p.ativo ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => toggleParticipantStatus(p.id, !p.ativo)}
                      >
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
