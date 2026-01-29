import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppSettingsAdmin } from '@/hooks/useAppSettings';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import { Music, Save, Eye, Library, RefreshCw } from 'lucide-react';

interface AudioAsset {
  id: string;
  titulo: string;
  file_path: string;
  categoria: string | null;
  duracao_segundos: number | null;
}

export function EntryAudioSettings() {
  const { settings, updateSetting, createSetting, isLoading } = useAppSettingsAdmin();
  const { toast } = useToast();
  
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [audioTitle, setAudioTitle] = useState('');
  const [audioCaption, setAudioCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [isLoadingAudios, setIsLoadingAudios] = useState(true);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Load audio assets from library
  const fetchAudioAssets = async () => {
    setIsLoadingAudios(true);
    try {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('id, titulo, file_path, categoria, duracao_segundos')
        .eq('publicado', true)
        .order('categoria')
        .order('ordem')
        .order('titulo');

      if (error) throw error;
      setAudioAssets(data || []);
    } catch (error) {
      console.error('Error fetching audio assets:', error);
      toast({
        title: 'Erro ao carregar áudios',
        description: 'Não foi possível carregar a biblioteca de áudios.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAudios(false);
    }
  };

  useEffect(() => {
    fetchAudioAssets();
  }, []);

  // Load current values from settings and find matching audio
  useEffect(() => {
    const urlSetting = settings.find(s => s.key === 'entry_audio_url');
    const titleSetting = settings.find(s => s.key === 'entry_audio_title');
    const captionSetting = settings.find(s => s.key === 'entry_audio_caption');
    const audioIdSetting = settings.find(s => s.key === 'entry_audio_id');
    
    if (audioIdSetting?.value) {
      setSelectedAudioId(audioIdSetting.value);
    }
    if (urlSetting?.value) {
      setCurrentAudioUrl(urlSetting.value);
    }
    if (titleSetting) setAudioTitle(titleSetting.value);
    if (captionSetting) setAudioCaption(captionSetting.value);
  }, [settings]);

  // Update preview URL when audio selection changes
  useEffect(() => {
    if (selectedAudioId && selectedAudioId !== 'none') {
      const selectedAudio = audioAssets.find(a => a.id === selectedAudioId);
      if (selectedAudio) {
        const url = getPublicAudioUrl(selectedAudio.file_path);
        setCurrentAudioUrl(url);
        // Auto-fill title if empty
        if (!audioTitle) {
          setAudioTitle(selectedAudio.titulo);
        }
      }
    } else if (selectedAudioId === 'none') {
      setCurrentAudioUrl(null);
    }
    setShowPreview(false);
  }, [selectedAudioId, audioAssets]);

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ` (${mins}:${secs.toString().padStart(2, '0')})`;
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const selectedAudio = audioAssets.find(a => a.id === selectedAudioId);
      const audioUrl = selectedAudio ? getPublicAudioUrl(selectedAudio.file_path) || '' : '';

      // Check which settings exist
      const urlExists = settings.some(s => s.key === 'entry_audio_url');
      const titleExists = settings.some(s => s.key === 'entry_audio_title');
      const captionExists = settings.some(s => s.key === 'entry_audio_caption');
      const idExists = settings.some(s => s.key === 'entry_audio_id');

      const promises = [
        urlExists 
          ? updateSetting('entry_audio_url', audioUrl)
          : createSetting('entry_audio_url', audioUrl, 'URL do áudio na página de entrada'),
        titleExists
          ? updateSetting('entry_audio_title', audioTitle)
          : createSetting('entry_audio_title', audioTitle, 'Título do áudio na página de entrada'),
        captionExists
          ? updateSetting('entry_audio_caption', audioCaption)
          : createSetting('entry_audio_caption', audioCaption, 'Legenda do áudio na página de entrada'),
        idExists
          ? updateSetting('entry_audio_id', selectedAudioId === 'none' ? '' : selectedAudioId)
          : createSetting('entry_audio_id', selectedAudioId === 'none' ? '' : selectedAudioId, 'ID do áudio selecionado da biblioteca'),
      ];

      await Promise.all(promises);

      toast({
        title: 'Configuração salva',
        description: selectedAudioId && selectedAudioId !== 'none' 
          ? 'O áudio aparecerá na página de entrada.' 
          : 'O áudio foi removido da página de entrada.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!currentAudioUrl) {
      toast({
        title: 'Nenhum áudio selecionado',
        description: 'Selecione um áudio da biblioteca para visualizar.',
        variant: 'destructive',
      });
      return;
    }
    setShowPreview(true);
  };

  // Group audios by category
  const groupedAudios = audioAssets.reduce((acc, audio) => {
    const category = audio.categoria || 'Sem categoria';
    if (!acc[category]) acc[category] = [];
    acc[category].push(audio);
    return acc;
  }, {} as Record<string, AudioAsset[]>);

  if (isLoading) {
    return (
      <Card className="bg-secondary/30 border-gold/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/30 border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-gold" />
          Áudio da Página de Entrada
        </CardTitle>
        <CardDescription>
          Selecione um áudio da biblioteca para exibir na página inicial. 
          Os áudios são gerenciados na Biblioteca de Áudios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="entry-audio-select">Áudio da Biblioteca</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchAudioAssets}
              disabled={isLoadingAudios}
              className="h-8 gap-1 text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingAudios ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
          <Select 
            value={selectedAudioId || 'none'} 
            onValueChange={setSelectedAudioId}
            disabled={isLoadingAudios}
          >
            <SelectTrigger id="entry-audio-select" className="w-full">
              <SelectValue placeholder={isLoadingAudios ? "Carregando..." : "Selecione um áudio"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-muted-foreground">Nenhum (remover áudio)</span>
              </SelectItem>
              {Object.entries(groupedAudios).map(([category, audios]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                    {category}
                  </div>
                  {audios.map((audio) => (
                    <SelectItem key={audio.id} value={audio.id}>
                      <div className="flex items-center gap-2">
                        <Library className="w-3 h-3 text-gold/70" />
                        <span>{audio.titulo}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatDuration(audio.duracao_segundos)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          {audioAssets.length === 0 && !isLoadingAudios && (
            <p className="text-sm text-muted-foreground">
              Nenhum áudio publicado na biblioteca. Adicione áudios na aba "Biblioteca de Áudios".
            </p>
          )}
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="entry-audio-title">Título (opcional)</Label>
          <Input
            id="entry-audio-title"
            value={audioTitle}
            onChange={(e) => setAudioTitle(e.target.value)}
            placeholder="Bem-vinda à Casa"
          />
        </div>

        {/* Caption Field */}
        <div className="space-y-2">
          <Label htmlFor="entry-audio-caption">Legenda curta (opcional)</Label>
          <Input
            id="entry-audio-caption"
            value={audioCaption}
            onChange={(e) => setAudioCaption(e.target.value)}
            placeholder="Uma introdução poética à Casa ORÁCULA"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!currentAudioUrl || selectedAudioId === 'none'}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        </div>

        {/* Preview Player */}
        {showPreview && currentAudioUrl && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Preview:</p>
            <UnifiedAudioPlayer
              audioUrl={currentAudioUrl}
              title={audioTitle || undefined}
              size="lg"
            />
            {audioCaption && (
              <p className="text-sm text-muted-foreground text-center italic">
                {audioCaption}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
