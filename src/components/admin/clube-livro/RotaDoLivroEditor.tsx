import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Map as MapIcon, Plus, Trash2, GripVertical, Eye, EyeOff, Loader2, Zap, Settings2 
} from 'lucide-react';
import type { RotaItem } from './types';

export function RotaDoLivroEditor({ estacaoId }: { estacaoId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [impactoDialogOpen, setImpactoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RotaItem | null>(null);

  const { data: itens, isLoading } = useQuery({
    queryKey: ['admin-rota-itens', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem');
      if (error) throw error;
      return (data as any) as RotaItem[];
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

  const openImpactoDialog = (item: RotaItem) => {
    setSelectedItem(item);
    setImpactoDialogOpen(true);
  };

  const handleUpdateImpacto = (impactos: any[]) => {
    if (!selectedItem) return;
    saveMutation.mutate({ 
      id: selectedItem.id, 
      impacto_cidadela: impactos 
    });
    setImpactoDialogOpen(false);
  };

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
          <Card key={item.id} className="border-primary/10 bg-card/50 hover:border-gold/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Título</Label>
                  <Input 
                    value={item.titulo} 
                    onChange={(e) => saveMutation.mutate({ id: item.id, titulo: e.target.value })}
                    className="h-8 text-sm bg-background/50 border-primary/5"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipo</Label>
                  <Select 
                    value={item.tipo} 
                    onValueChange={(v) => saveMutation.mutate({ id: item.id, tipo: v })}
                  >
                    <SelectTrigger className="h-8 text-sm bg-background/50 border-primary/5">
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
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Identificador (Slug)</Label>
                  <Input 
                    value={item.slug} 
                    onChange={(e) => saveMutation.mutate({ id: item.id, slug: e.target.value })}
                    className="h-8 text-sm bg-background/50 border-primary/5 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                      "h-8 gap-2 text-[10px] uppercase tracking-wider",
                      item.impacto_cidadela && item.impacto_cidadela.length > 0 ? "border-gold/50 text-gold bg-gold/5" : "text-muted-foreground"
                    )}
                    onClick={() => openImpactoDialog(item)}
                  >
                    <Zap className="w-3 h-3" />
                    Impacto
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => saveMutation.mutate({ id: item.id, publicado: !item.publicado })}
                  >
                    {item.publicado ? <Eye className="w-4 h-4 text-gold" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10"
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

      <ImpactoDialog 
        isOpen={impactoDialogOpen} 
        onClose={() => setImpactoDialogOpen(false)}
        item={selectedItem}
        onSave={handleUpdateImpacto}
      />
    </div>
  );
}

function ImpactoDialog({ isOpen, onClose, item, onSave }: any) {
  const [impactos, setImpactos] = useState<any[]>(item?.impacto_cidadela || []);

  // Update local state when item changes
  useState(() => {
    if (item?.impacto_cidadela) setImpactos(item.impacto_cidadela);
  });

  const addImpacto = () => {
    setImpactos([...impactos, { distrito: 'Portão das Sombras', tipo_impacto: 'evolucao', intensidade: 1 }]);
  };

  const removeImpacto = (idx: number) => {
    setImpactos(impactos.filter((_, i) => i !== idx));
  };

  const updateImpacto = (idx: number, field: string, value: any) => {
    const newImpactos = [...impactos];
    newImpactos[idx] = { ...newImpactos[idx], [field]: value };
    setImpactos(newImpactos);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-gold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Impacto na CidaDELA: {item?.titulo}
          </DialogTitle>
          <DialogDescription>
            Defina como a conclusão deste item altera o mapa simbólico da usuária.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {impactos.map((imp, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 rounded-lg bg-muted/30 border border-primary/5">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase">Distrito</Label>
                <Select value={imp.distrito} onValueChange={(v) => updateImpacto(idx, 'distrito', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portão das Sombras">Portão das Sombras</SelectItem>
                    <SelectItem value="Torre do Oráculo">Torre do Oráculo</SelectItem>
                    <SelectItem value="Labirinto do Destino">Labirinto do Destino</SelectItem>
                    <SelectItem value="Praça do Encontro">Praça do Encontro</SelectItem>
                    <SelectItem value="Jardim da Psique">Jardim da Psique</SelectItem>
                    <SelectItem value="Forja da Alma">Forja da Alma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase">Efeito</Label>
                <Select value={imp.tipo_impacto} onValueChange={(v) => updateImpacto(idx, 'tipo_impacto', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evolucao">Evolução (+)</SelectItem>
                    <SelectItem value="ativacao">Ativação (On)</SelectItem>
                    <SelectItem value="bloqueio">Bloqueio (Off)</SelectItem>
                    <SelectItem value="transformacao">Transformação (~)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase">Intensidade (1-10)</Label>
                <Input 
                  type="number" 
                  value={imp.intensidade} 
                  onChange={(e) => updateImpacto(idx, 'intensidade', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>

              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeImpacto(idx)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full border-dashed border-primary/20 gap-2" onClick={addImpacto}>
            <Plus className="w-3 h-3" /> Adicionar Impacto
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button className="bg-gold text-black" onClick={() => onSave(impactos)}>Salvar Configuração</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
