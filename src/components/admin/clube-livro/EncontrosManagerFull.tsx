import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Encontro } from './types';

interface EncontrosManagerFullProps {
  cicloId: string;
}

export function EncontrosManagerFull({ cicloId }: EncontrosManagerFullProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: encontros, isLoading } = useQuery({
    queryKey: ['admin-clube-encontros', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('data_encontro', { ascending: true });
      if (error) throw error;
      return data as Encontro[];
    },
  });

  const deleteEncontro = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_encontros').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      toast({ title: 'Encontro removido' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{encontros?.length || 0} encontro(s)</p>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1">
          <Plus className="w-3 h-3" />
          Adicionar Encontro
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : encontros && encontros.length > 0 ? (
        <div className="space-y-2">
          {encontros.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.titulo}</p>
                  {e.data_encontro && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(e.data_encontro), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={e.ativo ? 'default' : 'secondary'} className="text-[10px]">
                    {e.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => deleteEncontro.mutate(e.id)} className="text-destructive h-7 w-7 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhum encontro cadastrado para este ciclo.
        </div>
      )}

      <EncontroDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function EncontroDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    data_encontro: '',
    link_ao_vivo: '',
    replay_url: '',
    orientacao_encontro: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_encontros').insert({
        ciclo_id: cicloId,
        ...form,
        data_encontro: form.data_encontro ? new Date(form.data_encontro).toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', data_encontro: '', link_ao_vivo: '', replay_url: '', orientacao_encontro: '' });
      toast({ title: 'Encontro adicionado' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Encontro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Data e Hora</Label>
            <Input type="datetime-local" value={form.data_encontro} onChange={(e) => setForm({ ...form, data_encontro: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Link Ao Vivo</Label>
            <Input value={form.link_ao_vivo} onChange={(e) => setForm({ ...form, link_ao_vivo: e.target.value })} placeholder="Ex: https://zoom.us/..." />
          </div>
          <div className="space-y-2">
            <Label>URL do Replay</Label>
            <Input value={form.replay_url} onChange={(e) => setForm({ ...form, replay_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Orientação para o Encontro</Label>
            <Textarea value={form.orientacao_encontro} onChange={(e) => setForm({ ...form, orientacao_encontro: e.target.value })} className="min-h-[80px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
