import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Loader2,
  Calendar,
  UserCheck,
  Plus,
  Eye,
  AlertTriangle,
  Infinity,
  Home,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ClienteStatus = 'ativo' | 'pausado' | 'encerrado';

interface Cliente {
  id: string;
  nome: string;
  status: ClienteStatus;
  objetivo_terapeutico: string | null;
  created_at: string;
}

interface PlanLimit {
  portal: string;
  max_clientes: number;
}

export default function MinhasClientes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPortal, setUserPortal] = useState<string>('visitante');
  
  // Limits
  const [maxClientes, setMaxClientes] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  
  // Create client dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoObjetivo, setNovoObjetivo] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);

    // Fetch user portal
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('portal')
      .eq('user_id', user.id)
      .single();
    
    const portal = roleData?.portal || 'visitante';
    setUserPortal(portal);
    
    // Fetch clients
    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .eq('terapeuta_id', user.id)
      .order('created_at', { ascending: false });

    if (clientesError) {
      console.error('Erro ao carregar clientes:', clientesError);
      toast({ title: 'Erro ao carregar clientes', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const mappedClientes: Cliente[] = (clientesData || []).map(c => ({
      id: c.id,
      nome: c.nome,
      status: c.status as ClienteStatus,
      objetivo_terapeutico: c.objetivo_terapeutico,
      created_at: c.created_at,
    }));

    setClientes(mappedClientes);

    // Fetch plan limits
    const { data: limitsData } = await supabase
      .from('plan_limits')
      .select('portal, max_clientes')
      .eq('portal', portal)
      .single();

    if (limitsData) {
      setMaxClientes(limitsData.max_clientes);
      // -1 means unlimited, admin always unlimited
      if (userPortal === 'admin' || limitsData.max_clientes === -1) {
        setLimitReached(false);
      } else {
        setLimitReached(mappedClientes.length >= limitsData.max_clientes);
      }
    }

    setLoading(false);
  };

  const handleOpenCreateDialog = () => {
    if (limitReached && userPortal !== 'admin') {
      toast({ 
        title: 'Limite atingido', 
        description: 'Você atingiu o limite de clientes do seu nível. Para cadastrar mais, faça upgrade.',
        variant: 'destructive' 
      });
      return;
    }
    setDialogOpen(true);
  };

  const handleCreateCliente = async () => {
    if (!user || !novoNome.trim()) {
      toast({ title: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }

    // Double check limit
    if (limitReached && userPortal !== 'admin') {
      toast({ 
        title: 'Limite atingido', 
        description: 'Você atingiu o limite de clientes do seu nível.',
        variant: 'destructive' 
      });
      return;
    }

    setCreating(true);

    const { error } = await supabase
      .from('clientes')
      .insert({
        terapeuta_id: user.id,
        nome: novoNome.trim(),
        objetivo_terapeutico: novoObjetivo.trim() || null,
        status: 'ativo' as ClienteStatus,
      });

    if (error) {
      console.error('Erro ao criar cliente:', error);
      toast({ title: 'Erro ao criar cliente', variant: 'destructive' });
      setCreating(false);
      return;
    }

    toast({ title: 'Cliente criada com sucesso!' });
    setDialogOpen(false);
    setNovoNome('');
    setNovoObjetivo('');
    setCreating(false);
    fetchData();
  };

  const handleViewCliente = (cliente: Cliente) => {
    navigate(`/cliente/${cliente.id}`);
  };

  const filteredClientes = clientes.filter(c => {
    const search = searchTerm.toLowerCase();
    return c.nome.toLowerCase().includes(search);
  });

  const activeClientes = filteredClientes.filter(c => c.status === 'ativo');
  const pausedClientes = filteredClientes.filter(c => c.status === 'pausado');
  const endedClientes = filteredClientes.filter(c => c.status === 'encerrado');

  const getStatusBadge = (status: ClienteStatus) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      case 'pausado':
        return <Badge variant="secondary">Pausado</Badge>;
      case 'encerrado':
        return <Badge variant="outline">Encerrado</Badge>;
    }
  };

  const getLimitDisplay = () => {
    if (userPortal === 'admin') return 'Ilimitado';
    if (maxClientes === null) return '-';
    if (maxClientes === -1) return 'Ilimitado';
    return `${clientes.length}/${maxClientes}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard-membro" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Minhas Clientes</span>
        </nav>

        <SectionHeader
          title="Minhas Clientes"
          subtitle="Gerencie suas clientes e acompanhe seu progresso terapêutico"
          icon={<Users className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Limit Warning */}
        {limitReached && userPortal !== 'admin' && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Limite atingido</AlertTitle>
            <AlertDescription>
              Você atingiu o limite de clientes do seu nível ({maxClientes}). 
              Para cadastrar mais clientes, faça upgrade do seu plano.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-display font-bold">{clientes.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-display font-bold">{activeClientes.length}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-display font-bold">{pausedClientes.length}</p>
              <p className="text-xs text-muted-foreground">Pausados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-display font-bold">{endedClientes.length}</p>
              <p className="text-xs text-muted-foreground">Encerrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {(userPortal === 'admin' || maxClientes === -1) ? (
                <Infinity className="w-6 h-6 mx-auto mb-2 text-gold" />
              ) : (
                <Users className="w-6 h-6 mx-auto mb-2 text-gold" />
              )}
              <p className="text-2xl font-display font-bold">{getLimitDisplay()}</p>
              <p className="text-xs text-muted-foreground">Limite</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="gold" 
            onClick={handleOpenCreateDialog} 
            className="gap-2"
            disabled={limitReached && userPortal !== 'admin'}
          >
            <Plus className="w-4 h-4" />
            Criar Cliente
          </Button>
        </div>

        {/* Clients List */}
        {clientes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma cliente cadastrada</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Crie sua primeira cliente para começar a utilizar as ferramentas.
              </p>
              <Button 
                variant="gold" 
                onClick={handleOpenCreateDialog} 
                className="gap-2"
                disabled={limitReached && userPortal !== 'admin'}
              >
                <Plus className="w-4 h-4" />
                Criar Primeira Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClientes.map((cliente) => (
              <Card 
                key={cliente.id} 
                className={`hover:shadow-gold transition-shadow ${cliente.status !== 'ativo' ? 'opacity-70' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-display font-bold">
                        {cliente.nome.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-semibold">
                            {cliente.nome}
                          </h3>
                          {getStatusBadge(cliente.status)}
                        </div>
                        {cliente.objetivo_terapeutico && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {cliente.objetivo_terapeutico}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Desde {format(new Date(cliente.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="gold" 
                      onClick={() => handleViewCliente(cliente)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Abrir Cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Client Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nova Cliente
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova cliente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome da cliente"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo Terapêutico</Label>
                <Input
                  id="objetivo"
                  placeholder="Ex: Autoconhecimento, trabalhar ansiedade..."
                  value={novoObjetivo}
                  onChange={(e) => setNovoObjetivo(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="gold" 
                onClick={handleCreateCliente}
                disabled={creating || !novoNome.trim()}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Cliente'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
