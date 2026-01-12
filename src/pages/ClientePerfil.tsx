import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  ArrowLeft,
  Loader2,
  Calendar,
  Brain,
  Compass,
  History,
  Wrench,
  FileText,
  Clock,
  ArrowRight,
  MessageCircle,
  Shield,
  User
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

interface TimelineItem {
  id: string;
  tipo: 'big5' | 'eneagrama' | 'sessao';
  titulo: string;
  descricao: string;
  data: string;
}

export default function ClientePerfil() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [big5Records, setBig5Records] = useState<Big5Registro[]>([]);
  const [eneagramaRecords, setEneagramaRecords] = useState<EneagramaRegistro[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [observacoes, setObservacoes] = useState('');
  
  useEffect(() => {
    if (user && clienteId) {
      fetchData();
    }
  }, [user, clienteId]);

  const fetchData = async () => {
    if (!user || !clienteId) return;
    
    setLoading(true);
    
    try {
      // Fetch client from clientes table (RLS ensures only own clients)
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .maybeSingle();

      if (clienteError || !clienteData) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para visualizar esta cliente.',
          variant: 'destructive',
        });
        navigate('/minhas-clientes');
        return;
      }

      setCliente({
        id: clienteData.id,
        nome: clienteData.nome,
        status: clienteData.status as ClienteStatus,
        objetivo_terapeutico: clienteData.objetivo_terapeutico,
        created_at: clienteData.created_at,
      });

      // Fetch records linked to this client
      const [big5Res, eneagramaRes] = await Promise.all([
        supabase
          .from('big5_registros')
          .select('*')
          .eq('cliente_id', clienteId)
          .order('created_at', { ascending: false }),
        supabase
          .from('eneagrama_registros')
          .select('*')
          .eq('cliente_id', clienteId)
          .order('created_at', { ascending: false })
      ]);

      if (big5Res.data) setBig5Records(big5Res.data);
      if (eneagramaRes.data) setEneagramaRecords(eneagramaRes.data);

      // Build timeline
      const timelineItems: TimelineItem[] = [];
      
      big5Res.data?.forEach(r => {
        timelineItems.push({
          id: r.id,
          tipo: 'big5',
          titulo: 'Avaliação Big Five',
          descricao: `O: ${r.abertura} | C: ${r.conscienciosidade} | E: ${r.extroversao} | A: ${r.amabilidade} | N: ${r.neuroticismo}`,
          data: r.created_at,
        });
      });

      eneagramaRes.data?.forEach(r => {
        timelineItems.push({
          id: r.id,
          tipo: 'eneagrama',
          titulo: `Eneagrama - Tipo ${r.tipo_principal}`,
          descricao: r.asa ? `Com asa ${r.asa}` : 'Sem asa definida',
          data: r.created_at,
        });
      });

      // Sort by date
      timelineItems.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      setTimeline(timelineItems);
      
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!cliente) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Cliente não encontrada</h3>
          <Button variant="outline" onClick={() => navigate('/minhas-clientes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/minhas-clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-2xl font-display font-bold text-gold">
                {cliente.nome.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                  {cliente.nome}
                  {getStatusBadge(cliente.status)}
                </h1>
                {cliente.objetivo_terapeutico && (
                  <p className="text-sm text-muted-foreground">{cliente.objetivo_terapeutico}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aviso ético */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-amber-500">Aviso ético:</strong> Todas as informações aqui são confidenciais e de uso exclusivo para fins terapêuticos. 
              Respeite o sigilo profissional.
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
            <TabsTrigger value="visao-geral" className="gap-2">
              <User className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <History className="w-4 h-4" />
              Linha do Tempo
            </TabsTrigger>
            <TabsTrigger value="sessoes" className="gap-2">
              <Calendar className="w-4 h-4" />
              Sessões
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="gap-2">
              <Wrench className="w-4 h-4" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="observacoes" className="gap-2">
              <FileText className="w-4 h-4" />
              Observações
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gold" />
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <p className="font-medium">
                    {format(new Date(cliente.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Avaliações Big5</p>
                  <p className="text-2xl font-bold">{big5Records.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Compass className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-muted-foreground">Avaliações Eneagrama</p>
                  <p className="text-2xl font-bold">{eneagramaRecords.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Último registro de cada tipo */}
            <div className="grid gap-4 md:grid-cols-2">
              {big5Records.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      Último Big5
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(big5Records[0].created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-gold">{big5Records[0].abertura}</p>
                        <p className="text-xs text-muted-foreground">O</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gold">{big5Records[0].conscienciosidade}</p>
                        <p className="text-xs text-muted-foreground">C</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gold">{big5Records[0].extroversao}</p>
                        <p className="text-xs text-muted-foreground">E</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gold">{big5Records[0].amabilidade}</p>
                        <p className="text-xs text-muted-foreground">A</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gold">{big5Records[0].neuroticismo}</p>
                        <p className="text-xs text-muted-foreground">N</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {eneagramaRecords.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Compass className="w-4 h-4 text-purple-500" />
                      Último Eneagrama
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(eneagramaRecords[0].created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-gold">
                        {eneagramaRecords[0].tipo_principal}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Tipo {eneagramaRecords[0].tipo_principal}</p>
                      {eneagramaRecords[0].asa && (
                        <p className="text-sm text-muted-foreground">Asa {eneagramaRecords[0].asa}</p>
                      )}
                      {eneagramaRecords[0].instinto && (
                        <p className="text-sm text-muted-foreground">{eneagramaRecords[0].instinto}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Linha do Tempo */}
          <TabsContent value="timeline">
            {timeline.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum registro ainda.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use as Ferramentas para criar avaliações para esta cliente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {timeline.map((item) => (
                  <Card key={item.id} className="glass">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.tipo === 'big5' ? 'bg-blue-500/20' : 
                        item.tipo === 'eneagrama' ? 'bg-purple-500/20' : 'bg-green-500/20'
                      }`}>
                        {item.tipo === 'big5' && <Brain className="w-5 h-5 text-blue-500" />}
                        {item.tipo === 'eneagrama' && <Compass className="w-5 h-5 text-purple-500" />}
                        {item.tipo === 'sessao' && <MessageCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.titulo}</p>
                        <p className="text-sm text-muted-foreground">{item.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sessões */}
          <TabsContent value="sessoes">
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Funcionalidade de Sessões</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Em breve você poderá registrar sessões terapêuticas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ferramentas */}
          <TabsContent value="ferramentas">
            <div className="grid gap-4 md:grid-cols-2">
              <Card 
                className="cursor-pointer hover:shadow-gold transition-all group"
                onClick={() => navigate(`/salas/big5?cliente=${clienteId}`)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Brain className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg group-hover:text-gold transition-colors">Big Five (OCEAN)</h4>
                    <p className="text-sm text-muted-foreground">
                      Avaliação das cinco grandes dimensões da personalidade
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {big5Records.length} registro{big5Records.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-gold transition-all group"
                onClick={() => navigate(`/salas/eneagrama?cliente=${clienteId}`)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Compass className="w-7 h-7 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg group-hover:text-gold transition-colors">Eneagrama</h4>
                    <p className="text-sm text-muted-foreground">
                      Mapeamento dos 9 tipos, asas e instintos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {eneagramaRecords.length} registro{eneagramaRecords.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Observações */}
          <TabsContent value="observacoes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações Privadas
                </CardTitle>
                <CardDescription>
                  Anotações pessoais sobre esta cliente (visíveis apenas para você)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Escreva suas observações sobre a cliente aqui..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Em breve: salvamento automático das observações
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
