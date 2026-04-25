import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Map as MapIcon, Plus, Trash2, GripVertical, Eye, EyeOff, Loader2 
} from 'lucide-react';
import type { RotaItem } from './types';

export function RotaDoLivroEditor({ estacaoId }: { estacaoId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: itens, isLoading } = useQuery({
    queryKey: ['admin-rota-itens', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem');
      if (error) throw error;
      return data as RotaItem[];
    },
    enabled: !!estacaoId,
  });

  const saveMutation = useMutation({
    mutationFn: async (item: any) => {
      const payload = { ...item, estacao_id: estacaoId };
      const { error } = await supabase
        .from('clube_rota_itens')
        .upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rota-itens', estacaoId] });
      toast({ title: 'Item da rota salvo' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_rota_itens')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rota-itens', estacaoId] });
      toast({ title: 'Item removido da rota' });
    },
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display text-gold flex items-center gap-2">
          <MapIcon className="w-5 h-5" />
          Rota do Livro (Orquestrador)
        </h3>
        <Button size="sm" variant="outline" className="gap-2" onClick={() => saveMutation.mutate({ 
          titulo: 'Novo Ponto', 
          ordem: (itens?.length || 0) + 1,
          slug: `ponto-${Date.now()}`,
          tipo: 'aula',
          publicado: false
        })}>
          <Plus className="w-4 h-4" /> Adicionar Ponto
        </Button>
      </div>

      <div className="space-y-3">
        {itens?.map((item) => (
          <Card key={item.id} className="border-primary/10 bg-card/50">
            <CardContent className="p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Título</Label>
                  <Input 
                    value={item.titulo} 
                    onChange={(e) => saveMutation.mutate({ id: item.id, titulo: e.target.value })}
                    onBlur={(e) => saveMutation.mutate({ id: item.id, titulo: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Tipo</Label>
                  <Select 
                    value={item.tipo} 
                    onValueChange={(v) => saveMutation.mutate({ id: item.id, tipo: v })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portal">Portal</SelectItem>
                      <SelectItem value="escuta">Escuta/Áudio</SelectItem>
                      <SelectItem value="aula">Aula</SelectItem>
                      <SelectItem value="laboratorio">Laboratório</SelectItem>
                      <SelectItem value="chat_livro">Chat com Livro</SelectItem>
                      <SelectItem value="jardim">Jardim</SelectItem>
                      <SelectItem value="encontro">Encontro</SelectItem>
                      <SelectItem value="aplicacao">Aplicação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Slug/Identificador</Label>
                  <Input 
                    value={item.slug} 
                    onChange={(e) => saveMutation.mutate({ id: item.id, slug: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => saveMutation.mutate({ id: item.id, publicado: !item.publicado })}
                  >
                    {item.publicado ? <Eye className="w-4 h-4 text-gold" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if(confirm('Remover este ponto da rota?')) deleteMutation.mutate(item.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
