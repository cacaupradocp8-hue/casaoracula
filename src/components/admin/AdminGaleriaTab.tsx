import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Loader2, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Eye,
  EyeOff,
  Upload,
  Search,
  X,
  Copy,
  Check
} from 'lucide-react';

interface ImageAsset {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  alt_text: string | null;
  categoria: string | null;
  tags: string[] | null;
  largura: number | null;
  altura: number | null;
  tamanho_bytes: number | null;
  portal_minimo: string;
  publicado: boolean;
  ordem: number;
  created_at: string;
}

const PORTAL_OPTIONS = [
  { value: 'visitante', label: 'Visitante' },
  { value: 'pre_iniciada', label: 'Pré-Iniciada' },
  { value: 'iniciada', label: 'Iniciada' },
];

const CATEGORIA_OPTIONS = [
  'Capa',
  'Banner',
  'Ícone',
  'Ilustração',
  'Foto',
  'Background',
  'Card',
  'Avatar',
  'Outro',
];

export function AdminGaleriaTab() {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [altText, setAltText] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [portalMinimo, setPortalMinimo] = useState('visitante');
  const [publicado, setPublicado] = useState(true);
  const [ordem, setOrdem] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('image_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar imagens:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setAltText('');
    setCategoria('');
    setTagsInput('');
    setPortalMinimo('visitante');
    setPublicado(true);
    setOrdem(0);
    setFilePath('');
    setPreviewUrl('');
    setImageDimensions(null);
    setImageSize(null);
    setEditingImage(null);
  };

  const handleEdit = (image: ImageAsset) => {
    setEditingImage(image);
    setTitulo(image.titulo);
    setDescricao(image.descricao || '');
    setAltText(image.alt_text || '');
    setCategoria(image.categoria || '');
    setTagsInput(image.tags?.join(', ') || '');
    setPortalMinimo(image.portal_minimo);
    setPublicado(image.publicado);
    setOrdem(image.ordem);
    setFilePath(image.file_path);
    setPreviewUrl(getImageUrl(image.file_path));
    setImageDimensions(image.largura && image.altura ? { width: image.largura, height: image.altura } : null);
    setImageSize(image.tamanho_bytes);
    setDialogOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Por favor, selecione uma imagem', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'A imagem deve ter no máximo 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `galeria/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('content-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    setFilePath(fileName);
    setImageSize(file.size);

    // Get image dimensions
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.src = url;

    // Set preview
    const { data: urlData } = supabase.storage.from('content-images').getPublicUrl(fileName);
    setPreviewUrl(urlData.publicUrl);

    // Auto-fill title from filename
    if (!titulo) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitulo(cleanName);
    }

    toast({ title: 'Upload concluído!' });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !filePath) {
      toast({ title: 'Preencha o título e faça upload da imagem', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const imageData = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      file_path: filePath,
      alt_text: altText.trim() || null,
      categoria: categoria.trim() || null,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : null,
      largura: imageDimensions?.width || null,
      altura: imageDimensions?.height || null,
      tamanho_bytes: imageSize,
      portal_minimo: portalMinimo as any,
      publicado,
      ordem,
    };

    let error;

    if (editingImage) {
      ({ error } = await supabase
        .from('image_assets')
        .update(imageData)
        .eq('id', editingImage.id));
    } else {
      ({ error } = await supabase
        .from('image_assets')
        .insert(imageData));
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingImage ? 'Imagem atualizada!' : 'Imagem adicionada à galeria!' });
      setDialogOpen(false);
      resetForm();
      fetchImages();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem da galeria?')) return;

    const { error } = await supabase
      .from('image_assets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Imagem excluída!' });
      fetchImages();
    }
  };

  const togglePublished = async (image: ImageAsset) => {
    const { error } = await supabase
      .from('image_assets')
      .update({ publicado: !image.publicado })
      .eq('id', image.id);

    if (error) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    } else {
      fetchImages();
    }
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('content-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const copyUrl = (image: ImageAsset) => {
    const url = getImageUrl(image.file_path);
    navigator.clipboard.writeText(url);
    setCopiedId(image.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'URL copiada!' });
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategoria === 'all' || img.categoria === filterCategoria;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Galeria de Imagens
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Imagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingImage ? 'Editar Imagem' : 'Adicionar Imagem'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Image Preview/Upload */}
                <div className="space-y-2">
                  <Label>Imagem *</Label>
                  {previewUrl ? (
                    <div className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {imageDimensions && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {imageDimensions.width} × {imageDimensions.height}px • {formatBytes(imageSize)}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setFilePath('');
                          setPreviewUrl('');
                          setImageDimensions(null);
                          setImageSize(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Enviando...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WebP (máx. 5MB)</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <Label>Título *</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Nome da imagem"
                  />
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição breve"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Texto Alternativo (alt)</Label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Descrição para acessibilidade"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIA_OPTIONS.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Portal Mínimo</Label>
                    <Select value={portalMinimo} onValueChange={setPortalMinimo}>
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

                <div>
                  <Label>Tags (separadas por vírgula)</Label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="capa, banner, hero..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={ordem}
                      onChange={(e) => setOrdem(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={publicado}
                      onCheckedChange={setPublicado}
                    />
                    <Label>Publicado</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingImage ? 'Salvar' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIA_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{searchTerm || filterCategoria !== 'all' ? 'Nenhuma imagem encontrada.' : 'Nenhuma imagem cadastrada.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="group relative rounded-lg border bg-card overflow-hidden"
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={getImageUrl(image.file_path)}
                      alt={image.alt_text || image.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{image.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {image.categoria && (
                        <Badge variant="outline" className="text-xs">{image.categoria}</Badge>
                      )}
                      {!image.publicado && (
                        <Badge variant="secondary" className="text-xs">Rascunho</Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => copyUrl(image)}
                      title="Copiar URL"
                    >
                      {copiedId === image.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => togglePublished(image)}
                      title={image.publicado ? 'Despublicar' : 'Publicar'}
                    >
                      {image.publicado ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleEdit(image)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            {images.length} imagem(ns) na galeria • {filteredImages.length} exibida(s)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
