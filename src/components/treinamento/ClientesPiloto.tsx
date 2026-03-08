import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Send, Loader2, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RegistroPiloto {
  id: string;
  nome_cliente: string;
  numero_sessao: number;
  prontuario: string;
  reflexoes: string;
  status_supervisao: string;
  supervisor_feedback: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; style: string; icon: typeof Clock }> = {
  pendente: { label: 'Pendente', style: 'bg-amber-500/15 text-amber-400', icon: Clock },
  'em revisão': { label: 'Em Revisão', style: 'bg-blue-500/15 text-blue-400', icon: AlertCircle },
  aprovado: { label: 'Aprovado', style: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle2 },
  reprovado: { label: 'Reprovado', style: 'bg-red-500/15 text-red-400', icon: XCircle },
};

export function ClientesPiloto() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState<RegistroPiloto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome_cliente: '', numero_sessao: 1, prontuario: '', reflexoes: '' });

  const loadRegistros = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('clientes_piloto')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setRegistros((data as unknown as RegistroPiloto[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadRegistros(); }, [user]);

  const submeter = async () => {
    if (!user) return;
    if (!form.nome_cliente.trim() || !form.prontuario.trim()) {
      toast.error('Preencha o nome e o prontuário.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('clientes_piloto').insert({
      user_id: user.id,
      nome_cliente: form.nome_cliente.trim(),
      numero_sessao: form.numero_sessao,
      prontuario: form.prontuario.trim(),
      reflexoes: form.reflexoes.trim(),
      status_supervisao: 'pendente',
    });
    setSaving(false);
    if (error) toast.error('Erro ao submeter');
    else {
      toast.success('Registro submetido para supervisão!');
      setForm({ nome_cliente: '', numero_sessao: 1, prontuario: '', reflexoes: '' });
      setDialogOpen(false);
      loadRegistros();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Documente sessões de estágio com clientes reais e submeta para supervisão.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-[#0B1B2B] border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">Registrar Sessão Piloto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-foreground/60 mb-1 block">Nome do Cliente-Piloto *</label>
                <Input
                  value={form.nome_cliente}
                  onChange={e => setForm(f => ({ ...f, nome_cliente: e.target.value }))}
                  placeholder="Use um codinome para proteger a identidade"
                  className="bg-background border-primary/10"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm text-foreground/60 mb-1 block">Número da Sessão</label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={form.numero_sessao}
                  onChange={e => setForm(f => ({ ...f, numero_sessao: parseInt(e.target.value) || 1 }))}
                  className="bg-background border-primary/10 w-24"
                />
              </div>
              <div>
                <label className="text-sm text-foreground/60 mb-1 block">Prontuário da Sessão *</label>
                <Textarea
                  value={form.prontuario}
                  onChange={e => setForm(f => ({ ...f, prontuario: e.target.value }))}
                  placeholder="Descreva o que aconteceu na sessão, ferramentas utilizadas, observações..."
                  className="min-h-[120px] bg-background border-primary/10"
                  maxLength={5000}
                />
              </div>
              <div>
                <label className="text-sm text-foreground/60 mb-1 block">Reflexões da Terapeuta</label>
                <Textarea
                  value={form.reflexoes}
                  onChange={e => setForm(f => ({ ...f, reflexoes: e.target.value }))}
                  placeholder="O que você percebeu? Dúvidas? Pontos de atenção?"
                  className="min-h-[80px] bg-background border-primary/10"
                  maxLength={3000}
                />
              </div>
              <Button onClick={submeter} disabled={saving} className="w-full bg-primary text-primary-foreground">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Submeter para Supervisão
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {registros.length === 0 ? (
        <Card className="bg-[#0F2438] border-primary/20 text-center py-12">
          <CardContent>
            <FileText className="w-10 h-10 mx-auto text-primary/40 mb-3" />
            <p className="text-muted-foreground">Nenhuma sessão registrada.</p>
            <p className="text-xs text-muted-foreground/50 mt-1">Clique em "Nova Sessão" para documentar seu primeiro atendimento piloto.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {registros.map(r => {
            const status = STATUS_CONFIG[r.status_supervisao] || STATUS_CONFIG.pendente;
            const StatusIcon = status.icon;
            return (
              <Card key={r.id} className="bg-[#0F2438] border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      {r.nome_cliente} — Sessão {r.numero_sessao}
                    </CardTitle>
                    <Badge className={`${status.style} text-xs flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.prontuario}</p>
                  {r.supervisor_feedback && (
                    <div className="p-3 rounded-lg bg-background border border-primary/10">
                      <p className="text-xs text-primary mb-1 font-medium">Feedback da Supervisão</p>
                      <p className="text-sm text-foreground/70">{r.supervisor_feedback}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground/40">
                    {new Date(r.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
