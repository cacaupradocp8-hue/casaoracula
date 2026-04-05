import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  Plus,
  Loader2,
  Home,
  ChevronRight,
  Cog,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type GestoStatus = 'ativo' | 'em_pratica' | 'integrado' | 'em_revisao';

interface Cliente {
  id: string;
  nome: string;
}

interface Gesto {
  id: string;
  cliente_id: string;
  gesto_texto: string;
  status: GestoStatus;
  created_at: string;
  cliente_nome?: string;
}

const STATUS_CONFIG: { value: GestoStatus; label: string; cor: string }[] = [
  { value: 'ativo', label: 'Ativo', cor: 'bg-emerald-500' },
  { value: 'em_pratica', label: 'Em Prática', cor: 'bg-blue-500' },
  { value: 'integrado', label: 'Integrado', cor: 'bg-gold' },
  { value: 'em_revisao', label: 'Em Revisão', cor: 'bg-amber-500' },
];

export default function GestosIntegracaoPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gestos, setGestos] = useState<Gesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form
  const [clienteId, setClienteId] = useState('');
  const [gestoTexto, setGestoTexto] = useState('');
  const [status, setStatus] = useState<GestoStatus>('ativo');

  useEffect(() => {
    if (user) {
      loadClientes();
      loadGestos();
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

  const loadGestos = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('gestos_integracao')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Erro ao carregar gestos:', error);
      setLoading(false);
      return;
    }

    const clienteIds = [...new Set((data || []).map(g => g.cliente_id))];
    let clienteMap: Record<string, string> = {};
    if (clienteIds.length > 0) {
      const { data: cData } = await supabase
        .from('clientes')
        .select('id, nome')
        .in('id', clienteIds);
      clienteMap = Object.fromEntries((cData || []).map(c => [c.id, c.nome]));
    }

    setGestos((data || []).map(g => ({
      id: g.id,
      cliente_id: g.cliente_id,
      gesto_texto: g.gesto_texto,
      status: g.status as GestoStatus,
      created_at: g.created_at,
      cliente_nome: clienteMap[g.cliente_id] || 'Cliente',
    })));
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!user || !clienteId || !gestoTexto.trim()) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setCreating(true);

    const { error } = await supabase.from('gestos_integracao').insert({
      owner_id: user.id,
      cliente_id: clienteId,
      gesto_texto: gestoTexto.trim(),
      status,
    });

    if (error) {
      console.error('Erro ao criar gesto:', error);
      toast({ title: 'Erro ao criar gesto', variant: 'destructive' });
      setCreating(false);
      return;
    }

    toast({ title: 'Gesto registrado!' });
    setDialogOpen(false);
    setClienteId('');
    setGestoTexto('');
    setStatus('ativo');
    setCreating(false);
    loadGestos();
  };

  const handleUpdateStatus = async (gestoId: string, newStatus: GestoStatus) => {
    const { error } = await supabase
      .from('gestos_integracao')
      .update({ status: newStatus })
      .eq('id', gestoId);

    if (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
      return;
    }
    toast({ title: 'Status atualizado!' });
    loadGestos();
  };

  const getStatusBadge = (s: GestoStatus) => {
    const cfg = STATUS_CONFIG.find(x => x.value === s);
    return <Badge className={`${cfg?.cor} text-white`}>{cfg?.label || s}</Badge>;
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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard-membro" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/casa-das-maquinas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Cog className="w-3 h-3" />
            Casa das Máquinas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Gestos de Integração</span>
        </nav>

        <SectionHeader
          title="Gestos de Integração"
          subtitle="Ações simbólicas de integração vinculadas às suas clientes"
          icon={<Sparkles className="w-5 h-5" />}
          action={
            <Button variant="gold" onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Gesto
            </Button>
          }
          className="mb-8"
        />

        {gestos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum gesto registrado</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Crie o primeiro gesto de integração para uma cliente.
              </p>
              <Button variant="gold" onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Gesto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {gestos.map((gesto) => (
              <Card key={gesto.id} className={`transition-shadow ${gesto.status === 'ativo' ? 'border-gold/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-display font-semibold">{gesto.cliente_nome}</span>
                        {getStatusBadge(gesto.status)}
                      </div>
                      <p className="text-sm mt-1">{gesto.gesto_texto}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(gesto.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <Select
                      value={gesto.status}
                      onValueChange={(v) => handleUpdateStatus(gesto.id, v as GestoStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_CONFIG.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Gesto Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Novo Gesto de Integração
              </DialogTitle>
              <DialogDescription>Registre uma ação simbólica de integração.</DialogDescription>
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
                <Label>Gesto *</Label>
                <Textarea
                  value={gestoTexto}
                  onChange={(e) => setGestoTexto(e.target.value)}
                  placeholder="Descreva o gesto de integração..."
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as GestoStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_CONFIG.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Ao criar um gesto "Ativo", o gesto ativo anterior desta cliente será automaticamente marcado como "Integrado".
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleCreate} disabled={creating || !clienteId || !gestoTexto.trim()}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {creating ? 'Salvando...' : 'Criar Gesto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
