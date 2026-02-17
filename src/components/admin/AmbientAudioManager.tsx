import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAppSettingsAdmin } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { getPublicAudioUrl } from '@/lib/audioUtils';
import { Volume2, Save, RefreshCw, Library, Trash2 } from 'lucide-react';

interface AudioAsset {
  id: string;
  titulo: string;
  file_path: string;
  categoria: string | null;
  duracao_segundos: number | null;
}

interface AmbientSection {
  prefix: string;
  label: string;
  description: string;
}

const SECTIONS: AmbientSection[] = [
  {
    prefix: 'entry',
    label: 'Página de Entrada',
    description: 'Áudio ambiente na página inicial / landing.',
  },
  {
    prefix: 'ritual_saida',
    label: 'Ritual de Saída',
    description: 'Áudio ao encerrar a sessão.',
  },
  {
    prefix: 'vitrine',
    label: 'Vitrine / Página de Vendas',
    description: 'Áudio ambiente na vitrine.',
  },
  {
    prefix: 'dashboard',
    label: 'Dashboard / Home',
    description: 'Áudio ambiente no dashboard principal.',
  },
  {
    prefix: 'salas',
    label: 'Salas',
    description: 'Áudio ambiente na navegação das salas.',
  },
];

function SectionRow({
  section,
  audioAssets,
  settings,
  updateSetting,
  createSetting,
}: {
  section: AmbientSection;
  audioAssets: AudioAsset[];
  settings: { key: string; value: string }[];
  updateSetting: (key: string, value: string) => Promise<boolean>;
  createSetting: (key: string, value: string, desc?: string) => Promise<boolean>;
}) {
  const { toast } = useToast();
  const prefix = section.prefix;

  const getValue = (suffix: string) =>
    settings.find((s) => s.key === `${prefix}_audio_${suffix}`)?.value || '';

  const [isActive, setIsActive] = useState(getValue('ativo') === 'true');
  const [selectedAudioId, setSelectedAudioId] = useState(getValue('id') || 'none');
  const [volume, setVolume] = useState(Number(getValue('volume') || '30'));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsActive(getValue('ativo') === 'true');
    setSelectedAudioId(getValue('id') || 'none');
    setVolume(Number(getValue('volume') || '30'));
  }, [settings]);

  const upsert = async (suffix: string, value: string, desc: string) => {
    const key = `${prefix}_audio_${suffix}`;
    const exists = settings.some((s) => s.key === key);
    return exists ? updateSetting(key, value) : createSetting(key, value, desc);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const selectedAudio = audioAssets.find((a) => a.id === selectedAudioId);
      const audioUrl = selectedAudio ? getPublicAudioUrl(selectedAudio.file_path) || '' : '';

      await Promise.all([
        upsert('ativo', isActive ? 'true' : 'false', `Áudio ambiente ativo: ${section.label}`),
        upsert('url', audioUrl, `URL áudio: ${section.label}`),
        upsert('id', selectedAudioId === 'none' ? '' : selectedAudioId, `ID áudio: ${section.label}`),
        upsert('volume', String(volume), `Volume padrão: ${section.label}`),
      ]);

      toast({ title: `${section.label} salvo` });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    setSelectedAudioId('none');
    setIsActive(false);
    try {
      await Promise.all([
        upsert('ativo', 'false', `Áudio ambiente ativo: ${section.label}`),
        upsert('url', '', `URL áudio: ${section.label}`),
        upsert('id', '', `ID áudio: ${section.label}`),
      ]);
      toast({ title: `Áudio removido de ${section.label}` });
    } catch {
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const groupedAudios = audioAssets.reduce((acc, audio) => {
    const cat = audio.categoria || 'Sem categoria';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(audio);
    return acc;
  }, {} as Record<string, AudioAsset[]>);

  const formatDuration = (s: number | null) => {
    if (!s) return '';
    return ` (${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')})`;
  };

  return (
    <div className="border border-border/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{section.label}</h4>
          <p className="text-xs text-muted-foreground">{section.description}</p>
        </div>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
      </div>

      {isActive && (
        <div className="space-y-3 pl-2">
          <div className="space-y-1">
            <Label className="text-xs">Áudio</Label>
            <Select value={selectedAudioId} onValueChange={setSelectedAudioId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">Nenhum</span>
                </SelectItem>
                {Object.entries(groupedAudios).map(([cat, audios]) => (
                  <div key={cat}>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">
                      {cat}
                    </div>
                    {audios.map((audio) => (
                      <SelectItem key={audio.id} value={audio.id}>
                        <div className="flex items-center gap-2">
                          <Library className="w-3 h-3 text-primary/70" />
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

          <div className="space-y-1">
            <Label className="text-xs">Volume padrão: {volume}%</Label>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => setVolume(v)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-1">
              <Save className="w-3 h-3" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              disabled={isSaving}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
              Remover
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AmbientAudioManager() {
  const { settings, updateSetting, createSetting, isLoading } = useAppSettingsAdmin();
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [isLoadingAudios, setIsLoadingAudios] = useState(true);

  const fetchAudios = async () => {
    setIsLoadingAudios(true);
    try {
      const { data } = await supabase
        .from('audio_assets')
        .select('id, titulo, file_path, categoria, duracao_segundos')
        .eq('publicado', true)
        .order('categoria')
        .order('titulo');
      setAudioAssets(data || []);
    } catch {
      /* ignore */
    } finally {
      setIsLoadingAudios(false);
    }
  };

  useEffect(() => {
    fetchAudios();
  }, []);

  if (isLoading || isLoadingAudios) {
    return (
      <Card className="bg-secondary/30 border-primary/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/30 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Áudio Ambiente por Página
            </CardTitle>
            <CardDescription>
              Configure áudio ambiente com autoplay para cada seção do app. O visitante pode pausar a qualquer momento.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchAudios} className="gap-1 text-xs">
            <RefreshCw className={`w-3 h-3 ${isLoadingAudios ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {SECTIONS.map((section) => (
          <SectionRow
            key={section.prefix}
            section={section}
            audioAssets={audioAssets}
            settings={settings}
            updateSetting={updateSetting}
            createSetting={createSetting}
          />
        ))}
      </CardContent>
    </Card>
  );
}
