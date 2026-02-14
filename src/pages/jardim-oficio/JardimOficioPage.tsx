import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canAccessFeature } from '@/types/portal';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Sprout,
  Plus,
  Home,
  ChevronRight,
  Loader2,
  Eye,
  Send,
  MessageCircle,
  Trash2,
  CalendarDays,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface JardimRegistro {
  id: string;
  reflexao_profissional: string;
  tensao_etica: string | null;
  aprendizado_tecnico: string | null;
  pergunta_supervisao: string | null;
  espelho_toca_minha: string | null;
  espelho_risco_projecao: string | null;
  espelho_supervisao: string | null;
  enviar_para_supervisao: boolean;
  status_supervisao: string;
  cliente_id: string | null;
  sessao_id: string | null;
  created_at: string;
  cliente?: { nome: string } | null;
}

interface Cliente {
  id: string;
  nome: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  privado: { label: 'Privado', variant: 'secondary' },
  enviado: { label: 'Enviado', variant: 'default' },
  discutido: { label: 'Discutido', variant: 'outline' },
};

export default function JardimOficioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registros, setRegistros] = useState<JardimRegistro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [reflexao, setReflexao] = useState('');
  const [tensao, setTensao] = useState('');
  const [aprendizado, setAprendizado] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [clienteId, setClienteId] = useState<string>('none');
  const [enviarSupervisao, setEnviarSupervisao] = useState(false);
  const [espelhoToca, setEspelhoToca] = useState('');
  const [espelhoRisco, setEspelhoRisco] = useState('');
  const [espelhoSupervisao, setEspelhoSupervisao] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    const [registrosRes, clientesRes] = await Promise.all([
      supabase
        .from('jardim_do_oficio')
        .select('*, cliente:clientes(nome)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('clientes')
        .select('id, nome')
        .eq('terapeuta_id', user.id)
        .eq('status', 'ativo'),
    ]);

    if (registrosRes.data) setRegistros(registrosRes.data as unknown as JardimRegistro[]);
    if (clientesRes.data) setClientes(clientesRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setReflexao('');
    setTensao('');
    setAprendizado('');
    setPergunta('');
    setClienteId('none');
    setEnviarSupervisao(false);
    setEspelhoToca('');
    setEspelhoRisco('');
    setEspelhoSupervisao('');
  };

  const handleSave = async () => {
    if (!user || !reflexao.trim()) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      reflexao_profissional: reflexao.trim(),
      tensao_etica: tensao.trim() || null,
      aprendizado_tecnico: aprendizado.trim() || null,
      pergunta_supervisao: pergunta.trim() || null,
      cliente_id: clienteId !== 'none' ? clienteId : null,
      enviar_para_supervisao: enviarSupervisao,
      status_supervisao: enviarSupervisao ? 'enviado' : 'privado',
      espelho_toca_minha: espelhoToca.trim() || null,
      espelho_risco_projecao: espelhoRisco.trim() || null,
      espelho_supervisao: espelhoSupervisao.trim() || null,
    };

    const { error } = await supabase.from('jardim_do_oficio').insert(payload as any);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Reflexão registrada ✨' });
      setDialogOpen(false);
      resetForm();
      loadData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('jardim_do_oficio').delete().eq('id', id);
    if (!error) {
      setRegistros((prev) => prev.filter((r) => r.id !== id));
      toast({ title: 'Registro removido' });
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

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/casa-das-maquinas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa das Máquinas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Jardim do Ofício</span>
        </nav>

        <SectionHeader
          title="Jardim do Ofício"
          subtitle="Espaço de reflexão sobre sua postura profissional e amadurecimento da prática"
          icon={<Sprout className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{registros.length} reflexões registradas</p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Reflexão
          </Button>
        </div>

        {registros.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Sprout className="w-12 h-12 mx-auto mb-4 text-gold/40" />
              <p className="text-muted-foreground">Nenhuma reflexão registrada ainda.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comece registrando suas observações sobre a prática profissional.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {registros.map((r) => {
              const status = statusConfig[r.status_supervisao] || statusConfig.privado;
              return (
                <Card key={r.id} className="hover:border-gold/20 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        {format(new Date(r.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        {r.cliente && (
                          <span className="text-gold ml-2">• {(r.cliente as any).nome}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-3">{r.reflexao_profissional}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {r.tensao_etica && (
                        <div className="bg-secondary/50 rounded-md p-2">
                          <span className="font-medium text-muted-foreground">Tensão ética:</span>
                          <p className="mt-0.5">{r.tensao_etica}</p>
                        </div>
                      )}
                      {r.aprendizado_tecnico && (
                        <div className="bg-secondary/50 rounded-md p-2">
                          <span className="font-medium text-muted-foreground">Aprendizado:</span>
                          <p className="mt-0.5">{r.aprendizado_tecnico}</p>
                        </div>
                      )}
                      {r.pergunta_supervisao && (
                        <div className="bg-secondary/50 rounded-md p-2">
                          <span className="font-medium text-muted-foreground">Para supervisão:</span>
                          <p className="mt-0.5">{r.pergunta_supervisao}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* New Reflection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-gold" />
              Nova Reflexão Profissional
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Cliente (opcional)</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma cliente vinculada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reflexão profissional *</Label>
              <Textarea
                value={reflexao}
                onChange={(e) => setReflexao(e.target.value)}
                placeholder="O que observei sobre minha postura neste atendimento..."
                rows={4}
              />
            </div>

            <div>
              <Label>Tensão ética</Label>
              <Input
                value={tensao}
                onChange={(e) => setTensao(e.target.value)}
                placeholder="Alguma tensão ética percebida..."
              />
            </div>

            <div>
              <Label>Aprendizado técnico</Label>
              <Input
                value={aprendizado}
                onChange={(e) => setAprendizado(e.target.value)}
                placeholder="O que aprendi tecnicamente..."
              />
            </div>

            <div>
              <Label>Pergunta para supervisão</Label>
              <Input
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                placeholder="Gostaria de levar para supervisão..."
              />
            </div>

            {/* Espelho da Terapeuta */}
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Espelho da Terapeuta</p>
              <div className="space-y-3">
                <div>
                  <Label>O que isso toca em mim?</Label>
                  <Textarea
                    value={espelhoToca}
                    onChange={(e) => setEspelhoToca(e.target.value)}
                    placeholder="Que ressonâncias pessoais este caso desperta?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Risco de projeção</Label>
                  <Input
                    value={espelhoRisco}
                    onChange={(e) => setEspelhoRisco(e.target.value)}
                    placeholder="Onde posso estar projetando meu próprio material?"
                  />
                </div>
                <div>
                  <Label>Levar para supervisão</Label>
                  <Input
                    value={espelhoSupervisao}
                    onChange={(e) => setEspelhoSupervisao(e.target.value)}
                    placeholder="O que preciso discutir em supervisão?"
                  />
                </div>
              </div>
            </div>

            {user && canAccessFeature(user.portal, 'mentorada') && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="supervisao"
                  checked={enviarSupervisao}
                  onCheckedChange={(checked) => setEnviarSupervisao(!!checked)}
                />
                <Label htmlFor="supervisao" className="text-sm cursor-pointer">
                  Enviar para supervisão
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !reflexao.trim()} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
