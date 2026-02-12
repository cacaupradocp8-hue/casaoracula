import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppSettingsAdmin } from '@/hooks/useAppSettings';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import { Moon, Save, Eye, Library, RefreshCw } from 'lucide-react';

interface AudioAsset {
  id: string;
  titulo: string;
  file_path: string;
  categoria: string | null;
  duracao_segundos: number | null;
}

export function RitualSaidaAudioSettings() {
  const { settings, updateSetting, createSetting, isLoading } = useAppSettingsAdmin();
  const { toast } = useToast();
  
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [isLoadingAudios, setIsLoadingAudios] = useState(true);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

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
    } finally {
      setIsLoadingAudios(false);
    }
  };

  useEffect(() => {
    fetchAudioAssets();
  }, []);

  useEffect(() => {
    const urlSetting = settings.find(s => s.key === 'ritual_saida_audio_url');
    const idSetting = settings.find(s => s.key === 'ritual_saida_audio_id');
    
    if (idSetting?.value) setSelectedAudioId(idSetting.value);
    if (urlSetting?.value) setCurrentAudioUrl(urlSetting.value);
  }, [settings]);

  useEffect(() => {
    if (selectedAudioId && selectedAudioId !== 'none') {
      const selectedAudio = audioAssets.find(a => a.id === selectedAudioId);
      if (selectedAudio) {
        setCurrentAudioUrl(getPublicAudioUrl(selectedAudio.file_path));
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

      const urlExists = settings.some(s => s.key === 'ritual_saida_audio_url');
      const idExists = settings.some(s => s.key === 'ritual_saida_audio_id');

      await Promise.all([
        urlExists
          ? updateSetting('ritual_saida_audio_url', audioUrl)
          : createSetting('ritual_saida_audio_url', audioUrl, 'URL do áudio do Ritual de Saída'),
        idExists
          ? updateSetting('ritual_saida_audio_id', selectedAudioId === 'none' ? '' : selectedAudioId)
          : createSetting('ritual_saida_audio_id', selectedAudioId === 'none' ? '' : selectedAudioId, 'ID do áudio do Ritual de Saída'),
      ]);

      toast({
        title: 'Configuração salva',
        description: selectedAudioId && selectedAudioId !== 'none'
          ? 'O áudio do Ritual de Saída foi configurado.'
          : 'O áudio do Ritual de Saída foi removido.',
      });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

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
          <Moon className="w-5 h-5 text-gold" />
          Áudio do Ritual de Saída
        </CardTitle>
        <CardDescription>
          Selecione o áudio que será reproduzido quando a usuária encerrar a sessão.
          Gerencie os áudios na Biblioteca de Áudios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Áudio da Biblioteca</Label>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingAudios ? 'Carregando...' : 'Selecione um áudio'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-muted-foreground">Nenhum (sem áudio)</span>
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
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!currentAudioUrl || selectedAudioId === 'none'}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        {showPreview && currentAudioUrl && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Preview:</p>
            <UnifiedAudioPlayer audioUrl={currentAudioUrl} title="Ritual de Saída" size="lg" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
