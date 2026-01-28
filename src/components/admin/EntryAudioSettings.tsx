import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppSettingsAdmin } from '@/hooks/useAppSettings';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { isValidAudioUrl } from '@/lib/audioUtils';
import { Music, Save, Eye, AlertCircle } from 'lucide-react';

export function EntryAudioSettings() {
  const { settings, updateSetting, createSetting, isLoading } = useAppSettingsAdmin();
  const { toast } = useToast();
  
  const [audioUrl, setAudioUrl] = useState('');
  const [audioTitle, setAudioTitle] = useState('');
  const [audioCaption, setAudioCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load current values from settings
  useEffect(() => {
    const urlSetting = settings.find(s => s.key === 'entry_audio_url');
    const titleSetting = settings.find(s => s.key === 'entry_audio_title');
    const captionSetting = settings.find(s => s.key === 'entry_audio_caption');
    
    if (urlSetting) setAudioUrl(urlSetting.value);
    if (titleSetting) setAudioTitle(titleSetting.value);
    if (captionSetting) setAudioCaption(captionSetting.value);
  }, [settings]);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (removes audio)
    return isValidAudioUrl(url);
  };

  const handleSave = async () => {
    // Validate URL if provided
    if (audioUrl && !validateUrl(audioUrl)) {
      toast({
        title: 'URL inválida',
        description: 'A URL deve começar com http:// ou https://',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save each setting - create if not exists, update if exists
      const urlExists = settings.some(s => s.key === 'entry_audio_url');
      const titleExists = settings.some(s => s.key === 'entry_audio_title');
      const captionExists = settings.some(s => s.key === 'entry_audio_caption');

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
      ];

      await Promise.all(promises);

      toast({
        title: 'Configuração salva',
        description: audioUrl ? 'O áudio aparecerá na página de entrada.' : 'O áudio foi removido da página de entrada.',
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
    if (!audioUrl) {
      toast({
        title: 'URL vazia',
        description: 'Preencha a URL do áudio para visualizar.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateUrl(audioUrl)) {
      toast({
        title: 'URL inválida',
        description: 'A URL deve começar com http:// ou https://',
        variant: 'destructive',
      });
      return;
    }

    setShowPreview(true);
  };

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
          Configure o áudio que aparece na página inicial para visitantes. 
          Deixe a URL vazia para remover o player.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Field */}
        <div className="space-y-2">
          <Label htmlFor="entry-audio-url">URL do Áudio (mp3, m4a, ogg, wav)</Label>
          <Input
            id="entry-audio-url"
            value={audioUrl}
            onChange={(e) => {
              setAudioUrl(e.target.value);
              setShowPreview(false);
            }}
            placeholder="https://exemplo.com/audio-entrada.mp3"
            className="font-mono text-sm"
          />
          {audioUrl && !validateUrl(audioUrl) && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              URL deve começar com http:// ou https://
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
            disabled={!audioUrl}
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
        {showPreview && audioUrl && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Preview:</p>
            <UnifiedAudioPlayer
              audioUrl={audioUrl}
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
