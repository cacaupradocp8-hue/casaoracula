import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Link as LinkIcon, Music, Library } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioAsset {
  id: string;
  titulo: string;
  file_path: string;
  categoria: string | null;
  duracao_segundos: number | null;
}

interface AudioUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  showLibrary?: boolean;
}

export function AudioUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Áudio',
  className,
  showLibrary = true,
}: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryAudios, setLibraryAudios] = useState<AudioAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    const { data, error } = await supabase
      .from('audio_assets')
      .select('id, titulo, file_path, categoria, duracao_segundos')
      .eq('publicado', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLibraryAudios(data);
    }
    setLoadingLibrary(false);
  };

  useEffect(() => {
    if (libraryOpen && libraryAudios.length === 0) {
      loadLibrary();
    }
  }, [libraryOpen]);

  const getAudioUrl = (path: string) => {
    // Check if it's already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const { data } = supabase.storage.from('audios').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mp4', 'audio/webm', 'video/mp4', 'audio/x-m4a', 'audio/aac'];
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      toast.error('Por favor, selecione um arquivo de áudio válido (.mp3, .ogg, .wav)');
      return;
    }

    // Validate file size (max 200MB for podcasts)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 200MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('audios')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('audios')
        .getPublicUrl(data.path);

      onChange(urlData.publicUrl);
      toast.success('Áudio enviado com sucesso!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Erro ao enviar áudio');
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

  const handleSelectFromLibrary = (audio: AudioAsset) => {
    const url = getAudioUrl(audio.file_path);
    onChange(url);
    setLibraryOpen(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredLibraryAudios = libraryAudios.filter(audio =>
    audio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audio.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      {value ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
            <Music className="w-5 h-5 text-muted-foreground shrink-0" />
            <audio controls className="flex-1 h-8">
              <source src={value} />
              Seu navegador não suporta áudio.
            </audio>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {value.split('/').pop()}
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg border-2 border-dashed bg-muted/50 p-4">
          <div className="flex flex-col items-center justify-center gap-2">
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
                <Music className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Selecione um áudio
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
                  {showLibrary && (
                    <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" size="sm" variant="secondary">
                          <Library className="w-4 h-4 mr-1" />
                          Biblioteca
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Selecionar da Biblioteca de Áudios</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Buscar por título ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <ScrollArea className="h-[50vh]">
                            {loadingLibrary ? (
                              <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                              </div>
                            ) : filteredLibraryAudios.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum áudio encontrado na biblioteca.</p>
                                <p className="text-sm">Adicione áudios na aba Áudios do Admin.</p>
                              </div>
                            ) : (
                              <div className="space-y-2 p-1">
                                {filteredLibraryAudios.map((audio) => (
                                  <button
                                    key={audio.id}
                                    type="button"
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                                    onClick={() => handleSelectFromLibrary(audio)}
                                  >
                                    <Music className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{audio.titulo}</p>
                                      {audio.categoria && (
                                        <p className="text-xs text-muted-foreground">{audio.categoria}</p>
                                      )}
                                    </div>
                                    {audio.duracao_segundos && (
                                      <span className="text-xs text-muted-foreground">
                                        {formatDuration(audio.duracao_segundos)}
                                      </span>
                                    )}
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
        accept="audio/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
