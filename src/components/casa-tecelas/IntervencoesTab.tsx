import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Heart } from 'lucide-react';
import { useTecelaData, useTecelaFavoritos } from '@/hooks/useTecela';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Intervencao {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  district_id: string | null;
  tags: string[];
  nivel: string;
  contraindicacoes: string | null;
  created_by: string;
  aprovado: boolean;
  created_at: string;
}

const TIPOS = [
  { value: 'pergunta_clinica', label: 'Pergunta Clínica' },
  { value: 'micro_ritual', label: 'Micro Ritual' },
  { value: 'exercicio_narrativo', label: 'Exercício Narrativo' },
  { value: 'intervencao_simbolica', label: 'Intervenção Simbólica' },
];

export function IntervencoesTab({ canCreate, isAdmin }: { canCreate: boolean; isAdmin: boolean }) {
  const { user } = useAuth();
  const { data: intervencoes, isLoading, refresh } = useTecelaData<Intervencao>('tecela_intervencoes');
  const { toggleFavorito, isFavorito } = useTecelaFavoritos();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ titulo: '', conteudo: '', tipo: 'intervencao_simbolica', nivel: 'basico', contraindicacoes: '' });

  const handleCreate = async () => {
    if (!user || !form.titulo.trim() || !form.conteudo.trim()) return;
    await (supabase.from('tecela_intervencoes' as any) as any).insert({
      ...form, created_by: user.id, contraindicacoes: form.contraindicacoes || null,
    });
    toast.success('Intervenção enviada para aprovação');
    setOpen(false);
    setForm({ titulo: '', conteudo: '', tipo: 'intervencao_simbolica', nivel: 'basico', contraindicacoes: '' });
    refresh();
  };

  const filtered = filter === 'all' ? intervencoes : intervencoes.filter(i => i.tipo === filter);

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando intervenções...</div>;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todas</Button>
          {TIPOS.map(t => (
            <Button key={t.value} variant={filter === t.value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(t.value)}>{t.label}</Button>
          ))}
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm"><Plus className="h-4 w-4 mr-1" /> Nova</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Intervenção</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.nivel} onValueChange={v => setForm(f => ({ ...f, nivel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Conteúdo da intervenção *" value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} rows={4} />
                <Input placeholder="Contraindicações (opcional)" value={form.contraindicacoes} onChange={e => setForm(f => ({ ...f, contraindicacoes: e.target.value }))} />
                <Button onClick={handleCreate} className="w-full" variant="gold">Enviar</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filtered.map(int => (
        <Card key={int.id} className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base flex-1">{int.titulo}</CardTitle>
              <Badge variant="secondary" className="text-xs">{TIPOS.find(t => t.value === int.tipo)?.label || int.tipo}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{int.nivel}</Badge>
              {!int.aprovado && <Badge variant="outline" className="text-xs">Pendente</Badge>}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorito('intervencao', int.id)}>
                <Heart className={`h-4 w-4 ${isFavorito('intervencao', int.id) ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{int.conteudo}</p>
            {int.contraindicacoes && (
              <p className="text-xs text-destructive/70 mt-2">⚠️ {int.contraindicacoes}</p>
            )}
          </CardContent>
        </Card>
      ))}
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma intervenção encontrada.</p>}
    </div>
  );
}
