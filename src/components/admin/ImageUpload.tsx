import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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

interface ImageAsset {
  id: string;
  titulo: string;
  file_path: string;
  alt_text: string | null;
  categoria: string | null;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'banner';
  className?: string;
  showGallery?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Imagem',
  aspectRatio = 'video',
  className,
  showGallery = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<ImageAsset[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    banner: 'aspect-[3/1]',
  };

  const loadGallery = async () => {
    setLoadingGallery(true);
    const { data, error } = await supabase
      .from('image_assets')
      .select('id, titulo, file_path, alt_text, categoria')
      .eq('publicado', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGalleryImages(data);
    }
    setLoadingGallery(false);
  };

  useEffect(() => {
    if (galleryOpen && galleryImages.length === 0) {
      loadGallery();
    }
  }, [galleryOpen]);

  const getImageUrl = (path: string) => {
    // Check if it's already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const { data } = supabase.storage.from('content-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const bucket = folder === 'clube-assets' ? 'clube-assets' : 'content-images';
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);

      onChange(urlData.publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const handleSelectFromGallery = (image: ImageAsset) => {
    const url = getImageUrl(image.file_path);
    onChange(url);
    setGalleryOpen(false);
  };

  const filteredGalleryImages = galleryImages.filter(img =>
    img.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative group">
          <div className={cn('relative rounded-lg overflow-hidden border bg-muted', aspectClasses[aspectRatio])}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className={cn('relative rounded-lg border-2 border-dashed bg-muted/50', aspectClasses[aspectRatio])}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Enviando...</p>
              </>
            ) : showUrlInput ? (
              <div className="w-full max-w-xs space-y-2">
                <Input
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUrlSubmit} className="flex-1">
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowUrlInput(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Arraste uma imagem ou escolha uma opção
                </p>
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  {showGallery && (
                    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" size="sm" variant="secondary">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          Galeria
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Selecionar da Galeria</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Buscar por título ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <ScrollArea className="h-[50vh]">
                            {loadingGallery ? (
                              <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                              </div>
                            ) : filteredGalleryImages.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhuma imagem encontrada na galeria.</p>
                                <p className="text-sm">Adicione imagens na aba Galeria do Admin.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 p-1">
                                {filteredGalleryImages.map((image) => (
                                  <button
                                    key={image.id}
                                    type="button"
                                    className="aspect-square rounded-lg overflow-hidden border bg-muted hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => handleSelectFromGallery(image)}
                                  >
                                    <img
                                      src={getImageUrl(image.file_path)}
                                      alt={image.alt_text || image.titulo}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowUrlInput(true)}
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    URL
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
