import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, Map } from 'lucide-react';

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
}

export default function AdminClubeJornadas() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Jornada | null>(null);
  const [form, setForm] = useState({ nome: '', subtitulo: '', descricao: '', icone: '', cor: '', ordem: 0 });

  const { data: jornadas = [], isLoading } = useQuery({
    queryKey: ['admin-clube-jornadas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_jornadas')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Jornada[];
    },
  });

  // We need an estacao_id - get the first one
  const { data: estacoes } = useQuery({
    queryKey: ['admin-estacoes-list'],
    queryFn: async () => {
      const { data } = await supabase.from('oracular_seasons').select('id, nome_estacao').order('created_at', { ascending: false }).limit(5);
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const estacaoId = estacoes?.[0]?.id;
      if (!estacaoId) throw new Error('Nenhuma estação encontrada. Crie uma estação primeiro.');

      const payload = {
        nome: data.nome,
        subtitulo: data.subtitulo || null,
        descricao: data.descricao || null,
        icone: data.icone || null,
        cor: data.cor || null,
        ordem: data.ordem,
        slug: data.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        estacao_id: estacaoId,
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
      qc.invalidateQueries({ queryKey: ['admin-clube-jornadas'] });
      setDialogOpen(false);
      setEditing(null);
      toast({ title: editing ? 'Jornada atualizada' : 'Jornada criada' });
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-clube-jornadas'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_jornadas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-clube-jornadas'] });
      toast({ title: 'Jornada excluída' });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', subtitulo: '', descricao: '', icone: '', cor: '', ordem: jornadas.length });
    setDialogOpen(true);
  };

  const openEdit = (j: Jornada) => {
    setEditing(j);
    setForm({ nome: j.nome, subtitulo: j.subtitulo || '', descricao: j.descricao || '', icone: j.icone || '', cor: j.cor || '', ordem: j.ordem });
    setDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <SectionHeader
            title="Jornadas"
            subtitle="Gerenciar jornadas formativas do Clube"
            icon={<Map className="w-5 h-5" />}
          />
          <div className="ml-auto">
            <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Nova Jornada</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Carregando...</div>
        ) : jornadas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Map className="w-8 h-8 mx-auto mb-3 opacity-40" />
              Nenhuma jornada criada. Clique em "Nova Jornada" para começar.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jornadas.map((j) => (
              <Card key={j.id} className="hover:border-gold/30 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{j.nome}</h3>
                      <Badge variant={j.ativa ? 'default' : 'secondary'} className="text-[10px]">
                        {j.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{j.tipo}</Badge>
                    </div>
                    {j.subtitulo && <p className="text-xs text-muted-foreground truncate">{j.subtitulo}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={j.ativa} onCheckedChange={(v) => toggleMutation.mutate({ id: j.id, ativa: v })} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(j)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(j.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    <Link to={`/admin/clube-livro/portais-cms?jornada=${j.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">Portais →</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Jornada' : 'Nova Jornada'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Jornada da Heroína — Ano 1" />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
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
              <Button
                className="w-full"
                disabled={!form.nome || saveMutation.isPending}
                onClick={() => saveMutation.mutate({ ...form, id: editing?.id })}
              >
                {saveMutation.isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Jornada'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
