import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Waves } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ESTADOS = [
  { value: 'retencao', label: 'Retenção' },
  { value: 'travessia', label: 'Travessia' },
  { value: 'emergencia', label: 'Emergência' },
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

    const { data: resData } = await (supabase.from('tecela_ressonancias' as any) as any).select('registro_id');
    const counts: Record<string, number> = {};
    (resData || []).forEach((r: any) => { counts[r.registro_id] = (counts[r.registro_id] || 0) + 1; });
    setRessonancias(counts);

    if (user) {
      const { data: myRes } = await (supabase.from('tecela_ressonancias' as any) as any)
        .select('registro_id').eq('user_id', user.id);
      setMinhasRessonancias(new Set((myRes || []).map((r: any) => r.registro_id)));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchRegistros(); }, [fetchRegistros]);

  const handleCreate = async () => {
    if (!user || !form.titulo_simbolico.trim() || !form.texto.trim()) return;
    await (supabase.from('tecela_registros_campo' as any) as any).insert({
      autor_id: user.id, titulo_simbolico: form.titulo_simbolico.trim(),
      texto: form.texto.trim(), torre_ativa: form.torre_ativa || null,
      porta_ativa: form.porta_ativa || null, arquetipo_presente: form.arquetipo_presente || null,
      estado_campo: form.estado_campo,
    });
    toast.success('Registro tecido');
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

  if (isLoading) return <div className="text-center py-16 text-muted-foreground/40 font-display text-sm italic">Revelando os tecidos...</div>;

  return (
    <div className="space-y-6">
      {/* Header — minimal */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40">Registros do campo</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-1.5 text-gold/50 hover:text-gold text-[10px] uppercase tracking-[0.3em] transition-colors">
              <Plus className="w-3 h-3" /> Tecer
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-gold/80 text-base">Novo registro de campo</DialogTitle></DialogHeader>
            <div className="space-y-5 pt-2">
              <div>
                <p className="text-[10px] text-muted-foreground/50 mb-1.5">Título simbólico</p>
                <Input placeholder="Nomeie este campo..." value={form.titulo_simbolico} onChange={e => setForm(f => ({ ...f, titulo_simbolico: e.target.value }))} className="bg-transparent border-border/20" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 mb-1.5">O que atravessa</p>
                <Textarea placeholder="O que está vivo..." value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))} rows={4} className="bg-transparent border-border/20 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground/50 mb-1.5">Torre</p>
                  <Input placeholder="—" value={form.torre_ativa} onChange={e => setForm(f => ({ ...f, torre_ativa: e.target.value }))} className="bg-transparent border-border/20" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/50 mb-1.5">Porta</p>
                  <Input placeholder="—" value={form.porta_ativa} onChange={e => setForm(f => ({ ...f, porta_ativa: e.target.value }))} className="bg-transparent border-border/20" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/50 mb-1.5">Arquétipo</p>
                  <Input placeholder="—" value={form.arquetipo_presente} onChange={e => setForm(f => ({ ...f, arquetipo_presente: e.target.value }))} className="bg-transparent border-border/20" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 mb-1.5">Estado do campo</p>
                <Select value={form.estado_campo} onValueChange={v => setForm(f => ({ ...f, estado_campo: v }))}>
                  <SelectTrigger className="bg-transparent border-border/20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button onClick={handleCreate} className="w-full text-center py-2.5 text-gold/60 hover:text-gold text-xs uppercase tracking-[0.3em] border border-gold/15 rounded-md transition-colors">
                Tecer
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Records — quiet cards */}
      {registros.map(registro => {
        const resCount = ressonancias[registro.id] || 0;
        const isRessoou = minhasRessonancias.has(registro.id);

        return (
          <div key={registro.id} className="border-l-2 border-border/10 pl-5 py-3 group">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display text-sm text-foreground/80">{registro.titulo_simbolico}</h3>
              <span className="text-[9px] text-muted-foreground/30 uppercase tracking-wider shrink-0">
                {registro.estado_campo}
              </span>
            </div>
            
            <p className="text-sm text-foreground/60 whitespace-pre-wrap leading-relaxed mb-3">{registro.texto}</p>

            {/* Symbolic markers — subtle */}
            {(registro.torre_ativa || registro.porta_ativa || registro.arquetipo_presente) && (
              <div className="flex gap-4 mb-3">
                {registro.torre_ativa && <span className="text-[9px] text-muted-foreground/30">{registro.torre_ativa}</span>}
                {registro.porta_ativa && <span className="text-[9px] text-muted-foreground/30">{registro.porta_ativa}</span>}
                {registro.arquetipo_presente && <span className="text-[9px] text-muted-foreground/30">{registro.arquetipo_presente}</span>}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-[9px] text-muted-foreground/25">
                {registro.profiles?.nome || 'Anônima'} · {formatDistanceToNow(new Date(registro.created_at), { addSuffix: true, locale: ptBR })}
              </p>
              <button
                className={`inline-flex items-center gap-1.5 text-[10px] transition-colors ${
                  isRessoou ? 'text-gold/60' : 'text-muted-foreground/25 hover:text-gold/40'
                }`}
                onClick={() => toggleRessonancia(registro.id)}
              >
                <Waves className="w-3 h-3" />
                {resCount > 0 && resCount}
              </button>
            </div>
          </div>
        );
      })}

      {registros.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground/30 font-display text-sm italic">
            O campo aguarda os primeiros fios.
          </p>
        </div>
      )}
    </div>
  );
}
