import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Bot, Brain, Layout, Eye, Zap, 
  MessageSquare, BookOpen, PenTool, Search, 
  Settings, ChevronRight, PanelRight, Play, Plus, Trash2, Save,
  CheckCircle2, Clock, ChevronLeft, ArrowLeft, Loader2, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TemplateEditorialEditor } from './clube-livro/TemplateEditorialEditor';
import { LabConfigManager } from './clube-livro/LabConfigManager';
import { useToast } from '@/hooks/use-toast';
import { RotaItem } from './clube-livro/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function AdminPremiumEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const estacaoIdParam = searchParams.get('estacaoId');
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('editor');
  const [showPreview, setShowPreview] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('editora');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<RotaItem> | null>(null);

  const agents = [
    { id: 'editora', name: 'Editora', icon: BookOpen, color: 'text-gold' },
    { id: 'psicologa', name: 'Psicóloga', icon: Brain, color: 'text-purple-400' },
    { id: 'copywriter', name: 'Copywriter', icon: PenTool, color: 'text-blue-400' },
    { id: 'roteirista', name: 'Roteirista', icon: Play, color: 'text-emerald-400' },
    { id: 'curadora', name: 'Curadora', icon: Search, color: 'text-amber-400' },
  ];

  // Fetch all stations for the selector
  const { data: todasEstacoes } = useQuery({
    queryKey: ['admin-todas-estacoes-premium'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clube_estacoes').select('id, titulo, livro_titulo').order('ordem');
      if (error) throw error;
      return data;
    }
  });

  // Fetch target station
  const { data: estacaoAtual, isLoading: isLoadingEstacao } = useQuery({
    queryKey: ['admin-estacao-premium', estacaoIdParam],
    queryFn: async () => {
      let query = supabase.from('clube_estacoes').select('*');
      
      if (estacaoIdParam && estacaoIdParam !== 'undefined' && estacaoIdParam !== 'null') {
        query = query.eq('id', estacaoIdParam);
      } else {
        query = query.eq('ativa', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    }
  });

  // Fetch items for the station
  const { data: items, isLoading: isLoadingItems } = useQuery({
    queryKey: ['admin-clube-rota-itens', estacaoAtual?.id],
    queryFn: async () => {
      if (!estacaoAtual?.id) return [];
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoAtual.id)
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!estacaoAtual?.id
  });

  // Effect to load item for editing
  useEffect(() => {
    if (selectedItemId && items) {
      const item = items.find(i => i.id === selectedItemId);
      if (item) {
        setEditingItem({ ...item });
      }
    } else if (!selectedItemId && items && items.length > 0 && !editingItem) {
      // Auto-select first item if none selected
      setSelectedItemId(items[0].id);
    }
  }, [selectedItemId, items]);

  // Mutation to save item
  const saveMutation = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) {
        const { error } = await supabase
          .from('clube_rota_itens')
          .update(item)
          .eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_rota_itens')
          .insert([ { ...item, estacao_id: estacaoAtual?.id } ]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-rota-itens'] });
      toast({ title: 'Alterações salvas com sucesso' });
    },
    onError: (error) => {
      console.error('Error saving item:', error);
      toast({ title: 'Erro ao salvar alterações', variant: 'destructive' });
    }
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
      queryClient.invalidateQueries({ queryKey: ['admin-clube-rota-itens'] });
      setSelectedItemId(null);
      setEditingItem(null);
      toast({ title: 'Item removido' });
    }
  });

  const handleCreateItem = () => {
    const newItem: Partial<RotaItem> = {
      titulo: 'Novo Passo',
      tipo: 'portal',
      ordem: (items?.length || 0) + 1,
      publicado: false,
      metadata: {}
    };
    setEditingItem(newItem);
    setSelectedItemId(null);
  };

  const handleSave = () => {
    if (editingItem) {
      saveMutation.mutate(editingItem);
    }
  };

  const handleDelete = () => {
    if (selectedItemId && confirm('Excluir este passo?')) {
      deleteMutation.mutate(selectedItemId);
    }
  };

  const updateItem = (updates: Partial<RotaItem>) => {
    setEditingItem(prev => prev ? ({ ...prev, ...updates }) : updates);
  };

  if (isLoadingEstacao) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-primary/10 rounded-2xl h-[calc(100vh-10rem)]">
        <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
        <p className="text-muted-foreground">Localizando essência da estação...</p>
      </div>
    );
  }

  if (!estacaoAtual) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-primary/10 rounded-2xl h-[calc(100vh-10rem)]">
        <Sparkles className="w-12 h-12 text-gold/20 mb-4" />
        <h3 className="text-xl font-serif">Nenhuma Estação Selecionada</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Para usar a Máquina Editorial Pro, selecione uma estação abaixo ou marque uma como "Ativa" no Hub.
        </p>
        
        <div className="mt-8 w-full max-w-xs space-y-4">
          <Select onValueChange={(id) => navigate(`/admin/clube?tab=clube-premium-editor&estacaoId=${id}`)}>
            <SelectTrigger className="bg-background border-primary/20">
              <SelectValue placeholder="Escolher estação..." />
            </SelectTrigger>
            <SelectContent>
              {todasEstacoes?.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.titulo} ({e.livro_titulo})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate('/admin/clube')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* 1. Sidebar Premium (Notion Style) */}
      <aside className="w-16 md:w-64 border-r border-primary/5 bg-muted/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-primary/5 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-gold"
            onClick={() => navigate('/admin/clube')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col hidden md:block overflow-hidden">
            <span className="font-display text-[10px] font-bold tracking-tight uppercase text-gold">Máquina Editorial</span>
            <span className="text-[11px] font-serif truncate text-foreground">{estacaoAtual?.titulo || 'Carregando...'}</span>
          </div>
        </div>
        
        <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-none bg-background/50">
          <NavItem active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} icon={Layout} label="Caminho da Rota" />
          
          {/* Steps List */}
          {activeTab === 'editor' && (
            <div className="mt-4 mb-2">
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest hidden md:block">Sequência da Jornada</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={handleCreateItem}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-0.5 max-h-[40vh] overflow-y-auto pr-1">
                {isLoadingItems ? (
                  <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
                ) : items?.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground px-3 italic">Nenhum passo criado.</p>
                ) : (
                  items?.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left group",
                        selectedItemId === item.id ? "bg-gold/15 text-gold font-bold border-l-2 border-gold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="opacity-30 group-hover:opacity-100 transition-opacity font-mono text-[9px] w-3">{item.ordem}</span>
                      <span className="truncate flex-1 hidden md:block">{item.titulo}</span>
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.publicado ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-amber-500")} />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <NavItem active={activeTab === 'treinamento'} onClick={() => setActiveTab('treinamento')} icon={Zap} label="Simulador de Caso" />
          <NavItem active={activeTab === 'ia'} onClick={() => setActiveTab('ia')} icon={Bot} label="Gerador IA (80/20)" />
          
          <div className="pt-4 pb-2 px-3">
             <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest hidden md:block">Ajudantes IA</span>
          </div>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                selectedAgent === agent.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <agent.icon className={cn("w-4 h-4", agent.color)} />
              <span className="hidden md:block">{agent.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-primary/5 space-y-3 bg-muted/5">
          <div className="space-y-1">
             <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest hidden md:block">Obra de Referência</span>
             <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-primary/5">
                <BookOpen className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[10px] text-foreground truncate hidden md:block">{estacaoAtual.livro_titulo || 'Sem Livro'}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto" onClick={() => navigate(`/admin/clube/central/${estacaoAtual.id}`)}>
                  <Settings className="w-3 h-3" />
                </Button>
             </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[10px] uppercase font-bold tracking-tight" onClick={() => setShowPreview(!showPreview)}>
            <PanelRight className="w-4 h-4" />
            <span className="hidden md:block">{showPreview ? 'Esconder Preview' : 'Mostrar Preview'}</span>
          </Button>
        </div>
      </aside>

      {/* 2. Editor Central (Apple/Notion Style) */}
      <main className="flex-1 overflow-y-auto bg-background relative scrollbar-none">
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-primary/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-14 bg-muted rounded border border-primary/10 overflow-hidden shadow-sm hidden sm:block">
               {estacaoAtual.livro_capa_url && <img src={estacaoAtual.livro_capa_url} alt="Livro" className="w-full h-full object-cover" />}
             </div>
             <div className="flex flex-col">
               <h2 className="font-serif text-base leading-tight">{estacaoAtual.livro_titulo || 'Sem Livro'}</h2>
               <div className="flex items-center gap-2">
                 <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-gold border-gold/30 h-4">{estacaoAtual.titulo}</Badge>
                 <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50 h-4">Premium Editor</Badge>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-8 w-8 text-muted-foreground hover:text-gold"
               onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-estacao-premium'] })}
             >
               <RefreshCw className="w-3.5 h-3.5" />
             </Button>
             <Button 
               variant="outline" 
               size="sm" 
               className="h-8 text-xs gap-2 border-primary/10 hover:bg-muted"
               onClick={handleSave}
               disabled={saveMutation.isPending}
             >
               {saveMutation.isPending ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-muted-foreground" />}
               <span className="hidden sm:inline">Salvar Rascunho</span>
             </Button>
             <Button 
               size="sm" 
               className="h-8 text-xs gap-2 bg-gold hover:bg-gold/90 text-black font-bold shadow-lg shadow-gold/20"
               onClick={() => {
                 updateItem({ publicado: true });
                 handleSave();
               }}
             >
               <CheckCircle2 className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">Publicar na Rota</span>
             </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-12 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsContent value="editor" className="mt-0 space-y-12">
               {editingItem ? (
                 <>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-2">
                         <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                            <Zap className="w-3 h-3 text-gold" />
                            <span className="text-[10px] uppercase font-bold text-gold tracking-widest">Tipo de Experiência</span>
                         </div>
                         <Select 
                           value={editingItem.tipo || 'portal'} 
                           onValueChange={(v: any) => updateItem({ tipo: v })}
                         >
                           <SelectTrigger className="w-32 h-7 text-[10px] uppercase font-bold border-primary/10 bg-muted/50">
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
                         <Badge variant="outline" className="text-[8px] opacity-30 uppercase">
                           Sequência: {editingItem.ordem}
                         </Badge>
                      </div>
                      <div className="space-y-2">
                        <Input 
                          className="text-4xl md:text-5xl font-serif bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-10 h-auto font-bold tracking-tight text-foreground" 
                          placeholder="Título do Passo..."
                          value={editingItem.titulo || ''}
                          onChange={(e) => updateItem({ titulo: e.target.value })}
                        />
                        <Textarea 
                          className="text-xl font-serif bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-10 resize-none min-h-[60px] text-muted-foreground leading-relaxed" 
                          placeholder="A essência ou subtítulo desta jornada..."
                          value={editingItem.subtitulo || ''}
                          onChange={(e) => updateItem({ subtitulo: e.target.value })}
                        />
                      </div>
                    </div>

                   <div className="space-y-6">
                     <div className="flex items-center gap-2 text-gold/60">
                        <Settings className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Configuração de Template</span>
                     </div>
                     <TemplateEditorialEditor 
                       item={editingItem as RotaItem} 
                       onUpdate={updateItem} 
                     />
                   </div>
                   
                   <div className="pt-12 border-t border-primary/5">
                      <Button 
                        variant="ghost" 
                        className="text-destructive text-xs gap-2" 
                        onClick={handleDelete}
                        disabled={!selectedItemId}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir este Passo
                      </Button>
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Layout className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <h3 className="text-xl font-serif">Selecione um passo</h3>
                    <p className="text-muted-foreground mt-2">Escolha um item na lateral para editar ou crie um novo.</p>
                    <Button variant="outline" className="mt-6" onClick={handleCreateItem}>
                      Criar Primeiro Passo
                    </Button>
                 </div>
               )}
            </TabsContent>

            <TabsContent value="treinamento" className="mt-0 space-y-8">
               <div className="space-y-2 mb-8">
                 <h3 className="text-2xl font-serif">Simulador de Campo</h3>
                 <p className="text-sm text-muted-foreground">Configure os desafios e estudos de caso desta estação.</p>
               </div>
               <LabConfigManager cicloId={estacaoAtual?.id || ''} />
            </TabsContent>

             <TabsContent value="ia" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="bg-gold/5 border-gold/10">
                     <CardHeader>
                        <CardTitle className="text-gold flex items-center gap-2">
                           <Bot className="w-5 h-5" /> Ateliê de Criação IA
                        </CardTitle>
                        <CardDescription>Peça para a {agents.find(a => a.id === selectedAgent)?.name} gerar conteúdo para este passo.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-background/50 border border-primary/5 min-h-[150px] text-xs leading-relaxed">
                           {editingItem ? (
                             <>
                               <p className="font-bold text-gold mb-2 uppercase tracking-widest text-[9px]">Contexto Atual:</p>
                               <p className="text-muted-foreground italic mb-4">"Estamos no passo '{editingItem.titulo}', que é do tipo {editingItem.tipo}. O livro base é '{estacaoAtual.livro_titulo}'."</p>
                               <p>Selecione uma tarefa abaixo para começar:</p>
                             </>
                           ) : (
                             <p className="text-muted-foreground italic text-center">Selecione um passo na lateral para contextalizar a IA.</p>
                           )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <Button variant="outline" size="sm" className="text-[10px] h-auto py-2 text-left justify-start px-3 border-primary/10">Sugerir Título & Subtítulo</Button>
                           <Button variant="outline" size="sm" className="text-[10px] h-auto py-2 text-left justify-start px-3 border-primary/10">Gerar Texto de Abertura</Button>
                           <Button variant="outline" size="sm" className="text-[10px] h-auto py-2 text-left justify-start px-3 border-primary/10">Sugerir Exercício Lab</Button>
                           <Button variant="outline" size="sm" className="text-[10px] h-auto py-2 text-left justify-start px-3 border-primary/10">Criar Perguntas Guia</Button>
                        </div>
                        <div className="flex gap-2 pt-4">
                           <Input placeholder={`Comando personalizado para a ${selectedAgent}...`} className="text-xs" />
                           <Button className="bg-gold text-black h-9"><Sparkles className="w-4 h-4" /></Button>
                        </div>
                     </CardContent>
                   </Card>

                   <Card className="bg-muted/30 border-primary/5">
                      <CardHeader>
                        <CardTitle className="text-sm">Sugestões Geradas</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground italic text-xs p-8">
                            <Sparkles className="w-8 h-8 opacity-10 mb-2" />
                            Ainda não há sugestões. Escolha uma tarefa à esquerda.
                         </div>
                      </CardContent>
                   </Card>
                </div>
             </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 3. Preview da Aluna (Netflix Style) */}
      {showPreview && (
        <aside className="w-80 md:w-96 border-l border-primary/5 bg-black/20 flex flex-col shrink-0">
          <div className="p-4 border-b border-primary/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest flex items-center gap-2">
              <Eye className="w-3 h-3" /> Preview em Tempo Real
            </span>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-red-500/50" />
               <div className="w-2 h-2 rounded-full bg-amber-500/50" />
               <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
            {/* Mobile View Mockup */}
            <div className="w-full aspect-[9/19] bg-background border-[8px] border-muted rounded-[2.5rem] shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full p-4 space-y-4 overflow-y-auto scrollbar-none">
                  {editingItem?.image_url ? (
                    <img src={editingItem.image_url} alt="Capa" className="w-full aspect-video rounded-xl object-cover" />
                  ) : (
                    <div className="h-40 w-full rounded-2xl bg-gold/10 animate-pulse flex items-center justify-center">
                       <Sparkles className="w-8 h-8 text-gold/20" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                     <Badge variant="outline" className="text-[8px] uppercase tracking-[0.2em] text-gold border-gold/30">
                        {editingItem?.tipo || 'Portal'}
                     </Badge>
                     <h3 className="text-xl font-serif">{editingItem?.titulo || 'Título do Passo'}</h3>
                     <p className="text-xs text-muted-foreground">{editingItem?.subtitulo || 'Subtítulo da experiência...'}</p>
                  </div>

                  {editingItem?.metadata?.texto_abertura && (
                    <div className="pt-4 space-y-3">
                       <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-2 border-gold/30 pl-3">
                          "{editingItem.metadata.texto_abertura.substring(0, 150)}..."
                       </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                     <div className="h-2 w-full rounded bg-muted/50" />
                     <div className="h-2 w-full rounded bg-muted/50" />
                     <div className="h-2 w-2/3 rounded bg-muted/50" />
                  </div>
                  
                  <Button className="w-full rounded-xl bg-gold text-black font-bold h-10 mt-8">
                     Iniciar Experiência
                  </Button>
               </div>
            </div>
            
            <div className="space-y-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
               <h4 className="text-[10px] uppercase font-bold text-gold tracking-widest">Dica de Experiência</h4>
               <p className="text-[11px] text-muted-foreground leading-relaxed">
                 O template de <strong>{editingItem?.tipo || 'Portal'}</strong> gera uma página de entrada cinematográfica com transição suave. Certifique-se de preencher os metadados específicos para cada tipo.
               </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
        active ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "scale-110" : "group-hover:scale-110 transition-transform")} />
      <span className="hidden md:block">{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-primary-foreground hidden md:block" />}
    </button>
  );
}
