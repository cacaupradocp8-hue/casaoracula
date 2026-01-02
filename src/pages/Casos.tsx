import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FolderOpen, Plus, Calendar, Tag, ChevronRight, Brain, Compass, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { casoSchema } from '@/lib/validations';
import { useNavigate } from 'react-router-dom';

interface Caso {
  id: string;
  codinome: string;
  tema_central: string;
  tags: string[];
  historico_breve: string | null;
  created_at: string;
  cliente_id: string;
  cliente_nome?: string;
  cliente_email?: string;
}

interface ClienteOption {
  id: string;
  nome: string;
  email: string;
}

export default function Casos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);
  const [newCase, setNewCase] = useState({
    codinome: '',
    tema_central: '',
    tags: '',
    historico_breve: '',
    cliente_id: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch casos and clientes in parallel
    const [casosRes, clientesRes] = await Promise.all([
      supabase
        .from('casos')
        .select('*')
        .eq('terapeuta_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('terapeuta_clientes')
        .select('cliente_id')
        .eq('terapeuta_id', user.id)
        .eq('ativo', true),
    ]);

    // Fetch cliente profiles
    if (clientesRes.data && clientesRes.data.length > 0) {
      const clienteIds = clientesRes.data.map(c => c.cliente_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', clienteIds);
      
      if (profiles) {
        setClientes(profiles);

        // Enrich casos with cliente info
        if (casosRes.data) {
          const enrichedCasos = casosRes.data.map(caso => {
            const cliente = profiles.find(p => p.id === caso.cliente_id);
            return {
              ...caso,
              cliente_nome: cliente?.nome || 'Sem nome',
              cliente_email: cliente?.email || '',
            };
          });
          setCasos(enrichedCasos);
        }
      }
    } else {
      setCasos(casosRes.data || []);
    }

    setLoading(false);
  };

  const handleCreateCase = async () => {
    setValidationErrors({});

    // Validate
    const validation = casoSchema.safeParse({
      codinome: newCase.codinome,
      tema_central: newCase.tema_central,
      tags: newCase.tags,
      historico_breve: newCase.historico_breve,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach(e => {
        if (e.path[0]) errors[String(e.path[0])] = e.message;
      });
      setValidationErrors(errors);
      return;
    }

    if (!newCase.cliente_id) {
      toast({
        title: 'Selecione a cliente',
        description: 'É necessário selecionar uma cliente vinculada para criar um caso.',
        variant: 'destructive',
      });
      return;
    }

    const tagsArray = newCase.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const { data, error } = await supabase.from('casos').insert({
      terapeuta_id: user?.id,
      cliente_id: newCase.cliente_id,
      codinome: newCase.codinome,
      tema_central: newCase.tema_central,
      tags: tagsArray,
      historico_breve: newCase.historico_breve || null,
    }).select().single();

    if (error) {
      toast({
        title: 'Erro ao criar caso',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    // Add cliente info to the new case
    const cliente = clientes.find(c => c.id === newCase.cliente_id);
    const enrichedCase: Caso = {
      ...data,
      cliente_nome: cliente?.nome || 'Sem nome',
      cliente_email: cliente?.email || '',
    };

    setCasos(prev => [enrichedCase, ...prev]);
    setNewCase({ codinome: '', tema_central: '', tags: '', historico_breve: '', cliente_id: '' });
    setIsDialogOpen(false);
    
    toast({
      title: 'Caso criado',
      description: `O caso "${data.codinome}" foi criado com sucesso.`,
    });
  };

  const handleOpenCaso = (caso: Caso) => {
    setSelectedCaso(caso);
  };

  if (!user) return null;

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  // Check if user has any clients linked
  const hasClients = clientes.length > 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Meus Casos"
          subtitle="Gerencie seus casos clínicos de forma confidencial"
          icon={<FolderOpen className="w-5 h-5" />}
          action={
            hasClients ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Caso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Criar Novo Caso</DialogTitle>
                    <DialogDescription>
                      Use sempre um codinome. Nunca registre dados identificáveis da cliente.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente *</Label>
                      <Select value={newCase.cliente_id} onValueChange={(v) => setNewCase(prev => ({ ...prev, cliente_id: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nome || 'Sem nome'} ({c.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codename">Codinome *</Label>
                      <Input
                        id="codename"
                        placeholder="Ex: Lua Cheia, Raiz Profunda..."
                        value={newCase.codinome}
                        onChange={(e) => setNewCase(prev => ({ ...prev, codinome: e.target.value }))}
                        maxLength={100}
                      />
                      {validationErrors.codinome && (
                        <p className="text-xs text-destructive">{validationErrors.codinome}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema Central *</Label>
                      <Textarea
                        id="theme"
                        placeholder="Qual é a questão central deste caso?"
                        value={newCase.tema_central}
                        onChange={(e) => setNewCase(prev => ({ ...prev, tema_central: e.target.value }))}
                        maxLength={500}
                      />
                      {validationErrors.tema_central && (
                        <p className="text-xs text-destructive">{validationErrors.tema_central}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="Ex: abandono, luto, relacionamentos (separadas por vírgula)"
                        value={newCase.tags}
                        onChange={(e) => setNewCase(prev => ({ ...prev, tags: e.target.value }))}
                        maxLength={500}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="history">Histórico Breve</Label>
                      <Textarea
                        id="history"
                        placeholder="Breve contexto do caso (mantenha anônimo)"
                        className="min-h-[100px]"
                        value={newCase.historico_breve}
                        onChange={(e) => setNewCase(prev => ({ ...prev, historico_breve: e.target.value }))}
                        maxLength={2000}
                      />
                    </div>
                    <Button variant="gold" onClick={handleCreateCase} className="w-full">
                      Criar Caso
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : null
          }
          className="mb-8"
        />

        {/* No clients message */}
        {!hasClients && (
          <Card className="mb-6 border-amber-500/30 bg-amber-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium">Nenhuma cliente vinculada</p>
                  <p className="text-sm text-muted-foreground">
                    Para criar casos, você precisa ter clientes vinculadas. Entre em contato com a administração.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cases List */}
        {casos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-semibold mb-2">Nenhum caso criado</h3>
              <p className="text-muted-foreground mb-4">
                {hasClients 
                  ? 'Crie seu primeiro caso para começar a documentar suas sessões.'
                  : 'Você precisa ter clientes vinculadas para criar casos.'}
              </p>
              {hasClients && (
                <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Caso
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {casos.map((caso) => (
              <Card 
                key={caso.id} 
                className="group hover:shadow-gold transition-shadow cursor-pointer"
                onClick={() => handleOpenCaso(caso)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        {caso.codinome}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {caso.tema_central}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {caso.cliente_nome}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {caso.historico_breve && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {caso.historico_breve}
                    </p>
                  )}
                  
                  {caso.tags && caso.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caso.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(caso.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Case Detail Dialog */}
        <Dialog open={!!selectedCaso} onOpenChange={(open) => !open && setSelectedCaso(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCaso && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl flex items-center gap-2">
                    {selectedCaso.codinome}
                  </DialogTitle>
                  <DialogDescription>
                    Cliente: {selectedCaso.cliente_nome} • {selectedCaso.tema_central}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="info" className="mt-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Histórico</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {selectedCaso.historico_breve || 'Nenhum histórico registrado.'}
                        </p>
                      </CardContent>
                    </Card>

                    {selectedCaso.tags && selectedCaso.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCaso.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="ferramentas" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card 
                        className="cursor-pointer hover:shadow-gold transition-shadow"
                        onClick={() => navigate(`/salas/big5?caso=${selectedCaso.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gold/10">
                            <Brain className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h4 className="font-medium">Big Five</h4>
                            <p className="text-xs text-muted-foreground">Avaliação OCEAN</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className="cursor-pointer hover:shadow-gold transition-shadow"
                        onClick={() => navigate(`/salas/eneagrama?caso=${selectedCaso.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gold/10">
                            <Compass className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h4 className="font-medium">Eneagrama</h4>
                            <p className="text-xs text-muted-foreground">9 tipos e asas</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Confidentiality Notice */}
        <Card className="mt-8 bg-secondary/30 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Lembre-se:</strong> Confidencialidade e anonimização são obrigatórias. 
              Nunca registre dados que possam identificar a cliente.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
