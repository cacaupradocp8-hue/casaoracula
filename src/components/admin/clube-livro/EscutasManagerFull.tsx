import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Headphones, Plus, Trash2, FileText } from 'lucide-react';
import { AudioUpload } from '../AudioUpload';
import type { Escuta } from './types';

interface EscutasManagerFullProps {
  cicloId: string;
}

export function EscutasManagerFull({ cicloId }: EscutasManagerFullProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: escutas, isLoading } = useQuery({
    queryKey: ['admin-clube-escutas', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as Escuta[];
    },
  });

  const deleteEscuta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_escutas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      toast({ title: 'Escuta removida' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{escutas?.length || 0} escuta(s)</p>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1">
          <Plus className="w-3 h-3" />
          Adicionar Escuta
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : escutas && escutas.length > 0 ? (
        <div className="space-y-2">
          {escutas.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex items-center gap-3">
                {e.tipo === 'audio' ? (
                  <Headphones className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.titulo}</p>
                  {e.descricao && <p className="text-xs text-muted-foreground truncate">{e.descricao}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={e.ativo ? 'default' : 'secondary'} className="text-[10px]">
                    {e.ativo ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{e.tipo}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => deleteEscuta.mutate(e.id)} className="text-destructive h-7 w-7 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhuma escuta cadastrada para este ciclo.
        </div>
      )}

      <EscutaDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function EscutaDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'audio' as 'audio' | 'podcast' | 'texto',
    audio_url: '',
    texto_conteudo: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_escutas').insert({
        ciclo_id: cicloId,
        ...form,
        ordem: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', tipo: 'audio', audio_url: '', texto_conteudo: '' });
      toast({ title: 'Escuta adicionada' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Escuta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="texto">Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(form.tipo === 'audio' || form.tipo === 'podcast') && (
            <AudioUpload
              value={form.audio_url}
              onChange={(url) => setForm({ ...form, audio_url: url })}
              folder="clube-livro/escutas"
              label={form.tipo === 'podcast' ? 'Arquivo do Podcast' : 'Arquivo de Áudio'}
            />
          )}
          {form.tipo === 'texto' && (
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea value={form.texto_conteudo} onChange={(e) => setForm({ ...form, texto_conteudo: e.target.value })} className="min-h-[120px]" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
