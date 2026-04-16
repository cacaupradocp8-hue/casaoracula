import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Calendar, Video, Loader2 } from 'lucide-react';

interface Encontro {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao: string | null;
  orientacao_encontro: string | null;
  data_encontro: string | null;
  link_ao_vivo: string | null;
  replay_url: string | null;
  ativo: boolean;
}

interface Props {
  estacaoId: string;
}

export function EncontroTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Encontro | null>(null);
  const [form, setForm] = useState({
    titulo: '', descricao: '', orientacao_encontro: '',
    data_encontro: '', link_ao_vivo: '', replay_url: '',
  });

  const { data: encontros = [], isLoading } = useQuery({
    queryKey: ['admin-encontros-estacao', estacaoId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('clube_livro_encontros')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('data_encontro', { ascending: true });
      return (data || []) as Encontro[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const payload: any = {
        estacao_id: estacaoId,
        titulo: data.titulo,
        descricao: data.descricao || null,
        orientacao_encontro: data.orientacao_encontro || null,
        data_encontro: data.data_encontro || null,
        link_ao_vivo: data.link_ao_vivo || null,
        replay_url: data.replay_url || null,
        ativo: true,
      };
      if (data.id) {
        const { error } = await (supabase as any).from('clube_livro_encontros').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('clube_livro_encontros').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-encontros-estacao', estacaoId] });
      setDialogOpen(false);
      toast({ title: editing ? 'Encontro atualizado' : 'Encontro criado' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const openEdit = (e: Encontro) => {
    setEditing(e);
    setForm({
      titulo: e.titulo, descricao: e.descricao || '',
      orientacao_encontro: e.orientacao_encontro || '',
      data_encontro: e.data_encontro ? e.data_encontro.slice(0, 16) : '',
      link_ao_vivo: e.link_ao_vivo || '', replay_url: e.replay_url || '',
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  const now = new Date().toISOString();
  const proximo = encontros.find(e => e.data_encontro && e.data_encontro > now && e.ativo);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Encontros ao vivo vinculados a esta estação
      </p>

      {proximo && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase text-primary">Próximo encontro</span>
            </div>
            <h3 className="font-medium text-foreground">{proximo.titulo}</h3>
            {proximo.data_encontro && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(proximo.data_encontro).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            )}
            {proximo.link_ao_vivo && (
              <a href={proximo.link_ao_vivo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-1 inline-block">
                Abrir link
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {encontros.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Nenhum encontro cadastrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {encontros.map((e) => (
            <Card key={e.id} className="hover:border-gold/20 transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">{e.titulo}</span>
                  {e.data_encontro && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.data_encontro).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  )}
                </div>
                <Badge variant={e.ativo ? 'default' : 'secondary'} className="text-[10px]">
                  {e.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
                {e.replay_url && <Video className="w-3.5 h-3.5 text-muted-foreground" />}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(e)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Encontro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Orientação do encontro</label>
              <Textarea value={form.orientacao_encontro} onChange={(e) => setForm({ ...form, orientacao_encontro: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Data e hora</label>
                <Input type="datetime-local" value={form.data_encontro} onChange={(e) => setForm({ ...form, data_encontro: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Link ao vivo</label>
                <Input value={form.link_ao_vivo} onChange={(e) => setForm({ ...form, link_ao_vivo: e.target.value })} placeholder="https://meet..." />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">URL do replay</label>
              <Input value={form.replay_url} onChange={(e) => setForm({ ...form, replay_url: e.target.value })} placeholder="https://..." />
            </div>
            <Button
              className="w-full"
              disabled={!form.titulo || saveMutation.isPending}
              onClick={() => saveMutation.mutate({ ...form, id: editing?.id })}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Atualizar Encontro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
