import React, { useState, useEffect } from 'react';
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
  History,
  MoreVertical,
  Music,
  Trash2
} from 'lucide-react';
import { AdminClubeAudioteca } from './AdminClubeAudioteca';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { PassosRotaTab } from './central-jornadas/PassosRotaTab';

export function AdminClubeEditorialTab() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEstacaoDialogOpen, setIsEstacaoDialogOpen] = useState(false);
  const [editingEstacao, setEditingEstacao] = useState<any>(null);
  const [prevEstacao, setPrevEstacao] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('conteudo');
  
  // Queries
  const { data: estacoes, isLoading: loadingEstacoes } = useQuery({
    queryKey: ['admin-clube-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .neq('status', 'archived')
        .order('numero', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: itensRota } = useQuery({
    queryKey: ['admin-clube-itens-rota'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select(`
          *,
          estacao:clube_estacoes(titulo)
        `)
        .neq('status', 'archived')
        .order('estacao_id')
        .order('ordem');
      if (error) throw error;
      return data;
    }
  });
  
  // Mutations
  const createAuditLog = async (log: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('clube_audit_log').insert({
      ...log,
      user_id: user.id
    });
  };

  const updateEstacao = useMutation({
    mutationFn: async (payload: any) => {
      const { id, created_at, updated_at, ...updates } = payload;
      const { error } = await supabase
        .from('clube_estacoes')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      
      // Log changes
      for (const key in updates) {
        const valAnterior = prevEstacao[key];
        const valNovo = updates[key];
        if (valNovo !== undefined && String(valAnterior) !== String(valNovo)) {
          await createAuditLog({
            tabela: 'clube_estacoes',
            registro_id: id,
            acao: 'UPDATE',
            campo_alterado: key,
            valor_anterior: String(valAnterior),
            valor_novo: String(valNovo)
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-estacoes'] });
      toast.success('Estação atualizada com sucesso');
      setIsEstacaoDialogOpen(false);
    }
  });

  const createEstacao = useMutation({
    mutationFn: async (payload: any) => {
      const { id, created_at, updated_at, ...estacao } = payload;
      const { error } = await supabase
        .from('clube_estacoes')
        .insert(estacao);
      if (error) throw error;
      
      await createAuditLog({
        tabela: 'clube_estacoes',
        acao: 'INSERT',
        valor_novo: estacao.titulo
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-estacoes'] });
      toast.success('Nova estação criada com sucesso');
      setIsEstacaoDialogOpen(false);
    }
  });

  const deleteEstacao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update({ status: 'archived', ativa: false, publicada: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-estacoes'] });
      toast.success('Estação arquivada');
    }
  });

  const handleEditEstacao = (estacao: any) => {
    setEditingEstacao(estacao);
    setPrevEstacao({...estacao});
    setIsEstacaoDialogOpen(true);
  };

  const filteredEstacoes = estacoes?.filter(e => 
    e.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.livro_titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs defaultValue="conteudo" value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <TabsList className="bg-midnight/40 border-white/10">
          <TabsTrigger value="conteudo" className="gap-2">
            <Layout className="w-4 h-4" /> Mapa da Travessia
          </TabsTrigger>
          <TabsTrigger value="audioteca" className="gap-2">
            <Music className="w-4 h-4" /> Audioteca
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <History className="w-4 h-4" /> Memória Editorial
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="conteudo" className="space-y-8 mt-0 border-none p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-midnight/20 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Layout className="w-4 h-4 text-gold" /> Rotas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estacoes?.filter(e => e.ativa).length || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-midnight/20 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-gold" /> Estações Criadas
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

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Procurar por rota ou obra..." 
              className="pl-10 bg-midnight/40 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-midnight/40 border-white/10">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
            <Button className="gap-2 bg-gold text-midnight hover:bg-gold/90" onClick={() => {
              const lastNum = estacoes?.length ? Math.max(...estacoes.map(e => e.numero)) : 0;
              setEditingEstacao({
                titulo: 'Nova Rota',
                subtitulo: '',
                numero: lastNum + 1,
                publicada: false,
                ativa: false,
                livro_titulo: ''
              });
              setPrevEstacao({});
              setIsEstacaoDialogOpen(true);
            }}>
              <Plus className="w-4 h-4" /> Nova Rota
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-white/90">Rotas do Clube</h2>
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
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando rotas do clube...</TableCell></TableRow>
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
                    <TableCell className="text-right flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEstacao(e)}>
                        <Edit3 className="w-4 h-4 text-white/40 hover:text-gold transition-colors" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (window.confirm(`Arquivar a rota "${e.titulo}"?`)) {
                          deleteEstacao.mutate(e.id);
                        }
                      }}>
                        <Trash2 className="w-4 h-4 text-white/20 hover:text-amber-500 transition-colors" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {estacoes?.find(e => e.ativa) && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <PassosRotaTab estacaoId={estacoes.find(e => e.ativa).id} />
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="audioteca" className="space-y-8 mt-0 border-none p-0">
        <AdminClubeAudioteca />
      </TabsContent>

      <Dialog open={isEstacaoDialogOpen} onOpenChange={setIsEstacaoDialogOpen}>
        <DialogContent className="bg-midnight border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-display">Configurações da Rota</DialogTitle>
            <DialogDescription>Ajuste os fundamentos desta rota no Clube.</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Rota</Label>
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
                className="w-full min-h-[80px] rounded-md bg-white/5 border border-white/10 p-3 text-sm text-white"
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
              <Label htmlFor="ativa">Rota Ativa</Label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="publicada" 
                defaultChecked={editingEstacao?.publicada}
                onChange={(e) => setEditingEstacao({...editingEstacao, publicada: e.target.checked, status: e.target.checked ? 'published' : 'draft'})}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-gold"
              />
              <Label htmlFor="publicada">Publicada (Visível)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEstacaoDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-midnight hover:bg-gold/90" onClick={() => {
              if (editingEstacao.id) {
                updateEstacao.mutate(editingEstacao);
              } else {
                createEstacao.mutate(editingEstacao);
              }
            }}>
              {editingEstacao?.id ? 'Salvar Rota' : 'Criar Rota'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
