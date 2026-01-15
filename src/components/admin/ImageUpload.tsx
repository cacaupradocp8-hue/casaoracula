import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'banner';
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Imagem',
  aspectRatio = 'video',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    banner: 'aspect-[3/1]',
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

      const { data, error } = await supabase.storage
        .from('content-images')
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
                  Arraste uma imagem ou clique para enviar
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
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
