import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical, AlertCircle, Loader2 } from 'lucide-react';

interface Jornada {
  id: string;
  nome: string;
  subtitulo: string | null;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
  ordem: number;
  ativa: boolean;
  tipo: string;
  estacao_id: string;
  conteudo_semanal_id: string | null;
}

interface ConteudoSemanal {
  id: string;
  semana_numero: number;
  podcast_titulo: string | null;
}

interface Props {
  estacaoId: string;
}

export function EstradaTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Jornada | null>(null);
  const [form, setForm] = useState({
    nome: '', subtitulo: '', descricao: '', icone: '', cor: '', ordem: 0, conteudo_semanal_id: '',
  });

  const { data: jornadas = [], isLoading } = useQuery({
    queryKey: ['admin-estrada-jornadas', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_jornadas')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Jornada[];
    },
  });

  // Fetch semanas for linking — filtered by current estação
  const { data: semanas = [] } = useQuery({
    queryKey: ['admin-estrada-semanas', estacaoId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('clube_conteudo_semanal')
        .select('id, semana_numero, podcast_titulo')
        .eq('estacao_id', estacaoId)
        .eq('ativo', true)
        .order('semana_numero', { ascending: true });
      return (data || []) as ConteudoSemanal[];
    },
    enabled: !!estacaoId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const payload = {
        nome: data.nome,
        subtitulo: data.subtitulo || null,
        descricao: data.descricao || null,
        icone: data.icone || null,
        cor: data.cor || null,
        ordem: data.ordem,
        slug: data.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        estacao_id: estacaoId,
        conteudo_semanal_id: data.conteudo_semanal_id || null,
      };
      if (data.id) {
        const { error } = await supabase.from('clube_jornadas').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_jornadas').insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estrada-jornadas', estacaoId] });
      setDialogOpen(false);
      setEditing(null);
      toast({ title: editing ? 'Ponto atualizado' : 'Ponto criado' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: string; ativa: boolean }) => {
      const { error } = await supabase.from('clube_jornadas').update({ ativa }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-estrada-jornadas', estacaoId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_jornadas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estrada-jornadas', estacaoId] });
      toast({ title: 'Ponto removido' });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', subtitulo: '', descricao: '', icone: '', cor: '', ordem: jornadas.length, conteudo_semanal_id: '' });
    setDialogOpen(true);
  };

  const openEdit = (j: Jornada) => {
    setEditing(j);
    setForm({
      nome: j.nome, subtitulo: j.subtitulo || '', descricao: j.descricao || '',
      icone: j.icone || '', cor: j.cor || '', ordem: j.ordem,
      conteudo_semanal_id: j.conteudo_semanal_id || '',
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pontos da estrada — cada ponto é uma etapa da jornada
        </p>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Ponto
        </Button>
      </div>

      {jornadas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Nenhum ponto criado. Clique em "Novo Ponto" para iniciar a estrada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {jornadas.map((j) => (
            <Card key={j.id} className="hover:border-gold/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
                <div className="text-lg shrink-0 w-8 text-center">{j.icone || '📍'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">{j.nome}</span>
                    <Badge variant={j.ativa ? 'default' : 'secondary'} className="text-[10px]">
                      {j.ativa ? 'Ativa' : 'Inativa'}
                    </Badge>
                    {!j.conteudo_semanal_id && (
                      <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30 gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        sem semana
                      </Badge>
                    )}
                  </div>
                  {j.subtitulo && <p className="text-xs text-muted-foreground truncate">{j.subtitulo}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Switch checked={j.ativa} onCheckedChange={(v) => toggleMutation.mutate({ id: j.id, ativa: v })} />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(j)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      if (window.confirm(`Remover o ponto "${j.nome}"? Esta ação não pode ser desfeita.`)) {
                        deleteMutation.mutate(j.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Ponto' : 'Novo Ponto da Estrada'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Portal de Abertura" />
            </div>
            <div>
              <label className="text-sm font-medium">Subtítulo</label>
              <Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Ícone</label>
                <Input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} placeholder="🌀" />
              </div>
              <div>
                <label className="text-sm font-medium">Cor</label>
                <Input value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} placeholder="#C9A96E" />
              </div>
              <div>
                <label className="text-sm font-medium">Ordem</label>
                <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Vincular à Semana</label>
              <Select value={form.conteudo_semanal_id} onValueChange={(v) => setForm({ ...form, conteudo_semanal_id: v === '_none' ? '' : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma (ponto estrutural)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Nenhuma (ponto estrutural)</SelectItem>
                  {semanas.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      Semana {s.semana_numero}{s.podcast_titulo ? ` — ${s.podcast_titulo}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={!form.nome || saveMutation.isPending}
              onClick={() => saveMutation.mutate({ ...form, id: editing?.id })}
            >
              {saveMutation.isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Ponto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
