
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Map as MapIcon, Plus, Trash2, GripVertical, Eye, EyeOff, Loader2, Zap, Settings2, Image as ImageIcon,
  ChevronDown, ChevronUp, Copy, MoveUp, MoveDown, Layout
} from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TemplateEditorialEditor } from './TemplateEditorialEditor';
import type { RotaItem } from './types';
import { cn } from '@/lib/utils';

export function RotaDoLivroEditor({ estacaoId }: { estacaoId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [impactoDialogOpen, setImpactoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RotaItem | null>(null);
  const [newStepDialogOpen, setNewStepDialogOpen] = useState(false);
  const [newStepType, setNewStepType] = useState<string>('portal');

  const { data: itens, isLoading } = useQuery({
    queryKey: ['admin-rota-itens', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
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

  const duplicateMutation = useMutation({
    mutationFn: async (item: RotaItem) => {
      const { id, created_at, updated_at, ...rest } = item as any;
      const payload = { 
        ...rest, 
        titulo: `${item.titulo} (Cópia)`,
        slug: `${item.slug}-copia-${Date.now()}`,
        ordem: item.ordem + 1,
        publicado: false
      };
      const { error } = await supabase
        .from('clube_rota_itens')
        .insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rota-itens', estacaoId] });
      toast({ title: 'Item duplicado' });
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

  const moveMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string, newOrder: number }) => {
      const { error } = await supabase
        .from('clube_rota_itens')
        .update({ ordem: newOrder })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rota-itens', estacaoId] });
    },
  });

  const handleCreateStep = () => {
    saveMutation.mutate({ 
      titulo: `Novo(a) ${newStepType}`, 
      ordem: (itens?.length || 0) + 1,
      slug: `${newStepType}-${Date.now()}`,
      tipo: newStepType,
      publicado: false,
      metadata: {}
    });
    setNewStepDialogOpen(false);
  };

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
          Sistema de Templates Editoriais
        </h3>
        <Button size="sm" variant="outline" className="gap-2 border-gold/50 text-gold hover:bg-gold/10" onClick={() => setNewStepDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Novo Passo
        </Button>
      </div>

      <div className="space-y-3">
        {itens?.map((item) => (
          <Card key={item.id} className="border-primary/10 bg-card/50 hover:border-gold/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 text-muted-foreground hover:text-gold"
                    onClick={() => moveMutation.mutate({ id: item.id, newOrder: item.ordem - 1 })}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 text-muted-foreground hover:text-gold"
                    onClick={() => moveMutation.mutate({ id: item.id, newOrder: item.ordem + 1 })}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Título do Passo</Label>
                    <Input 
                      value={item.titulo} 
                      onChange={(e) => saveMutation.mutate({ id: item.id, titulo: e.target.value })}
                      className="h-8 text-sm bg-background/50 border-primary/5 focus:border-gold/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Template Editorial</Label>
                    <Select 
                      value={item.tipo} 
                      onValueChange={(v) => saveMutation.mutate({ id: item.id, tipo: v })}
                    >
                      <SelectTrigger className="h-8 text-sm bg-background/50 border-primary/5 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-gold/20">
                        <SelectItem value="portal">Portal</SelectItem>
                        <SelectItem value="escuta">Escuta</SelectItem>
                        <SelectItem value="travessia">Travessia</SelectItem>
                        <SelectItem value="laboratorio">Laboratório</SelectItem>
                        <SelectItem value="registro">Registro</SelectItem>
                        <SelectItem value="integracao">Integração</SelectItem>
                        <SelectItem value="encontro">Encontro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status & Visibilidade</Label>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={cn(
                          "h-8 flex-1 gap-2 text-[10px] uppercase tracking-wider",
                          item.publicado ? "border-gold/50 text-gold bg-gold/5" : "text-muted-foreground border-primary/5"
                        )}
                        onClick={() => saveMutation.mutate({ id: item.id, publicado: !item.publicado })}
                      >
                        {item.publicado ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {item.publicado ? 'Publicado' : 'Rascunho'}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8 border-primary/5 text-muted-foreground hover:text-gold hover:bg-gold/5"
                        title="Visualizar como Aluna"
                        onClick={() => window.open(`/clube/jornada/${item.slug}`, '_blank')}
                      >
                        <Layout className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-gold hover:bg-gold/5"
                      title="Duplicar Passo"
                      onClick={() => duplicateMutation.mutate(item)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10"
                      title="Excluir Passo"
                      onClick={() => {
                        if(confirm('Remover este passo definitivamente?')) deleteMutation.mutate(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full h-6 text-[9px] uppercase tracking-widest gap-1 hover:bg-gold/5">
                    <Settings2 className="w-3 h-3" />
                    Conteúdo Editorial & Cartografia
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4 border-t border-dashed border-primary/10 mt-2">
                  <TemplateEditorialEditor 
                    item={item} 
                    onUpdate={(data) => saveMutation.mutate({ id: item.id, ...data })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-primary/5">
                      <p className="text-[10px] uppercase font-bold text-gold tracking-widest mb-2 flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        Impacto na CidaDELA
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Configurações de impacto no mapa simbólico</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={cn(
                            "h-7 gap-2 text-[9px] uppercase tracking-wider",
                            item.impacto_cidadela && item.impacto_cidadela.length > 0 ? "border-gold/50 text-gold bg-gold/5" : "text-muted-foreground"
                          )}
                          onClick={() => openImpactoDialog(item)}
                        >
                          Configurar Impacto
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-primary/5">
                      <p className="text-[10px] uppercase font-bold text-gold tracking-widest mb-2 flex items-center gap-2">
                        <MapIcon className="w-3 h-3" />
                        Sincronização Cartográfica
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase">Slug/URL</Label>
                          <Input value={item.slug || ''} onChange={(e) => saveMutation.mutate({ id: item.id, slug: e.target.value })} className="h-7 text-xs bg-background/50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase">Porta</Label>
                          <Input value={item.porta || ''} onChange={(e) => saveMutation.mutate({ id: item.id, porta: e.target.value })} className="h-7 text-xs bg-background/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={newStepDialogOpen} onOpenChange={setNewStepDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-gold font-display">Novo Passo da Jornada</DialogTitle>
            <DialogDescription>Selecione o template editorial para o novo passo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-xs uppercase font-bold">Tipo</Label>
              <Select value={newStepType} onValueChange={setNewStepType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portal">Portal</SelectItem>
                  <SelectItem value="escuta">Escuta</SelectItem>
                  <SelectItem value="travessia">Travessia</SelectItem>
                  <SelectItem value="laboratorio">Laboratório</SelectItem>
                  <SelectItem value="registro">Registro</SelectItem>
                  <SelectItem value="integracao">Integração</SelectItem>
                  <SelectItem value="encontro">Encontro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewStepDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-black hover:bg-gold/80" onClick={handleCreateStep}>Criar Passo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
