import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Leaf, Sun, Wind, Snowflake, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Estacao = 'primavera' | 'verao' | 'outono' | 'inverno';

interface SeasonRecord {
  id: string;
  estacao: Estacao;
  descricao: string | null;
  energia_predominante: string | null;
  necessidade_central: string | null;
  intervencao_sugerida: string | null;
  notas: string | null;
  data_registro: string;
  created_at: string;
}

const SEASON_CONFIG: Record<Estacao, { label: string; icon: typeof Leaf; color: string; bg: string; desc: string }> = {
  primavera: { label: 'Primavera', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Abertura, novos impulsos, vulnerabilidade criativa' },
  verao: { label: 'Verão', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', desc: 'Expansão, ação, exposição, potência' },
  outono: { label: 'Outono', icon: Wind, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'Colheita, desapego, reflexão, recolhimento' },
  inverno: { label: 'Inverno', icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Introspecção, silêncio, restauração, gestação' },
};

const ESTACOES: Estacao[] = ['primavera', 'verao', 'outono', 'inverno'];

export function OraculoEstacoes({ clienteId }: { clienteId: string }) {
  const { user } = useAuth();
  const [records, setRecords] = useState<SeasonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    estacao: '' as Estacao | '',
    descricao: '',
    energia_predominante: '',
    necessidade_central: '',
    intervencao_sugerida: '',
    notas: '',
  });

  useEffect(() => { loadRecords(); }, [clienteId]);

  const loadRecords = async () => {
    const { data } = await supabase
      .from('client_seasons')
      .select('*')
      .eq('client_id', clienteId)
      .order('data_registro', { ascending: false });
    setRecords((data || []) as SeasonRecord[]);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !form.estacao) return;
    setSaving(true);
    const { error } = await supabase.from('client_seasons').insert({
      client_id: clienteId,
      therapist_id: user.id,
      estacao: form.estacao,
      descricao: form.descricao || null,
      energia_predominante: form.energia_predominante || null,
      necessidade_central: form.necessidade_central || null,
      intervencao_sugerida: form.intervencao_sugerida || null,
      notas: form.notas || null,
    });
    setSaving(false);
    if (error) { toast.error('Erro ao salvar'); return; }
    toast.success('Estação registrada');
    setDialogOpen(false);
    setForm({ estacao: '', descricao: '', energia_predominante: '', necessidade_central: '', intervencao_sugerida: '', notas: '' });
    loadRecords();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('client_seasons').delete().eq('id', id);
    toast.success('Registro removido');
    loadRecords();
  };

  // Determine current season from most recent record
  const currentSeason = records.length > 0 ? records[0].estacao : null;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Alert className="border-primary/20 bg-primary/5">
        <AlertTriangle className="w-4 h-4 text-primary" />
        <AlertDescription className="text-xs text-foreground/60">
          <strong>Oráculo das Estações</strong> — Ferramenta de leitura do ritmo cíclico. Não substitui julgamento clínico.
        </AlertDescription>
      </Alert>

      {/* Season Wheel */}
      <div className="grid grid-cols-2 gap-3">
        {ESTACOES.map(est => {
          const cfg = SEASON_CONFIG[est];
          const Icon = cfg.icon;
          const isCurrent = currentSeason === est;
          const count = records.filter(r => r.estacao === est).length;
          return (
            <Card
              key={est}
              className={cn(
                'border transition-all cursor-default',
                isCurrent ? cfg.bg : 'border-border/30 bg-card/40'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn('w-5 h-5', isCurrent ? cfg.color : 'text-muted-foreground/40')} />
                  <span className={cn('text-sm font-medium', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>
                    {cfg.label}
                  </span>
                  {isCurrent && <Badge variant="outline" className="text-[9px] border-primary/30 text-primary ml-auto">Atual</Badge>}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{cfg.desc}</p>
                {count > 0 && (
                  <p className="text-[10px] text-muted-foreground/50 mt-2">{count} registro{count > 1 ? 's' : ''}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add button */}
      <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary" onClick={() => setDialogOpen(true)}>
        <Plus className="w-4 h-4" /> Registrar Estação
      </Button>

      {/* Timeline */}
      {records.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Histórico de Estações</h4>
          {records.map(r => {
            const cfg = SEASON_CONFIG[r.estacao];
            const Icon = cfg.icon;
            return (
              <Card key={r.id} className="border-border/20 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn('w-4 h-4', cfg.color)} />
                      <span className="text-sm font-medium text-foreground/80">{cfg.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.data_registro).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground/30 hover:text-destructive" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {r.descricao && <p className="text-xs text-foreground/60 mb-2">{r.descricao}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    {r.energia_predominante && (
                      <div><span className="text-[9px] text-primary/60 uppercase">Energia</span><p className="text-[11px] text-foreground/50">{r.energia_predominante}</p></div>
                    )}
                    {r.necessidade_central && (
                      <div><span className="text-[9px] text-primary/60 uppercase">Necessidade</span><p className="text-[11px] text-foreground/50">{r.necessidade_central}</p></div>
                    )}
                    {r.intervencao_sugerida && (
                      <div className="col-span-2"><span className="text-[9px] text-primary/60 uppercase">Intervenção Sugerida</span><p className="text-[11px] text-foreground/50">{r.intervencao_sugerida}</p></div>
                    )}
                  </div>
                  {r.notas && <p className="text-[10px] text-foreground/40 mt-2 italic">{r.notas}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {records.length === 0 && (
        <p className="text-center text-muted-foreground/40 py-6 text-sm">Nenhuma estação registrada. Mapeie o ritmo cíclico da psique.</p>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Estação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Estação</label>
              <Select value={form.estacao} onValueChange={v => setForm(f => ({ ...f, estacao: v as Estacao }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a estação" /></SelectTrigger>
                <SelectContent>
                  {ESTACOES.map(e => <SelectItem key={e} value={e}>{SEASON_CONFIG[e].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Descrição do momento</label>
              <Textarea rows={2} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Como se manifesta essa estação agora?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Energia predominante</label>
                <Input value={form.energia_predominante} onChange={e => setForm(f => ({ ...f, energia_predominante: e.target.value }))} placeholder="Ex: Recolhimento" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Necessidade central</label>
                <Input value={form.necessidade_central} onChange={e => setForm(f => ({ ...f, necessidade_central: e.target.value }))} placeholder="Ex: Silêncio" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Intervenção sugerida</label>
              <Input value={form.intervencao_sugerida} onChange={e => setForm(f => ({ ...f, intervencao_sugerida: e.target.value }))} placeholder="Ex: Ritual de introspecção" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Notas</label>
              <Textarea rows={2} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="Observações adicionais..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.estacao || saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
