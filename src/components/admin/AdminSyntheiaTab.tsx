import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Eye, Sparkles, User, Calendar, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DOMPurify from 'dompurify';

type SyntheiaType = 'sessao_individual' | 'experiencia_grupo' | 'ritual' | 'produto_programa' | 'aula_conteudo';

interface SyntheiaCreation {
  id: string;
  user_id: string;
  tipo: SyntheiaType;
  publico_alvo: string;
  momento_jornada: string;
  tempo_disponivel: string;
  tema_principal: string;
  chave_simbolica: string | null;
  intencao_terapeutica: string | null;
  estrutura_pratica: string | null;
  suporte_linguagem: string | null;
  fechamento_integracao: string | null;
  tags: string[] | null;
  titulo: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_nome?: string;
}

const typeConfig: Record<SyntheiaType, { label: string; color: string }> = {
  sessao_individual: { label: 'Sessão Individual', color: 'bg-purple-500/20 text-purple-300' },
  experiencia_grupo: { label: 'Experiência Grupo', color: 'bg-blue-500/20 text-blue-300' },
  ritual: { label: 'Ritual', color: 'bg-amber-500/20 text-amber-300' },
  produto_programa: { label: 'Produto/Programa', color: 'bg-emerald-500/20 text-emerald-300' },
  aula_conteudo: { label: 'Aula/Conteúdo', color: 'bg-rose-500/20 text-rose-300' },
};

const publicoConfig: Record<string, string> = {
  mulher_individual: 'Mulher Individual',
  grupo_mulheres: 'Grupo de Mulheres',
  publico_profissional: 'Público Profissional',
};

const momentoConfig: Record<string, string> = {
  inicio: 'Início',
  crise_transicao: 'Crise/Transição',
  integracao: 'Integração',
  fechamento: 'Fechamento',
};

export function AdminSyntheiaTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<SyntheiaCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<{ id: string; email: string; nome: string | null }[]>([]);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<SyntheiaCreation | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, nome')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('syntheia_creations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user emails for each creation
      const userIds = [...new Set((data || []).map(item => item.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, nome')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const itemsWithUsers = (data || []).map(item => ({
        ...item,
        user_email: profileMap.get(item.user_id)?.email || 'Desconhecido',
        user_nome: profileMap.get(item.user_id)?.nome || null,
      }));

      setItems(itemsWithUsers as SyntheiaCreation[]);
    } catch (error) {
      console.error('Error fetching syntheia creations:', error);
      toast({
        title: 'Erro ao carregar criações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    if (!deleteItemId) return;

    try {
      const { error } = await supabase
        .from('syntheia_creations')
        .delete()
        .eq('id', deleteItemId);

      if (error) throw error;
      toast({ title: 'Criação excluída!' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Erro ao excluir criação',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      (item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      item.tema_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    
    const matchesType = selectedType === 'all' || item.tipo === selectedType;
    const matchesUser = selectedUser === 'all' || item.user_id === selectedUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const getItemsByType = (type: string) => {
    if (type === 'all') return filteredItems;
    return filteredItems.filter(item => item.tipo === type);
  };

  const renderMarkdown = (content: string | null) => {
    if (!content) return null;
    const sanitized = DOMPurify.sanitize(content.replace(/\n/g, '<br>'));
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, tema, usuário ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filtrar por usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.nome || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total: {filteredItems.length} criações de {users.length} usuários
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">
            Todos ({items.length})
          </TabsTrigger>
          <TabsTrigger value="sessao_individual">
            Sessão ({items.filter(i => i.tipo === 'sessao_individual').length})
          </TabsTrigger>
          <TabsTrigger value="experiencia_grupo">
            Grupo ({items.filter(i => i.tipo === 'experiencia_grupo').length})
          </TabsTrigger>
          <TabsTrigger value="ritual">
            Ritual ({items.filter(i => i.tipo === 'ritual').length})
          </TabsTrigger>
          <TabsTrigger value="produto_programa">
            Produto ({items.filter(i => i.tipo === 'produto_programa').length})
          </TabsTrigger>
          <TabsTrigger value="aula_conteudo">
            Aula ({items.filter(i => i.tipo === 'aula_conteudo').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          {getItemsByType(selectedType).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchTerm || selectedUser !== 'all' ? 'Nenhuma criação encontrada' : 'Nenhuma criação registrada'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getItemsByType(selectedType).map((item) => (
                <Card key={item.id} className="hover:shadow-gold transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className={typeConfig[item.tipo]?.color || 'bg-muted'}>
                        {typeConfig[item.tipo]?.label || item.tipo}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setViewingItem(item);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            setDeleteItemId(item.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1">
                      {item.titulo || item.tema_principal}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span className="truncate">{item.user_nome || item.user_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span>{publicoConfig[item.publico_alvo] || item.publico_alvo}</span>
                      </div>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {viewingItem?.titulo || viewingItem?.tema_principal}
            </DialogTitle>
          </DialogHeader>
          
          {viewingItem && (
            <div className="space-y-6 py-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Usuário:</span>
                  <p className="font-medium">{viewingItem.user_nome || viewingItem.user_email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p>
                    <Badge className={typeConfig[viewingItem.tipo]?.color}>
                      {typeConfig[viewingItem.tipo]?.label}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Público:</span>
                  <p className="font-medium">{publicoConfig[viewingItem.publico_alvo]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Momento:</span>
                  <p className="font-medium">{momentoConfig[viewingItem.momento_jornada]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tempo:</span>
                  <p className="font-medium">{viewingItem.tempo_disponivel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Criado em:</span>
                  <p className="font-medium">
                    {format(new Date(viewingItem.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {/* Chave Simbólica */}
              {viewingItem.chave_simbolica && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="text-sm font-semibold text-primary mb-2">🔮 Chave Simbólica</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {renderMarkdown(viewingItem.chave_simbolica)}
                  </div>
                </div>
              )}

              {/* Intenção Terapêutica */}
              {viewingItem.intencao_terapeutica && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">🎯 Intenção Terapêutica</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    {renderMarkdown(viewingItem.intencao_terapeutica)}
                  </div>
                </div>
              )}

              {/* Estrutura Prática */}
              {viewingItem.estrutura_pratica && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">📋 Estrutura Prática</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    {renderMarkdown(viewingItem.estrutura_pratica)}
                  </div>
                </div>
              )}

              {/* Suporte de Linguagem */}
              {viewingItem.suporte_linguagem && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">💬 Suporte de Linguagem</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    {renderMarkdown(viewingItem.suporte_linguagem)}
                  </div>
                </div>
              )}

              {/* Fechamento */}
              {viewingItem.fechamento_integracao && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">🌙 Fechamento / Integração</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    {renderMarkdown(viewingItem.fechamento_integracao)}
                  </div>
                </div>
              )}

              {/* Tags */}
              {viewingItem.tags && viewingItem.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">🏷️ Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingItem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Isso excluirá a criação permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteItem} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
