import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Layout, 
  Map as MapIcon, 
  Settings2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  FileText,
  Image as ImageIcon,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AdminClubeEditorialTab() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEstacaoDialogOpen, setIsEstacaoDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingEstacao, setEditingEstacao] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Queries
  const { data: estacoes, isLoading: loadingEstacoes } = useQuery({
    queryKey: ['admin-clube-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .order('numero', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: itensRota, isLoading: loadingItens } = useQuery({
    queryKey: ['admin-clube-itens-rota'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select(`
          *,
          estacao:clube_estacoes(titulo)
        `)
        .order('estacao_id')
        .order('ordem');
      if (error) throw error;
      return data;
    }
  });

  // Mutations
  const updateEstacao = useMutation({
    mutationFn: async (payload: any) => {
      const { id, ...updates } = payload;
      const { error } = await supabase
        .from('clube_estacoes')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-estacoes'] });
      toast.success('Estação atualizada com sucesso');
      setIsEstacaoDialogOpen(false);
    }
  });

  const updateItem = useMutation({
    mutationFn: async (payload: any) => {
      const { id, ...updates } = payload;
      const { error } = await supabase
        .from('clube_rota_itens')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-itens-rota'] });
      toast.success('Item da rota atualizado com sucesso');
      setIsItemDialogOpen(false);
    }
  });

  const handleEditEstacao = (estacao: any) => {
    setEditingEstacao(estacao);
    setIsEstacaoDialogOpen(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };

  const filteredEstacoes = estacoes?.filter(e => 
    e.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.livro_titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layout className="w-4 h-4 text-gold" /> Estações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estacoes?.filter(e => e.ativa).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-gold" /> Itens de Rota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensRota?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-gold" /> Atualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Monitorando integridade dos dados</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar estação ou livro..." 
            className="pl-10 bg-midnight/40 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-midnight/40 border-white/10">
            <Filter className="w-4 h-4" /> Filtros
          </Button>
          <Button className="gap-2 bg-gold text-midnight hover:bg-gold/90">
            <Plus className="w-4 h-4" /> Nova Estação
          </Button>
        </div>
      </div>

      {/* Estações Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-white/90">Estações do Clube</h2>
          <Badge variant="outline" className="border-gold/30 text-gold/60">clube_estacoes</Badge>
        </div>
        
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Livro</TableHead>
                <TableHead>Visibilidade</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEstacoes ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando estações...</TableCell></TableRow>
              ) : filteredEstacoes?.map((e) => (
                <TableRow key={e.id} className="hover:bg-white/[0.01] transition-colors">
                  <TableCell className="font-mono text-gold/60">{e.numero}</TableCell>
                  <TableCell className="font-medium">{e.titulo}</TableCell>
                  <TableCell className="text-muted-foreground italic text-xs">{e.livro_titulo}</TableCell>
                  <TableCell>
                    {e.publicada ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Publicado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-white/20 border-white/5 gap-1">
                        <Clock className="w-3 h-3" /> Rascunho
                      </Badge>
                    )}
                    {e.ativa && (
                      <Badge variant="outline" className="ml-2 border-gold/30 text-gold/60 text-[10px]">Ativa</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {e.updated_at ? new Date(e.updated_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEstacao(e)}>
                      <Edit3 className="w-4 h-4 text-white/40 hover:text-gold transition-colors" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Itens de Rota Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-white/90">Itens e Passos da Rota</h2>
          <Badge variant="outline" className="border-gold/30 text-gold/60">clube_rota_itens</Badge>
        </div>
        
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Simbólico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingItens ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando itens da rota...</TableCell></TableRow>
              ) : itensRota?.map((item) => (
                <TableRow key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <TableCell className="font-mono text-gold/60">#{item.ordem}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.titulo}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{item.estacao?.titulo || 'Sem Estação'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold border-white/10">
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.porta && <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px]">P</Badge>}
                      {item.campo && <Badge className="bg-purple-500/10 text-purple-400 border-none text-[9px]">C</Badge>}
                      {item.jardim_prompt && <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px]">J</Badge>}
                      {item.metadata && <Badge className="bg-gold/10 text-gold/60 border-none text-[9px]">M</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.publicado ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Público</Badge>
                    ) : (
                      <Badge variant="outline" className="text-white/20 border-white/5 text-[10px]">Rascunho</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4 text-white/40" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-midnight border-white/10">
                        <DropdownMenuItem onClick={() => handleEditItem(item)} className="gap-2">
                          <Edit3 className="w-4 h-4" /> Editar Item
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/admin/clube/preview/${item.id}`, '_blank')} className="gap-2">
                          <Eye className="w-4 h-4" /> Pré-visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => navigate(`/clube/rota/${item.slug}`)}>
                          <Layout className="w-4 h-4" /> Ver no Clube
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Estação Dialog */}
      <Dialog open={isEstacaoDialogOpen} onOpenChange={setIsEstacaoDialogOpen}>
        <DialogContent className="bg-midnight border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-display">Editar Estação</DialogTitle>
            <DialogDescription>Modifique os dados básicos da estação no Clube.</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Estação</Label>
              <Input 
                id="titulo" 
                defaultValue={editingEstacao?.titulo} 
                onChange={(e) => setEditingEstacao({...editingEstacao, titulo: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo</Label>
              <Input 
                id="subtitulo" 
                defaultValue={editingEstacao?.subtitulo} 
                onChange={(e) => setEditingEstacao({...editingEstacao, subtitulo: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="livro">Livro Correspondente</Label>
              <Input 
                id="livro" 
                defaultValue={editingEstacao?.livro_titulo} 
                onChange={(e) => setEditingEstacao({...editingEstacao, livro_titulo: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número Ordem</Label>
              <Input 
                id="numero" 
                type="number"
                defaultValue={editingEstacao?.numero} 
                onChange={(e) => setEditingEstacao({...editingEstacao, numero: parseInt(e.target.value)})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea 
                id="descricao" 
                className="w-full min-h-[80px] rounded-md bg-white/5 border border-white/10 p-3 text-sm"
                defaultValue={editingEstacao?.descricao}
                onChange={(e) => setEditingEstacao({...editingEstacao, descricao: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="ativa" 
                defaultChecked={editingEstacao?.ativa}
                onChange={(e) => setEditingEstacao({...editingEstacao, ativa: e.target.checked})}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold"
              />
              <Label htmlFor="ativa">Estação Ativa</Label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="publicada" 
                defaultChecked={editingEstacao?.publicada}
                onChange={(e) => setEditingEstacao({...editingEstacao, publicada: e.target.checked})}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold"
              />
              <Label htmlFor="publicada">Publicada (Visível)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEstacaoDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-midnight hover:bg-gold/90" onClick={() => updateEstacao.mutate(editingEstacao)}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="bg-midnight border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold font-display">Editar Passo da Rota</DialogTitle>
            <DialogDescription>Ajuste os textos simbólicos e a configuração da jornada.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Seção Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-titulo">Título do Passo</Label>
                <Input 
                  id="item-titulo" 
                  defaultValue={editingItem?.titulo} 
                  onChange={(e) => setEditingItem({...editingItem, titulo: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-ordem">Ordem na Sequência</Label>
                <Input 
                  id="item-ordem" 
                  type="number"
                  defaultValue={editingItem?.ordem} 
                  onChange={(e) => setEditingItem({...editingItem, ordem: parseInt(e.target.value)})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            {/* Seção Simbólica */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold/60">Cartografia Simbólica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="porta">A Porta</Label>
                  <Input 
                    id="porta" 
                    defaultValue={editingItem?.porta} 
                    onChange={(e) => setEditingItem({...editingItem, porta: e.target.value})}
                    className="bg-white/5 border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campo">O Campo</Label>
                  <Input 
                    id="campo" 
                    defaultValue={editingItem?.campo} 
                    onChange={(e) => setEditingItem({...editingItem, campo: e.target.value})}
                    className="bg-white/5 border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="torre">A Torre</Label>
                  <Input 
                    id="torre" 
                    defaultValue={editingItem?.torre} 
                    onChange={(e) => setEditingItem({...editingItem, torre: e.target.value})}
                    className="bg-white/5 border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labirinto">O Labirinto</Label>
                  <Input 
                    id="labirinto" 
                    defaultValue={editingItem?.labirinto} 
                    onChange={(e) => setEditingItem({...editingItem, labirinto: e.target.value})}
                    className="bg-white/5 border-white/10 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Prompts e Textos */}
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="jardim_prompt">Pergunta para o Jardim (Diário)</Label>
                  <textarea 
                    id="jardim_prompt" 
                    className="w-full min-h-[80px] rounded-md bg-white/5 border border-white/10 p-3 text-sm"
                    defaultValue={editingItem?.jardim_prompt}
                    onChange={(e) => setEditingItem({...editingItem, jardim_prompt: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cenario_treinamento">Cenário Laboratório 80/20</Label>
                  <textarea 
                    id="cenario_treinamento" 
                    className="w-full min-h-[80px] rounded-md bg-white/5 border border-white/10 p-3 text-sm"
                    defaultValue={editingItem?.cenario_treinamento}
                    onChange={(e) => setEditingItem({...editingItem, cenario_treinamento: e.target.value})}
                  />
                </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="publicado-item" 
                defaultChecked={editingItem?.publicado}
                onChange={(e) => setEditingItem({...editingItem, publicado: e.target.checked})}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold"
              />
              <Label htmlFor="publicado-item">Publicado e visível na Rota</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsItemDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-midnight hover:bg-gold/90" onClick={() => updateItem.mutate(editingItem)}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
