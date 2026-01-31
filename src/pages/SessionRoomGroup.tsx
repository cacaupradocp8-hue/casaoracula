import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Wrench, Archive, MoreVertical, Calendar, Leaf } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTherapeuticGroups, TherapeuticGroup, GroupParticipant, GroupSession } from '@/hooks/useTherapeuticGroups';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import { JardimGrupoTab } from '@/components/session-room/JardimGrupoTab';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SessionRoomGroup() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { 
    loading, 
    fetchGroupById, 
    fetchGroupParticipants, 
    addParticipant, 
    removeParticipant,
    fetchGroupSessions,
    createGroupSession,
    updateGroupStatus,
  } = useTherapeuticGroups();
  const { fetchLinkedClients } = useSessionRoom();
  
  const [group, setGroup] = useState<TherapeuticGroup | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [linkedClients, setLinkedClients] = useState<{ id: string; nome: string }[]>([]);
  
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId]);

  const loadData = async () => {
    if (!groupId) return;
    
    const [groupData, participantsData, sessionsData, clientsData] = await Promise.all([
      fetchGroupById(groupId),
      fetchGroupParticipants(groupId),
      fetchGroupSessions(groupId),
      fetchLinkedClients(),
    ]);
    
    setGroup(groupData);
    setParticipants(participantsData);
    setSessions(sessionsData);
    setLinkedClients(clientsData);
  };

  const handleAddParticipant = async () => {
    if (!groupId || !selectedClientId) return;
    
    const success = await addParticipant(groupId, selectedClientId);
    if (success) {
      setAddParticipantOpen(false);
      setSelectedClientId('');
      loadData();
    }
  };

  const handleRemoveParticipant = async (clienteId: string) => {
    if (!groupId) return;
    
    const success = await removeParticipant(groupId, clienteId);
    if (success) {
      loadData();
    }
  };

  const handleCreateSession = async () => {
    if (!groupId || !newSessionTitle.trim()) return;
    
    const session = await createGroupSession(groupId, newSessionTitle.trim());
    if (session) {
      setNewSessionOpen(false);
      setNewSessionTitle('');
      loadData();
    }
  };

  const handleArchive = async () => {
    if (!groupId || !group) return;
    
    const newStatus = group.status === 'archived' ? 'active' : 'archived';
    const success = await updateGroupStatus(groupId, newStatus);
    if (success) {
      setGroup({ ...group, status: newStatus });
    }
  };

  // Filter clients not already in the group
  const availableClients = linkedClients.filter(
    client => !participants.some(p => p.cliente_id === client.id)
  );

  if (!group) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/session-room')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                <h1 className="text-2xl font-display text-foreground">{group.nome}</h1>
                <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                  {group.status === 'active' ? 'Ativo' : 'Arquivado'}
                </Badge>
              </div>
              {group.descricao && (
                <p className="text-muted-foreground mt-1">{group.descricao}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/ferramentas')} className="gap-2">
              <Wrench className="w-4 h-4" />
              Ferramentas
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  {group.status === 'archived' ? 'Reativar Grupo' : 'Arquivar Grupo'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="overview">
              <Users className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="w-4 h-4 mr-2" />
              Sessões
            </TabsTrigger>
            <TabsTrigger value="jardim">
              <Leaf className="w-4 h-4 mr-2" />
              Jardim
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Participants Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Participantes</CardTitle>
                    <CardDescription>{participants.length} participante(s)</CardDescription>
                  </div>
                  <Dialog open={addParticipantOpen} onOpenChange={setAddParticipantOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Participante</DialogTitle>
                        <DialogDescription>
                          Selecione uma cliente vinculada para adicionar ao grupo.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Cliente</Label>
                          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableClients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {availableClients.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Todas as clientes vinculadas já estão no grupo.
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={handleAddParticipant}
                          disabled={!selectedClientId || loading}
                          className="w-full"
                        >
                          Adicionar ao Grupo
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {participants.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma participante ainda.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{participant.cliente?.nome || 'Cliente'}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant.cliente_id)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total de sessões</span>
                    <span className="font-medium">{sessions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Participantes ativos</span>
                    <span className="font-medium">{participants.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                      {group.status === 'active' ? 'Ativo' : 'Arquivado'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Sessões de Grupo</CardTitle>
                  <CardDescription>{sessions.length} sessão(ões)</CardDescription>
                </div>
                <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nova Sessão
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Sessão de Grupo</DialogTitle>
                      <DialogDescription>
                        Crie uma nova sessão para este grupo terapêutico.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Título da Sessão</Label>
                        <Input
                          placeholder="Ex: Sessão 01 – Tema inicial"
                          value={newSessionTitle}
                          onChange={(e) => setNewSessionTitle(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleCreateSession}
                        disabled={!newSessionTitle.trim() || loading}
                        className="w-full"
                      >
                        Criar Sessão
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma sessão ainda.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{session.title}</span>
                          <Badge variant={session.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {session.status === 'active' ? 'Ativa' : session.status === 'draft' ? 'Rascunho' : 'Arquivada'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(session.created_at), "d 'de' MMMM", { locale: ptBR })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jardim do Grupo Tab */}
          <TabsContent value="jardim">
            <JardimGrupoTab groupId={groupId!} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
