import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Waves, Flame, Zap, Ripple } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ESTADOS = [
  { value: 'retencao', label: 'Retenção', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { value: 'travessia', label: 'Travessia', icon: Flame, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  { value: 'emergencia', label: 'Emergência', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

interface RegistroCampo {
  id: string;
  autor_id: string;
  titulo_simbolico: string;
  texto: string;
  torre_ativa: string | null;
  porta_ativa: string | null;
  arquetipo_presente: string | null;
  estado_campo: string;
  created_at: string;
  profiles?: { nome: string; avatar_url: string | null };
}

export function TecidosTab() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState<RegistroCampo[]>([]);
  const [ressonancias, setRessonancias] = useState<Record<string, number>>({});
  const [minhasRessonancias, setMinhasRessonancias] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterEstado, setFilterEstado] = useState('all');
  const [form, setForm] = useState({
    titulo_simbolico: '', texto: '', torre_ativa: '', porta_ativa: '', arquetipo_presente: '', estado_campo: 'travessia',
  });

  const fetchRegistros = useCallback(async () => {
    setIsLoading(true);
    const { data } = await (supabase.from('tecela_registros_campo' as any) as any)
      .select('*, profiles:autor_id(nome, avatar_url)')
      .eq('visivel', true)
      .order('created_at', { ascending: false });
    setRegistros(data || []);

    // Fetch resonance counts
    const { data: resData } = await (supabase.from('tecela_ressonancias' as any) as any)
      .select('registro_id');
    const counts: Record<string, number> = {};
    (resData || []).forEach((r: any) => {
      counts[r.registro_id] = (counts[r.registro_id] || 0) + 1;
    });
    setRessonancias(counts);

    if (user) {
      const { data: myRes } = await (supabase.from('tecela_ressonancias' as any) as any)
        .select('registro_id')
        .eq('user_id', user.id);
      setMinhasRessonancias(new Set((myRes || []).map((r: any) => r.registro_id)));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchRegistros(); }, [fetchRegistros]);

  const handleCreate = async () => {
    if (!user || !form.titulo_simbolico.trim() || !form.texto.trim()) return;
    await (supabase.from('tecela_registros_campo' as any) as any).insert({
      autor_id: user.id,
      titulo_simbolico: form.titulo_simbolico.trim(),
      texto: form.texto.trim(),
      torre_ativa: form.torre_ativa || null,
      porta_ativa: form.porta_ativa || null,
      arquetipo_presente: form.arquetipo_presente || null,
      estado_campo: form.estado_campo,
    });
    toast.success('Registro de campo tecido');
    setOpen(false);
    setForm({ titulo_simbolico: '', texto: '', torre_ativa: '', porta_ativa: '', arquetipo_presente: '', estado_campo: 'travessia' });
    fetchRegistros();
  };

  const toggleRessonancia = async (registroId: string) => {
    if (!user) return;
    if (minhasRessonancias.has(registroId)) {
      await (supabase.from('tecela_ressonancias' as any) as any)
        .delete().eq('registro_id', registroId).eq('user_id', user.id);
      setMinhasRessonancias(prev => { const n = new Set(prev); n.delete(registroId); return n; });
      setRessonancias(prev => ({ ...prev, [registroId]: (prev[registroId] || 1) - 1 }));
    } else {
      await (supabase.from('tecela_ressonancias' as any) as any)
        .insert({ registro_id: registroId, user_id: user.id });
      setMinhasRessonancias(prev => new Set(prev).add(registroId));
      setRessonancias(prev => ({ ...prev, [registroId]: (prev[registroId] || 0) + 1 }));
    }
  };

  const filtered = filterEstado === 'all' ? registros : registros.filter(r => r.estado_campo === filterEstado);

  if (isLoading) return <div className="text-center py-8 text-muted-foreground font-display">Revelando os tecidos...</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button variant={filterEstado === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterEstado('all')} className="text-xs">
            Todos os campos
          </Button>
          {ESTADOS.map(e => (
            <Button key={e.value} variant={filterEstado === e.value ? 'default' : 'outline'} size="sm" onClick={() => setFilterEstado(e.value)} className="text-xs gap-1">
              <e.icon className="w-3 h-3" /> {e.label}
            </Button>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Tecer Registro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-gold">Novo Registro de Campo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Título simbólico</label>
                <Input placeholder="Nome este campo..." value={form.titulo_simbolico} onChange={e => setForm(f => ({ ...f, titulo_simbolico: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">O que atravessa o campo</label>
                <Textarea placeholder="Descreva o que está vivo..." value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))} rows={5} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Torre ativa</label>
                  <Input placeholder="ex: Vigilância" value={form.torre_ativa} onChange={e => setForm(f => ({ ...f, torre_ativa: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Porta ativa</label>
                  <Input placeholder="ex: Medo" value={form.porta_ativa} onChange={e => setForm(f => ({ ...f, porta_ativa: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Arquétipo</label>
                  <Input placeholder="ex: A Guardiã" value={form.arquetipo_presente} onChange={e => setForm(f => ({ ...f, arquetipo_presente: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Estado do campo</label>
                <Select value={form.estado_campo} onValueChange={v => setForm(f => ({ ...f, estado_campo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.label} — {e.value === 'retencao' ? 'O campo pede quietude' : e.value === 'travessia' ? 'O campo está em movimento' : 'Algo novo busca expressão'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full" variant="gold">Tecer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Records */}
      {filtered.map(registro => {
        const estado = ESTADOS.find(e => e.value === registro.estado_campo) || ESTADOS[1];
        const EstadoIcon = estado.icon;
        const resCount = ressonancias[registro.id] || 0;
        const isRessoou = minhasRessonancias.has(registro.id);

        return (
          <Card key={registro.id} className={`border ${estado.bg} transition-all`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <EstadoIcon className={`w-4 h-4 ${estado.color} shrink-0`} />
                    <h3 className="font-display text-base text-foreground truncate">{registro.titulo_simbolico}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {registro.profiles?.nome || 'Anônima'} · {formatDistanceToNow(new Date(registro.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                <Badge variant="outline" className={`text-xs ${estado.color} shrink-0`}>{estado.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{registro.texto}</p>

              {/* Symbolic markers */}
              <div className="flex flex-wrap gap-2">
                {registro.torre_ativa && <Badge variant="secondary" className="text-xs">Torre: {registro.torre_ativa}</Badge>}
                {registro.porta_ativa && <Badge variant="secondary" className="text-xs">Porta: {registro.porta_ativa}</Badge>}
                {registro.arquetipo_presente && <Badge variant="secondary" className="text-xs">Arquétipo: {registro.arquetipo_presente}</Badge>}
              </div>

              {/* Ressonância */}
              <div className="flex items-center pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 text-xs ${isRessoou ? 'text-gold' : 'text-muted-foreground'}`}
                  onClick={() => toggleRessonancia(registro.id)}
                >
                  <Waves className={`w-4 h-4 ${isRessoou ? 'text-gold' : ''}`} />
                  {resCount > 0 ? `${resCount} ressonância${resCount > 1 ? 's' : ''}` : 'Ressoar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Waves className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-display">O campo aguarda os primeiros fios.</p>
        </div>
      )}
    </div>
  );
}
