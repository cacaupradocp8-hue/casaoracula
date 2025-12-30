import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, BookOpen, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalType, PORTALS } from '@/types/portal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

type LibraryItemType = 'conto' | 'arquetipo' | 'pergunta' | 'ritual';

interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  content: string;
  tags: string[];
  portal_level_required: PortalType;
  created_at: string;
}

const typeConfig: Record<LibraryItemType, { label: string; color: string }> = {
  conto: { label: 'Conto', color: 'bg-purple-500/20 text-purple-300' },
  arquetipo: { label: 'Arquétipo', color: 'bg-blue-500/20 text-blue-300' },
  pergunta: { label: 'Pergunta', color: 'bg-amber-500/20 text-amber-300' },
  ritual: { label: 'Ritual', color: 'bg-emerald-500/20 text-emerald-300' },
};

export function AdminBibliotecaTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    type: 'conto' as LibraryItemType,
    title: '',
    content: '',
    tags: [] as string[],
    portal_level_required: 'visitante' as PortalType,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []) as LibraryItem[]);
    } catch (error) {
      console.error('Error fetching library items:', error);
      toast({
        title: 'Erro ao carregar biblioteca',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item?: LibraryItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        type: item.type,
        title: item.title,
        content: item.content,
        tags: item.tags || [],
        portal_level_required: item.portal_level_required,
      });
    } else {
      setEditingItem(null);
      setForm({
        type: 'conto',
        title: '',
        content: '',
        tags: [],
        portal_level_required: 'visitante',
      });
    }
    setTagInput('');
    setDialogOpen(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const saveItem = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('library_items')
          .update(form)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Item atualizado!' });
      } else {
        const { error } = await supabase
          .from('library_items')
          .insert([form]);

        if (error) throw error;
        toast({ title: 'Item criado!' });
      }

      setDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: 'Erro ao salvar item',
        variant: 'destructive',
      });
    }
  };

  const deleteItem = async () => {
    if (!deleteItemId) return;

    try {
      const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', deleteItemId);

      if (error) throw error;
      toast({ title: 'Item excluído!' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Erro ao excluir item',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getItemsByType = (type: string) => {
    if (type === 'all') return filteredItems;
    return filteredItems.filter(item => item.type === type);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">
            Todos ({items.length})
          </TabsTrigger>
          <TabsTrigger value="conto">
            Contos ({items.filter(i => i.type === 'conto').length})
          </TabsTrigger>
          <TabsTrigger value="arquetipo">
            Arquétipos ({items.filter(i => i.type === 'arquetipo').length})
          </TabsTrigger>
          <TabsTrigger value="pergunta">
            Perguntas ({items.filter(i => i.type === 'pergunta').length})
          </TabsTrigger>
          <TabsTrigger value="ritual">
            Rituais ({items.filter(i => i.type === 'ritual').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          {getItemsByType(selectedType).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => openDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeiro item
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {getItemsByType(selectedType).map((item) => (
                <Card key={item.id} className="hover:shadow-gold transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeConfig[item.type].color}>
                            {typeConfig[item.type].label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {PORTALS.find(p => p.type === item.portal_level_required)?.name.split('/')[0]}
                          </Badge>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.content}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
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
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeleteItemId(item.id);
                            setDeleteDialogOpen(true);
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
          )}
        </TabsContent>
      </Tabs>

      {/* Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm(prev => ({ ...prev, type: v as LibraryItemType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conto">Conto</SelectItem>
                    <SelectItem value="arquetipo">Arquétipo</SelectItem>
                    <SelectItem value="pergunta">Pergunta</SelectItem>
                    <SelectItem value="ritual">Ritual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Portal Mínimo</Label>
                <Select
                  value={form.portal_level_required}
                  onValueChange={(v) => setForm(prev => ({ ...prev, portal_level_required: v as PortalType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTALS.map((portal) => (
                      <SelectItem key={portal.type} value={portal.type}>
                        {portal.name.split('/')[0].trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título do item"
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Conteúdo completo..."
                rows={6}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Adicionar tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveItem}>
              {editingItem ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Isso excluirá o item permanentemente. Esta ação não pode ser desfeita.
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
