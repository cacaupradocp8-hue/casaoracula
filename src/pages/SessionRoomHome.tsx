import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Archive, FolderOpen, Clock, User, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import type { SessionCase, SessionCaseStatus } from '@/types/session-room';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SessionRoomHome() {
  const navigate = useNavigate();
  const { loading, fetchLinkedClients, fetchCases, createCase, fetchCaseQuota } = useSessionRoom();
  
  const [cases, setCases] = useState<SessionCase[]>([]);
  const [linkedClients, setLinkedClients] = useState<{ id: string; nome: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quota, setQuota] = useState<{ used: number; max: number; canCreate: boolean }>({ used: 0, max: -1, canCreate: true });
  
  // Form state for new case
  const [newCaseClientId, setNewCaseClientId] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const [casesData, clientsData, quotaData] = await Promise.all([
      fetchCases(activeTab as SessionCaseStatus),
      fetchLinkedClients(),
      fetchCaseQuota(),
    ]);
    setCases(casesData);
    setLinkedClients(clientsData);
    setQuota(quotaData);
  };

  const handleCreateCase = async () => {
    if (!newCaseClientId || !newCaseTitle.trim()) return;
    
    const newCase = await createCase(newCaseClientId, newCaseTitle.trim());
    if (newCase) {
      setDialogOpen(false);
      setNewCaseClientId('');
      setNewCaseTitle('');
      navigate(`/session-room/${newCase.id}`);
    }
  };

  const getStatusBadge = (status: SessionCaseStatus) => {
    const variants: Record<SessionCaseStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      draft: { label: 'Rascunho', variant: 'outline' },
      active: { label: 'Ativo', variant: 'default' },
      archived: { label: 'Arquivado', variant: 'secondary' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isUnlimited = quota.max === -1;
  const quotaPercentage = isUnlimited ? 0 : Math.min((quota.used / quota.max) * 100, 100);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Sala de Sessão"
            subtitle="Decodificação narrativa estruturada para acompanhamento terapêutico"
            icon={<FolderOpen className="w-6 h-6" />}
          />
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={!quota.canCreate}>
                <Plus className="w-4 h-4" />
                Novo Caso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Caso</DialogTitle>
                <DialogDescription>
                  Selecione uma cliente vinculada e dê um título ao caso.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={newCaseClientId} onValueChange={setNewCaseClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {linkedClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {linkedClients.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Você não tem clientes vinculadas. Vincule uma cliente em "Minhas Clientes" primeiro.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Título do Caso</Label>
                  <Input
                    placeholder="Ex: Sessão 01 – Tema inicial"
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                  />
                </div>
                
                <Button
                  onClick={handleCreateCase}
                  disabled={!newCaseClientId || !newCaseTitle.trim() || loading}
                  className="w-full"
                >
                  Criar Caso
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quota Display */}
        {!isUnlimited && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Uso de casos</span>
                <span className="text-sm font-medium">
                  {quota.used} / {quota.max} casos
                </span>
              </div>
              <Progress value={quotaPercentage} className="h-2" />
              {!quota.canCreate && (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Você atingiu o limite de casos do seu plano. Arquive casos antigos ou faça upgrade do plano.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'archived')}>
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Ativos
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive className="w-4 h-4" />
              Arquivados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <CasesList cases={cases} onOpenCase={(id) => navigate(`/session-room/${id}`)} />
          </TabsContent>

          <TabsContent value="archived">
            <CasesList cases={cases} onOpenCase={(id) => navigate(`/session-room/${id}`)} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function CasesList({ 
  cases, 
  onOpenCase 
}: { 
  cases: SessionCase[]; 
  onOpenCase: (id: string) => void;
}) {
  if (cases.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Nenhum caso encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {cases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className="cursor-pointer hover:border-gold/50 transition-colors"
          onClick={() => onOpenCase(caseItem.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <User className="w-3 h-3" />
                  {caseItem.client?.nome || 'Cliente não identificada'}
                </CardDescription>
              </div>
              <Badge variant={caseItem.status === 'active' ? 'default' : 'secondary'}>
                {caseItem.status === 'active' ? 'Ativo' : caseItem.status === 'draft' ? 'Rascunho' : 'Arquivado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              Atualizado em {format(new Date(caseItem.updated_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
