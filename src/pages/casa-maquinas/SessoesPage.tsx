import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Plus,
  Loader2,
  Home,
  ChevronRight,
  Cog,
  Map,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type MovimentoPercebido = 'avancou' | 'tensao' | 'ciclo_repetido' | 'observacao';

interface Cliente {
  id: string;
  nome: string;
}

interface Sessao {
  id: string;
  cliente_id: string;
  data_sessao: string;
  movimento_percebido: MovimentoPercebido;
  nota_breve: string | null;
  created_at: string;
  cliente_nome?: string;
}

const MOVIMENTOS: { value: MovimentoPercebido; label: string; cor: string }[] = [
  { value: 'avancou', label: 'Avançou', cor: 'bg-emerald-500' },
  { value: 'tensao', label: 'Tensão', cor: 'bg-amber-500' },
  { value: 'ciclo_repetido', label: 'Ciclo Repetido', cor: 'bg-purple-500' },
  { value: 'observacao', label: 'Observação', cor: 'bg-muted-foreground' },
];

export default function SessoesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  // Form
  const [clienteId, setClienteId] = useState('');
  const [dataSessao, setDataSessao] = useState(new Date().toISOString().split('T')[0]);
  const [movimento, setMovimento] = useState<MovimentoPercebido>('observacao');
  const [notaBreve, setNotaBreve] = useState('');

  useEffect(() => {
    if (user) {
      loadClientes();
      loadSessoes(0);
    }
  }, [user]);

  const loadClientes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('terapeuta_id', user.id)
      .eq('status', 'ativo')
      .order('nome');
    setClientes(data || []);
  };

  const loadSessoes = async (pageNum: number) => {
    if (!user) return;
    setLoading(true);
    const from = pageNum * PAGE_SIZE;

    const { data, error } = await supabase
      .from('sessoes_casa_maquinas')
      .select('*')
      .eq('owner_id', user.id)
      .order('data_sessao', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error('Erro ao carregar sessões:', error);
      setLoading(false);
      return;
    }

    // Fetch client names
    const clienteIds = [...new Set((data || []).map(s => s.cliente_id))];
    let clienteMap: Record<string, string> = {};
    if (clienteIds.length > 0) {
      const { data: clientesData } = await supabase
        .from('clientes')
        .select('id, nome')
        .in('id', clienteIds);
      clienteMap = Object.fromEntries((clientesData || []).map(c => [c.id, c.nome]));
    }

    const mapped: Sessao[] = (data || []).map(s => ({
      id: s.id,
      cliente_id: s.cliente_id,
      data_sessao: s.data_sessao,
      movimento_percebido: s.movimento_percebido as MovimentoPercebido,
      nota_breve: s.nota_breve,
      created_at: s.created_at,
      cliente_nome: clienteMap[s.cliente_id] || 'Cliente',
    }));

    if (pageNum === 0) {
      setSessoes(mapped);
    } else {
      setSessoes(prev => [...prev, ...mapped]);
    }
    setHasMore((data || []).length === PAGE_SIZE);
    setPage(pageNum);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!user || !clienteId) {
      toast({ title: 'Selecione uma cliente', variant: 'destructive' });
      return;
    }
    setCreating(true);

    const { error } = await supabase.from('sessoes_casa_maquinas').insert({
      owner_id: user.id,
      cliente_id: clienteId,
      data_sessao: dataSessao,
      movimento_percebido: movimento,
      nota_breve: notaBreve.trim() || null,
    });

    if (error) {
      console.error('Erro ao criar sessão:', error);
      toast({ title: 'Erro ao criar sessão', variant: 'destructive' });
      setCreating(false);
      return;
    }

    toast({ title: 'Sessão registrada!' });
    setDialogOpen(false);
    resetForm();
    setCreating(false);
    loadSessoes(0);
  };

  const resetForm = () => {
    setClienteId('');
    setDataSessao(new Date().toISOString().split('T')[0]);
    setMovimento('observacao');
    setNotaBreve('');
  };

  const getMovimentoBadge = (mov: MovimentoPercebido) => {
    const m = MOVIMENTOS.find(x => x.value === mov);
    return <Badge className={`${m?.cor} text-white`}>{m?.label || mov}</Badge>;
  };

  if (loading && sessoes.length === 0) {
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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/casa-das-maquinas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Cog className="w-3 h-3" />
            Casa das Máquinas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Sessões</span>
        </nav>

        <SectionHeader
          title="Sala de Sessão"
          subtitle="Registre sessões simbólicas com suas clientes"
          icon={<Calendar className="w-5 h-5" />}
          action={
            <Button variant="gold" onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Sessão
            </Button>
          }
          className="mb-8"
        />

        {sessoes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma sessão registrada</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Registre sua primeira sessão simbólica.
              </p>
              <Button variant="gold" onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Registrar Sessão
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessoes.map((sessao) => (
              <Card key={sessao.id} className="hover:shadow-gold/20 transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-display font-bold flex-shrink-0">
                        {sessao.cliente_nome?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold">{sessao.cliente_nome}</span>
                          {getMovimentoBadge(sessao.movimento_percebido)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(sessao.data_sessao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        {sessao.nota_breve && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sessao.nota_breve}</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/casa-das-maquinas/mapa-vivo/${sessao.cliente_id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Map className="w-3 h-3" />
                        Mapa Vivo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => loadSessoes(page + 1)} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Create Session Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nova Sessão
              </DialogTitle>
              <DialogDescription>Registre uma sessão simbólica com sua cliente.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger><SelectValue placeholder="Selecione a cliente" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data da Sessão</Label>
                <Input type="date" value={dataSessao} onChange={(e) => setDataSessao(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Movimento Percebido</Label>
                <Select value={movimento} onValueChange={(v) => setMovimento(v as MovimentoPercebido)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MOVIMENTOS.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nota Breve (máx. 300 caracteres)</Label>
                <Textarea
                  value={notaBreve}
                  onChange={(e) => setNotaBreve(e.target.value.slice(0, 300))}
                  placeholder="Observações breves da sessão..."
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">{notaBreve.length}/300</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleCreate} disabled={creating || !clienteId}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {creating ? 'Salvando...' : 'Registrar Sessão'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
