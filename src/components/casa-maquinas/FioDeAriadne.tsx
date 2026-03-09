import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2, Plus, AlertTriangle, Repeat, ShieldOff, Circle, Flame,
  Trash2, Edit2, CheckCircle, Eye, X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type LabyType = 'repetitivo' | 'evitativo' | 'circular' | 'autoboicote';
type Severidade = 'leve' | 'medio' | 'intenso';
type LabyStatus = 'ativo' | 'observacao' | 'integrado';

interface Labyrinth {
  id: string;
  nome_padrao: string;
  descricao: string | null;
  tipo: LabyType;
  severidade: Severidade;
  gatilhos: string[];
  acoes_ruptura: string[];
  status: LabyStatus;
  sessoes_relacionadas: number;
  ultima_ocorrencia: string | null;
  notas: string | null;
  created_at: string;
}

const TYPE_CFG: Record<LabyType, { label: string; icon: typeof Repeat; color: string }> = {
  repetitivo: { label: 'Repetitivo', icon: Repeat, color: 'text-amber-400' },
  evitativo: { label: 'Evitativo', icon: ShieldOff, color: 'text-blue-400' },
  circular: { label: 'Circular', icon: Circle, color: 'text-purple-400' },
  autoboicote: { label: 'Autoboicote', icon: Flame, color: 'text-red-400' },
};

