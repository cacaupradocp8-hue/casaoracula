import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Brain, 
  Compass, 
  Eye, 
  Loader2,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  vinculo_ativo: boolean;
  created_at: string;
}

interface Big5Registro {
  id: string;
  created_at: string;
  abertura: number;
  conscienciosidade: number;
  extroversao: number;
  amabilidade: number;
  neuroticismo: number;
  notas: string | null;
  impacto_clinico: string | null;
}

interface EneagramaRegistro {
  id: string;
  created_at: string;
  tipo_principal: number;
  asa: number | null;
  instinto: string | null;
  defesas: string | null;
  virtude: string | null;
  armadilhas: string | null;
  pratica_sugerida: string | null;
}

export default function MinhasClientes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected client for viewing records
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [big5Records, setBig5Records] = useState<Big5Registro[]>([]);
  const [eneagramaRecords, setEneagramaRecords] = useState<EneagramaRegistro[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (user) fetchClientes();
  }, [user]);

  const fetchClientes = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch only ACTIVE vinculos where current user is the therapist
    // RLS ensures therapist can only see their own links
    const { data: vinculos, error: vinculosError } = await supabase
      .from('terapeuta_clientes')
      .select('cliente_id, ativo, created_at')
      .eq('terapeuta_id', user.id)
      .order('created_at', { ascending: false });

    if (vinculosError) {
      console.error('Erro ao carregar vínculos:', vinculosError);
      toast({ title: 'Erro ao carregar clientes', variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (!vinculos || vinculos.length === 0) {
      setClientes([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for linked clients
    const clienteIds = vinculos.map(v => v.cliente_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome, email')
      .in('id', clienteIds);

    if (profilesError) {
      toast({ title: 'Erro ao carregar perfis', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Combine data
    const clientesData: Cliente[] = vinculos.map(v => {
      const profile = profiles?.find(p => p.id === v.cliente_id);
      return {
        id: v.cliente_id,
        nome: profile?.nome || 'Sem nome',
        email: profile?.email || '',
        vinculo_ativo: v.ativo,
        created_at: v.created_at,
      };
    });

    setClientes(clientesData);
    setLoading(false);
  };

  const fetchClienteRecords = async (clienteId: string) => {
    if (!user) return;
    
    setLoadingRecords(true);

    // RLS handles access control - therapist can only see records for linked clients
    // Query by user_id (the client who owns the record)
    const [big5Res, eneagramaRes] = await Promise.all([
      supabase
        .from('big5_registros')
        .select('*')
        .eq('user_id', clienteId)
        .order('created_at', { ascending: false }),
      supabase
        .from('eneagrama_registros')
        .select('*')
        .eq('user_id', clienteId)
        .order('created_at', { ascending: false })
    ]);

    if (big5Res.data) setBig5Records(big5Res.data);
    if (eneagramaRes.data) setEneagramaRecords(eneagramaRes.data);
    
    setLoadingRecords(false);
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDialogOpen(true);
    fetchClienteRecords(cliente.id);
  };

  const filteredClientes = clientes.filter(c => {
    const search = searchTerm.toLowerCase();
    return c.nome.toLowerCase().includes(search) || c.email.toLowerCase().includes(search);
  });

  const activeClientes = filteredClientes.filter(c => c.vinculo_ativo);
  const inactiveClientes = filteredClientes.filter(c => !c.vinculo_ativo);

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
        <SectionHeader
          title="Minhas Clientes"
          subtitle="Gerencie e acompanhe as avaliações das suas clientes"
          icon={<Users className="w-5 h-5" />}
          className="mb-8"
        />

        {clientes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma cliente vinculada</h3>
              <p className="text-muted-foreground text-sm">
                Solicite à administradora que vincule clientes ao seu perfil de terapeuta.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <Brain className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-display font-bold">Big5</p>
                  <p className="text-xs text-muted-foreground">Ferramenta</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Compass className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-display font-bold">Eneagrama</p>
                  <p className="text-xs text-muted-foreground">Ferramenta</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Clients List */}
            <div className="space-y-4">
              {filteredClientes.map((cliente) => (
                <Card 
                  key={cliente.id} 
                  className={`hover:shadow-gold transition-shadow ${!cliente.vinculo_ativo ? 'opacity-60' : ''}`}
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
                            <Badge variant={cliente.vinculo_ativo ? 'default' : 'secondary'}>
                              {cliente.vinculo_ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{cliente.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Vinculada desde {format(new Date(cliente.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => handleViewCliente(cliente)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Registros
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Client Records Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registros de {selectedCliente?.nome}
              </DialogTitle>
            </DialogHeader>

            {loadingRecords ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : (
              <Tabs defaultValue="big5" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="big5" className="gap-2">
                    <Brain className="w-4 h-4" />
                    Big5 ({big5Records.length})
                  </TabsTrigger>
                  <TabsTrigger value="eneagrama" className="gap-2">
                    <Compass className="w-4 h-4" />
                    Eneagrama ({eneagramaRecords.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="big5" className="mt-4">
                  {big5Records.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Nenhum registro Big5</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {big5Records.map((record) => (
                        <Card key={record.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(record.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-5 gap-4 mb-4">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gold">{record.abertura}</p>
                                <p className="text-xs text-muted-foreground">Abertura</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gold">{record.conscienciosidade}</p>
                                <p className="text-xs text-muted-foreground">Conscienc.</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gold">{record.extroversao}</p>
                                <p className="text-xs text-muted-foreground">Extroversão</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gold">{record.amabilidade}</p>
                                <p className="text-xs text-muted-foreground">Amabilidade</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gold">{record.neuroticismo}</p>
                                <p className="text-xs text-muted-foreground">Neurotic.</p>
                              </div>
                            </div>
                            {(record.notas || record.impacto_clinico) && (
                              <div className="space-y-2 pt-4 border-t">
                                {record.notas && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Notas:</p>
                                    <p className="text-sm">{record.notas}</p>
                                  </div>
                                )}
                                {record.impacto_clinico && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Impacto clínico:</p>
                                    <p className="text-sm">{record.impacto_clinico}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="eneagrama" className="mt-4">
                  {eneagramaRecords.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Nenhum registro Eneagrama</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {eneagramaRecords.map((record) => (
                        <Card key={record.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(record.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                                <span className="text-3xl font-display font-bold text-gold">
                                  {record.tipo_principal}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">Tipo {record.tipo_principal}</p>
                                {record.asa && (
                                  <p className="text-sm text-muted-foreground">Asa {record.asa}</p>
                                )}
                                {record.instinto && (
                                  <p className="text-sm text-muted-foreground">Instinto: {record.instinto}</p>
                                )}
                              </div>
                            </div>
                            {(record.defesas || record.virtude || record.armadilhas || record.pratica_sugerida) && (
                              <div className="space-y-2 pt-4 border-t">
                                {record.defesas && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Defesas:</p>
                                    <p className="text-sm">{record.defesas}</p>
                                  </div>
                                )}
                                {record.virtude && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Virtude:</p>
                                    <p className="text-sm">{record.virtude}</p>
                                  </div>
                                )}
                                {record.armadilhas && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Armadilhas:</p>
                                    <p className="text-sm">{record.armadilhas}</p>
                                  </div>
                                )}
                                {record.pratica_sugerida && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Prática sugerida:</p>
                                    <p className="text-sm">{record.pratica_sugerida}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
