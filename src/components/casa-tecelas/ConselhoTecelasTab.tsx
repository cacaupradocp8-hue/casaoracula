import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Conselho {
  id: string;
  autor_id: string;
  situacao: string;
  territorio_cidadela: string | null;
  torre_envolvida: string | null;
  pergunta_facilitadora: string;
  created_at: string;
  profiles?: { nome: string };
}

interface Resposta {
  id: string;
  conteudo: string;
  autor_id: string;
  created_at: string;
  profiles?: { nome: string };
}

export function ConselhoTecelasTab() {
  const { user } = useAuth();
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<string, Resposta[]>>({});
  const [novaResposta, setNovaResposta] = useState('');
  const [form, setForm] = useState({
    situacao: '', territorio_cidadela: '', torre_envolvida: '', pergunta_facilitadora: '',
  });

  const fetchConselhos = useCallback(async () => {
    setIsLoading(true);
    const { data } = await (supabase.from('tecela_conselho' as any) as any)
      .select('*, profiles:autor_id(nome)')
      .eq('visivel', true)
      .order('created_at', { ascending: false });
    setConselhos(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchConselhos(); }, [fetchConselhos]);

  const fetchRespostas = async (conselhoId: string) => {
    const { data } = await (supabase.from('tecela_conselho_respostas' as any) as any)
      .select('*, profiles:autor_id(nome)')
      .eq('conselho_id', conselhoId)
      .order('created_at', { ascending: true });
    setRespostas(prev => ({ ...prev, [conselhoId]: data || [] }));
  };

  const handleExpand = (id: string) => {
    const newId = expandedId === id ? null : id;
    setExpandedId(newId);
    if (newId) fetchRespostas(newId);
  };

  const handleCreate = async () => {
    if (!user || !form.situacao.trim() || !form.pergunta_facilitadora.trim()) return;
    await (supabase.from('tecela_conselho' as any) as any).insert({
      autor_id: user.id,
      situacao: form.situacao.trim(),
      territorio_cidadela: form.territorio_cidadela || null,
      torre_envolvida: form.torre_envolvida || null,
      pergunta_facilitadora: form.pergunta_facilitadora.trim(),
    });
    toast.success('Pergunta tecida no Conselho');
    setOpen(false);
    setForm({ situacao: '', territorio_cidadela: '', torre_envolvida: '', pergunta_facilitadora: '' });
    fetchConselhos();
  };

  const handleResponder = async (conselhoId: string) => {
    if (!user || !novaResposta.trim()) return;
    await (supabase.from('tecela_conselho_respostas' as any) as any).insert({
      conselho_id: conselhoId, autor_id: user.id, conteudo: novaResposta.trim(),
    });
    setNovaResposta('');
    fetchRespostas(conselhoId);
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground font-display">Abrindo o Conselho...</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground italic">
            Troca entre pares em linguagem simbólica. Sem diagnósticos. Sem julgamentos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Trazer ao Conselho</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-gold">Trazer ao Conselho</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Situação apresentada</label>
                <Textarea placeholder="Descreva o campo sem identificações..." value={form.situacao} onChange={e => setForm(f => ({ ...f, situacao: e.target.value }))} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Território da CidaDELA</label>
                  <Input placeholder="ex: Praça do Abalo" value={form.territorio_cidadela} onChange={e => setForm(f => ({ ...f, territorio_cidadela: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Torre envolvida</label>
                  <Input placeholder="ex: Torre da Vigilância" value={form.torre_envolvida} onChange={e => setForm(f => ({ ...f, torre_envolvida: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Pergunta da facilitadora</label>
                <Textarea placeholder="Sua pergunta simbólica ao Conselho..." value={form.pergunta_facilitadora} onChange={e => setForm(f => ({ ...f, pergunta_facilitadora: e.target.value }))} rows={2} />
              </div>
              <Button onClick={handleCreate} className="w-full" variant="gold">Tecer a Pergunta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {conselhos.map(conselho => (
        <Card key={conselho.id} className="border-border/30 hover:border-gold/20 transition-all">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => handleExpand(conselho.id)}>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-gold mt-1 shrink-0" />
                <p className="text-sm font-display text-foreground leading-relaxed">{conselho.pergunta_facilitadora}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {conselho.profiles?.nome || 'Anônima'} · {formatDistanceToNow(new Date(conselho.created_at), { addSuffix: true, locale: ptBR })}
              </p>
              <div className="flex gap-2">
                {conselho.territorio_cidadela && <Badge variant="secondary" className="text-xs">{conselho.territorio_cidadela}</Badge>}
                {conselho.torre_envolvida && <Badge variant="secondary" className="text-xs">{conselho.torre_envolvida}</Badge>}
              </div>
            </div>
          </CardHeader>

          {expandedId === conselho.id && (
            <CardContent className="space-y-4 border-t border-border/20 pt-4">
              {/* Situação */}
              <div className="p-3 rounded-lg bg-card/50 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1 tracking-widest uppercase">Situação</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{conselho.situacao}</p>
              </div>

              {/* Respostas */}
              <div className="space-y-3">
                {(respostas[conselho.id] || []).map(resp => (
                  <div key={resp.id} className="pl-4 border-l-2 border-gold/20">
                    <p className="text-sm text-foreground/90">{resp.conteudo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {resp.profiles?.nome || 'Anônima'} · {formatDistanceToNow(new Date(resp.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Nova resposta */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Responda em linguagem simbólica..."
                  value={novaResposta}
                  onChange={e => setNovaResposta(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleResponder(conselho.id)} disabled={!novaResposta.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {conselhos.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-display">O Conselho aguarda a primeira pergunta.</p>
        </div>
      )}
    </div>
  );
}