const SEV_CFG: Record<Severidade, { label: string; color: string }> = {
  leve: { label: 'Leve', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  medio: { label: 'Médio', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  intenso: { label: 'Intenso', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

const STATUS_CFG: Record<LabyStatus, { label: string; color: string; icon: typeof Eye }> = {
  ativo: { label: 'Ativo', color: 'bg-red-500/15 text-red-400', icon: Flame },
  observacao: { label: 'Observação', color: 'bg-amber-500/15 text-amber-400', icon: Eye },
  integrado: { label: 'Integrado', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
};

const emptyForm = {
  nome_padrao: '',
  descricao: '',
  tipo: 'repetitivo' as LabyType,
  severidade: 'medio' as Severidade,
  gatilhos_text: '',
  acoes_text: '',
  notas: '',
};

export function FioDeAriadne({ clienteId }: { clienteId: string }) {
  const { user } = useAuth();
  const [labyrinths, setLabyrinths] = useState<Labyrinth[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadData(); }, [clienteId]);

  const loadData = async () => {
    const { data } = await supabase
      .from('client_labyrinths')
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    setLabyrinths((data || []) as Labyrinth[]);
    setLoading(false);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (l: Labyrinth) => {
    setEditingId(l.id);
    setForm({
      nome_padrao: l.nome_padrao,
      descricao: l.descricao || '',
      tipo: l.tipo,
      severidade: l.severidade,
      gatilhos_text: l.gatilhos.join(', '),
      acoes_text: l.acoes_ruptura.join(', '),
      notas: l.notas || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.nome_padrao.trim()) return;
    setSaving(true);

    const payload = {
      client_id: clienteId,
      therapist_id: user.id,
      nome_padrao: form.nome_padrao.trim(),
      descricao: form.descricao || null,
      tipo: form.tipo,
      severidade: form.severidade,
      gatilhos: form.gatilhos_text ? form.gatilhos_text.split(',').map(s => s.trim()).filter(Boolean) : [],
      acoes_ruptura: form.acoes_text ? form.acoes_text.split(',').map(s => s.trim()).filter(Boolean) : [],
      notas: form.notas || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('client_labyrinths').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('client_labyrinths').insert(payload));
    }

    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success(editingId ? 'Labirinto atualizado' : 'Labirinto registrado');
    setDialogOpen(false);
    setForm(emptyForm);
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: LabyStatus) => {
    await supabase.from('client_labyrinths').update({ status: newStatus }).eq('id', id);
    toast.success('Status atualizado');
    loadData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('client_labyrinths').delete().eq('id', id);
    toast.success('Labirinto removido');
    loadData();
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;

  const active = labyrinths.filter(l => l.status === 'ativo');
  const observing = labyrinths.filter(l => l.status === 'observacao');
  const integrated = labyrinths.filter(l => l.status === 'integrado');

  const renderCard = (l: Labyrinth) => {
    const tCfg = TYPE_CFG[l.tipo];
    const sCfg = SEV_CFG[l.severidade];
    const stCfg = STATUS_CFG[l.status];
    const Icon = tCfg.icon;

    return (
      <Card key={l.id} className="border-border/20 bg-card/50 hover:border-border/40 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={cn('w-4 h-4', tCfg.color)} />
              <span className="text-sm font-medium text-foreground/80">{l.nome_padrao}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={cn('text-[9px]', sCfg.color)}>{sCfg.label}</Badge>
              <Badge variant="outline" className={cn('text-[9px]', stCfg.color)}>{stCfg.label}</Badge>
            </div>
          </div>

          {l.descricao && <p className="text-xs text-foreground/50 mb-2">{l.descricao}</p>}

          {l.gatilhos.length > 0 && (
            <div className="mb-2">
              <span className="text-[9px] text-primary/60 uppercase">Gatilhos</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {l.gatilhos.map((g, i) => (
                  <Badge key={i} variant="outline" className="text-[9px] border-border/30 text-foreground/40">{g}</Badge>
                ))}
              </div>
            </div>
          )}

          {l.acoes_ruptura.length > 0 && (
            <div className="mb-2">
              <span className="text-[9px] text-emerald-500/60 uppercase">Ações de Ruptura</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {l.acoes_ruptura.map((a, i) => (
                  <Badge key={i} variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400/60">{a}</Badge>
                ))}
              </div>
            </div>
          )}

          {l.notas && <p className="text-[10px] text-foreground/40 italic mt-1">{l.notas}</p>}

          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/10">
            <Select value={l.status} onValueChange={(v) => handleStatusChange(l.id, v as LabyStatus)}>
              <SelectTrigger className="h-7 text-[10px] w-28 border-border/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">🔥 Ativo</SelectItem>
                <SelectItem value="observacao">👁 Observação</SelectItem>
                <SelectItem value="integrado">✅ Integrado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground/40 hover:text-foreground" onClick={() => openEdit(l)}>
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground/30 hover:text-destructive" onClick={() => handleDelete(l.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Alert className="border-primary/20 bg-primary/5">
        <AlertTriangle className="w-4 h-4 text-primary" />
        <AlertDescription className="text-xs text-foreground/60">
          <strong>Fio de Ariadne</strong> — Mapeamento de padrões labirínticos. Ferramenta de leitura simbólica.
        </AlertDescription>
      </Alert>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ativos', count: active.length, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Observação', count: observing.length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Integrados', count: integrated.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(s => (
          <Card key={s.label} className="border-border/20 bg-card/40">
            <CardContent className="p-3 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary" onClick={openNew}>
        <Plus className="w-4 h-4" /> Mapear Labirinto
      </Button>

      {/* Active */}
      {active.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-red-400/70 font-semibold">Labirintos Ativos</h4>
          {active.map(renderCard)}
        </div>
      )}

      {/* Observing */}
      {observing.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-amber-400/70 font-semibold">Em Observação</h4>
          {observing.map(renderCard)}
        </div>
      )}

      {/* Integrated */}
      {integrated.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-emerald-400/70 font-semibold">Integrados</h4>
          {integrated.map(renderCard)}
        </div>
      )}

      {labyrinths.length === 0 && (
        <p className="text-center text-muted-foreground/40 py-6 text-sm">Nenhum labirinto mapeado. Use o botão acima para registrar padrões repetitivos.</p>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Labirinto' : 'Mapear Labirinto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Nome do Padrão</label>
              <Input value={form.nome_padrao} onChange={e => setForm(f => ({ ...f, nome_padrao: e.target.value }))} placeholder="Ex: Ciclo de abandono" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Descrição</label>
              <Textarea rows={2} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Como se manifesta este padrão?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Tipo</label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v as LabyType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repetitivo">🔁 Repetitivo</SelectItem>
                    <SelectItem value="evitativo">🛡 Evitativo</SelectItem>
                    <SelectItem value="circular">⭕ Circular</SelectItem>
                    <SelectItem value="autoboicote">🔥 Autoboicote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Severidade</label>
                <Select value={form.severidade} onValueChange={v => setForm(f => ({ ...f, severidade: v as Severidade }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="intenso">Intenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Gatilhos (separados por vírgula)</label>
              <Input value={form.gatilhos_text} onChange={e => setForm(f => ({ ...f, gatilhos_text: e.target.value }))} placeholder="Ex: rejeição, abandono, cobrança" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Ações de Ruptura (separadas por vírgula)</label>
              <Input value={form.acoes_text} onChange={e => setForm(f => ({ ...f, acoes_text: e.target.value }))} placeholder="Ex: pausa consciente, expressão da necessidade" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Notas</label>
              <Textarea rows={2} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="Observações clínicas..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.nome_padrao.trim() || saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingId ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
