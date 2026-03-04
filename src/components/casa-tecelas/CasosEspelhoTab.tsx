import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertTriangle, Heart } from 'lucide-react';
import { useTecelaData, useTecelaFavoritos } from '@/hooks/useTecela';
import { ComentariosSection } from './ComentariosSection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CasoEspelho {
  id: string;
  titulo: string;
  contexto_anonimizado: string;
  demanda_simbolica: string;
  leitura_oracula: string | null;
  erro_evitar: string | null;
  resultado: string | null;
  alerta_etico: string | null;
  district_id: string | null;
  tags: string[];
  created_by: string;
  aprovado: boolean;
  created_at: string;
}

export function CasosEspelhoTab({ canCreate, isAdmin }: { canCreate: boolean; isAdmin: boolean }) {
  const { user } = useAuth();
  const { data: casos, isLoading, refresh } = useTecelaData<CasoEspelho>('tecela_casos_espelho');
  const { toggleFavorito, isFavorito } = useTecelaFavoritos();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: '', contexto_anonimizado: '', demanda_simbolica: '', leitura_oracula: '', erro_evitar: '', resultado: '',
  });

  const handleCreate = async () => {
    if (!user || !form.titulo.trim() || !form.contexto_anonimizado.trim() || !form.demanda_simbolica.trim()) return;
    await (supabase.from('tecela_casos_espelho' as any) as any).insert({
      ...form, created_by: user.id, leitura_oracula: form.leitura_oracula || null,
      erro_evitar: form.erro_evitar || null, resultado: form.resultado || null,
    });
    toast.success('Caso enviado para aprovação');
    setOpen(false);
    setForm({ titulo: '', contexto_anonimizado: '', demanda_simbolica: '', leitura_oracula: '', erro_evitar: '', resultado: '' });
    refresh();
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando casos...</div>;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Casos anonimizados para estudo e reflexão coletiva</p>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Caso</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Novo Caso-Espelho</DialogTitle></DialogHeader>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span>Todos os dados devem ser completamente anonimizados. Não inclua nomes, locais ou informações identificáveis.</span>
              </div>
              <div className="space-y-3">
                <Input placeholder="Título do caso" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
                <Textarea placeholder="Contexto anonimizado *" value={form.contexto_anonimizado} onChange={e => setForm(f => ({ ...f, contexto_anonimizado: e.target.value }))} />
                <Textarea placeholder="Demanda simbólica *" value={form.demanda_simbolica} onChange={e => setForm(f => ({ ...f, demanda_simbolica: e.target.value }))} />
                <Textarea placeholder="Leitura Orácula (opcional)" value={form.leitura_oracula} onChange={e => setForm(f => ({ ...f, leitura_oracula: e.target.value }))} />
                <Input placeholder="Erro a evitar (opcional)" value={form.erro_evitar} onChange={e => setForm(f => ({ ...f, erro_evitar: e.target.value }))} />
                <Textarea placeholder="Resultado / desfecho (opcional)" value={form.resultado} onChange={e => setForm(f => ({ ...f, resultado: e.target.value }))} />
                <Button onClick={handleCreate} className="w-full" variant="gold">Enviar para Aprovação</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {casos.map(caso => (
        <Card key={caso.id} className="border-border/50">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === caso.id ? null : caso.id)}>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base flex-1">{caso.titulo}</CardTitle>
              {!caso.aprovado && <Badge variant="outline" className="text-xs">Pendente</Badge>}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); toggleFavorito('caso', caso.id); }}>
                <Heart className={`h-4 w-4 ${isFavorito('caso', caso.id) ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{caso.demanda_simbolica}</p>
          </CardHeader>
          {expandedId === caso.id && (
            <CardContent className="space-y-4">
              {caso.alerta_etico && (
                <div className="p-3 rounded-lg bg-gold/5 border border-gold/20 text-xs text-muted-foreground italic">
                  ⚠️ {caso.alerta_etico}
                </div>
              )}
              <div><p className="text-xs font-semibold text-muted-foreground mb-1">Contexto</p><p className="text-sm">{caso.contexto_anonimizado}</p></div>
              <div><p className="text-xs font-semibold text-muted-foreground mb-1">Demanda Simbólica</p><p className="text-sm">{caso.demanda_simbolica}</p></div>
              {caso.leitura_oracula && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Leitura Orácula</p><p className="text-sm">{caso.leitura_oracula}</p></div>}
              {caso.erro_evitar && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Erro a Evitar</p><p className="text-sm text-destructive/80">{caso.erro_evitar}</p></div>}
              {caso.resultado && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Resultado</p><p className="text-sm">{caso.resultado}</p></div>}
              <ComentariosSection refType="caso" refId={caso.id} />
            </CardContent>
          )}
        </Card>
      ))}
      {casos.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum caso compartilhado ainda.</p>}
    </div>
  );
}
