import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Link,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type PortalType = Database['public']['Enums']['portal_type'];

interface TravessiaFamily {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
}

interface TravessiaItem {
  id: string;
  slug: string;
  titulo_ritual: string;
  subtitulo: string | null;
  categoria: string;
  quando_chamada: string;
  o_que_sustenta: string;
  como_atravessar: string;
  capa_url: string | null;
  portal_minimo: PortalType;
  publicado: boolean;
  ordem: number;
  familia_id: string | null;
}

interface TravessiaMedia {
  id: string;
  item_id: string;
  tipo: 'image' | 'video' | 'audio' | 'pdf' | 'link';
  url: string;
  titulo: string | null;
  ordem: number;
}

const PORTAL_OPTIONS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: 'Visitante' },
  { value: 'mentorada', label: 'Mentorada' },
  { value: 'aluna_formacao', label: 'Aluna Formação' },
  { value: 'assinante', label: 'Assinante' },
  { value: 'oracula', label: 'Orácula' },
  { value: 'admin', label: 'Admin' },
];

const MEDIA_TYPES = [
  { value: 'video', label: 'Vídeo', icon: Video },
  { value: 'audio', label: 'Áudio', icon: Music },
  { value: 'image', label: 'Imagem', icon: Image },
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'link', label: 'Link', icon: Link },
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function AdminBibliotecaTravessiasTab() {
  const [items, setItems] = useState<TravessiaItem[]>([]);
  const [families, setFamilies] = useState<TravessiaFamily[]>([]);
  const [media, setMedia] = useState<Record<string, TravessiaMedia[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TravessiaItem | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<TravessiaMedia | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TravessiaItem | null>(null);
  
  const [formData, setFormData] = useState({
    titulo_ritual: '',
    subtitulo: '',
    slug: '',
    categoria: '',
    quando_chamada: '',
    o_que_sustenta: '',
    como_atravessar: '',
    capa_url: '',
    portal_minimo: 'pre_iniciada' as PortalType,
    publicado: false,
    ordem: 0,
    familia_id: '' as string,
  });

  const [mediaFormData, setMediaFormData] = useState({
    tipo: 'video' as 'image' | 'video' | 'audio' | 'pdf' | 'link',
    url: '',
    titulo: '',
    ordem: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('travessia_familias')
        .select('id, nome, descricao, ordem')
        .order('ordem');
      if (error) throw error;
      setFamilies(data || []);
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('travessia_library_items')
        .select('*')
        .order('categoria')
        .order('ordem');

      if (error) throw error;
      setItems(data || []);

      // Fetch media for all items
      if (data && data.length > 0) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('travessia_library_media')
          .select('*')
          .in('item_id', data.map(i => i.id))
          .order('ordem');

        if (!mediaError && mediaData) {
          const grouped = (mediaData as TravessiaMedia[]).reduce((acc, m) => {
            if (!acc[m.item_id]) acc[m.item_id] = [];
            acc[m.item_id].push(m);
            return acc;
          }, {} as Record<string, TravessiaMedia[]>);
          setMedia(grouped);
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  const openItemDialog = (item?: TravessiaItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        titulo_ritual: item.titulo_ritual,
        subtitulo: item.subtitulo || '',
        slug: item.slug,
        categoria: item.categoria,
        quando_chamada: item.quando_chamada,
        o_que_sustenta: item.o_que_sustenta,
        como_atravessar: item.como_atravessar,
        capa_url: item.capa_url || '',
        portal_minimo: item.portal_minimo,
        publicado: item.publicado,
        ordem: item.ordem,
        familia_id: item.familia_id || '',
      });
    } else {
      setSelectedItem(null);
      setFormData({
        titulo_ritual: '',
        subtitulo: '',
        slug: '',
        categoria: '',
        quando_chamada: '',
        o_que_sustenta: '',
        como_atravessar: '',
        capa_url: '',
        portal_minimo: 'mentorada',
        publicado: false,
        ordem: items.length,
        familia_id: '',
      });
    }
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      titulo_ritual: title,
      slug: selectedItem ? prev.slug : generateSlug(title),
    }));
  };

  const saveItem = async () => {
    if (!formData.titulo_ritual || !formData.slug) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const payload = {
        ...formData,
        subtitulo: formData.subtitulo || null,
        capa_url: formData.capa_url || null,
        familia_id: formData.familia_id || null,
      };

      if (selectedItem) {
        const { error } = await supabase
          .from('travessia_library_items')
          .update(payload)
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast.success('Item atualizado');
      } else {
        const { error } = await supabase
          .from('travessia_library_items')
          .insert(payload);
        if (error) throw error;
        toast.success('Item criado');
      }

      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      console.error('Error saving item:', error);
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const deleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from('travessia_library_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;
      toast.success('Item excluído');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao excluir');
    }
  };

  const togglePublished = async (item: TravessiaItem) => {
    try {
      const { error } = await supabase
        .from('travessia_library_items')
        .update({ publicado: !item.publicado })
        .eq('id', item.id);

      if (error) throw error;
      fetchItems();
      toast.success(item.publicado ? 'Item despublicado' : 'Item publicado');
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Erro ao alterar status');
    }
  };

  // Media management
  const openMediaDialog = (item: TravessiaItem, mediaItem?: TravessiaMedia) => {
    setSelectedItem(item);
    if (mediaItem) {
      setSelectedMedia(mediaItem);
      setMediaFormData({
        tipo: mediaItem.tipo,
        url: mediaItem.url,
        titulo: mediaItem.titulo || '',
        ordem: mediaItem.ordem,
      });
    } else {
      setSelectedMedia(null);
      const itemMedia = media[item.id] || [];
      setMediaFormData({
        tipo: 'video',
        url: '',
        titulo: '',
        ordem: itemMedia.length,
      });
    }
    setMediaDialogOpen(true);
  };

  const saveMedia = async () => {
    if (!selectedItem || !mediaFormData.url) {
      toast.error('URL é obrigatória');
      return;
    }

    try {
      const payload = {
        item_id: selectedItem.id,
        tipo: mediaFormData.tipo,
        url: mediaFormData.url,
        titulo: mediaFormData.titulo || null,
        ordem: mediaFormData.ordem,
      };

      if (selectedMedia) {
        const { error } = await supabase
          .from('travessia_library_media')
          .update(payload)
          .eq('id', selectedMedia.id);
        if (error) throw error;
        toast.success('Mídia atualizada');
      } else {
        const { error } = await supabase
          .from('travessia_library_media')
          .insert(payload);
        if (error) throw error;
        toast.success('Mídia adicionada');
      }

      setMediaDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving media:', error);
      toast.error('Erro ao salvar mídia');
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('travessia_library_media')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;
      toast.success('Mídia removida');
      fetchItems();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Erro ao remover mídia');
    }
  };

  const getMediaIcon = (tipo: string) => {
    const found = MEDIA_TYPES.find(t => t.value === tipo);
    return found ? found.icon : FileText;
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Biblioteca das Travessias</h2>
        </div>
        <Button onClick={() => openItemDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Travessia
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.publicado ? 'opacity-60' : ''}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {item.titulo_ritual}
                      {!item.publicado && (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.categoria} • {item.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.portal_minimo}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePublished(item)}
                  >
                    {item.publicado ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openItemDialog(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setItemToDelete(item);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Media Section */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Mídias ({(media[item.id] || []).length})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMediaDialog(item)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {(media[item.id] || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(media[item.id] || []).map((m) => {
                      const Icon = getMediaIcon(m.tipo);
                      return (
                        <div
                          key={m.id}
                          className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded text-sm"
                        >
                          <Icon className="h-3 w-3" />
                          <span className="max-w-[150px] truncate">
                            {m.titulo || m.tipo}
                          </span>
                          <button
                            onClick={() => openMediaDialog(item, m)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteMedia(m.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhuma travessia cadastrada.
          </Card>
        )}
      </div>

      {/* Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Travessia' : 'Nova Travessia'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Ritual *</Label>
                <Input
                  value={formData.titulo_ritual}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Caderno Ritual do Cisne Negro"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="caderno-ritual-cisne-negro"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={formData.subtitulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
                  placeholder="O que emerge quando tudo desmorona"
                />
              </div>
              <div className="space-y-2">
                <Label>Família Simbólica</Label>
                <Select
                  value={formData.familia_id}
                  onValueChange={(value) => {
                    const familia = families.find(f => f.id === value);
                    setFormData(prev => ({
                      ...prev,
                      familia_id: value,
                      categoria: familia?.nome || prev.categoria,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma família" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Input
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                placeholder="Travessias do Imprevisível"
              />
            </div>

            <div className="space-y-2">
              <Label>Quando ela é chamada *</Label>
              <Textarea
                value={formData.quando_chamada}
                onChange={(e) => setFormData(prev => ({ ...prev, quando_chamada: e.target.value }))}
                placeholder="Situação clínica, emocional ou existencial..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>O que ela sustenta *</Label>
              <Textarea
                value={formData.o_que_sustenta}
                onChange={(e) => setFormData(prev => ({ ...prev, o_que_sustenta: e.target.value }))}
                placeholder="Campo psíquico, simbolização, metabolização..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Como ela é atravessada *</Label>
              <Textarea
                value={formData.como_atravessar}
                onChange={(e) => setFormData(prev => ({ ...prev, como_atravessar: e.target.value }))}
                placeholder="Individual, sessão, entre sessões..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL da Capa</Label>
                <Input
                  value={formData.capa_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, capa_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Portal Mínimo</Label>
                <Select
                  value={formData.portal_minimo}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, portal_minimo: v as PortalType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTAL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.publicado}
                  onCheckedChange={(v) => setFormData(prev => ({ ...prev, publicado: v }))}
                />
                <Label>Publicado</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveItem}>
                {selectedItem ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Dialog */}
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMedia ? 'Editar Mídia' : 'Adicionar Mídia'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={mediaFormData.tipo}
                onValueChange={(v) => setMediaFormData(prev => ({ 
                  ...prev, 
                  tipo: v as 'image' | 'video' | 'audio' | 'pdf' | 'link' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                value={mediaFormData.url}
                onChange={(e) => setMediaFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={mediaFormData.titulo}
                onChange={(e) => setMediaFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título opcional"
              />
            </div>

            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input
                type="number"
                value={mediaFormData.ordem}
                onChange={(e) => setMediaFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setMediaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveMedia}>
                {selectedMedia ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Travessia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{itemToDelete?.titulo_ritual}"?
              Esta ação não pode ser desfeita e todas as mídias associadas também serão removidas.
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
