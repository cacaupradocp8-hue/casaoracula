
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Headphones, Plus, Trash2, Save, Loader2, Music, Play, ListMusic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AudioUpload } from '../AudioUpload';

interface Props {
  estacaoId: string;
}

interface Track {
  id: string;
  title: string;
  audio_url: string;
  display_order: number;
}

const DEFAULT_TRACKS = [
  { title: '1. Abertura do Campo', order: 1 },
  { title: '2. Aula-Mestra', order: 2 },
  { title: '3. Aplicação Clínica', order: 3 },
  { title: '4. Integração Simbólica', order: 4 },
  { title: '5. Fechamento e Selo', order: 5 },
];

export function AulaAlbumTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['admin-v3-station-audios', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v3_station_audios')
        .select('*')
        .eq('station_id', estacaoId)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Track[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (trackData: Partial<Track> & { isNew?: boolean }) => {
      if (trackData.isNew) {
        const { error } = await supabase.from('clube_v3_station_audios').insert({
          station_id: estacaoId,
          title: trackData.title!,
          audio_url: trackData.audio_url!,
          display_order: trackData.display_order || 0,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_v3_station_audios')
          .update({
            title: trackData.title,
            audio_url: trackData.audio_url,
            display_order: trackData.display_order,
          })
          .eq('id', trackData.id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-v3-station-audios', estacaoId] });
      toast({ title: 'Áudio salvo com sucesso' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_v3_station_audios').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-v3-station-audios', estacaoId] });
      toast({ title: 'Áudio removido' });
    },
  });

  const handleGenerateTemplate = async () => {
    setSaving(true);
    try {
      const inserts = DEFAULT_TRACKS.map(t => ({
        station_id: estacaoId,
        title: t.title,
        audio_url: '',
        display_order: t.order,
      }));
      const { error } = await supabase.from('clube_v3_station_audios').insert(inserts);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ['admin-v3-station-audios', estacaoId] });
      toast({ title: 'Template de Aula-Álbum gerado!' });
    } catch (e: any) {
      toast({ title: 'Erro ao gerar template', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-gold" />
            Módulo de Escuta (Aula-Álbum)
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestão das 5 faixas editoriais da estação. Formato Spotify imersivo.
          </p>
        </div>
        {tracks.length === 0 && (
          <Button onClick={handleGenerateTemplate} disabled={saving} className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2">
            <Plus className="w-4 h-4" />
            Gerar 5 Faixas Padrão
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {tracks.length === 0 ? (
          <Card className="border-dashed border-primary/20 bg-primary/5">
            <CardContent className="py-12 text-center space-y-4">
              <Headphones className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <div className="space-y-1">
                <p className="text-muted-foreground">Nenhum áudio configurado para esta estação.</p>
                <p className="text-xs text-muted-foreground/60">Use o botão acima para criar a estrutura recomendada.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          tracks.map((track) => (
            <TrackItem 
              key={track.id} 
              track={track} 
              onUpdate={(patch) => saveMutation.mutate({ ...track, ...patch })}
              onDelete={() => deleteMutation.mutate(track.id)}
              isSaving={saveMutation.isPending && saveMutation.variables?.id === track.id}
            />
          ))
        )}
      </div>

      {tracks.length > 0 && tracks.length < 5 && (
        <Button variant="outline" size="sm" onClick={() => saveMutation.mutate({ isNew: true, title: 'Nova Faixa', audio_url: '', display_order: tracks.length + 1 })} className="w-full border-dashed border-primary/20 hover:bg-primary/5">
          <Plus className="w-3.5 h-3.5 mr-2" /> Adicionar Faixa Extra
        </Button>
      )}
    </div>
  );
}

function TrackItem({ track, onUpdate, onDelete, isSaving }: { track: Track, onUpdate: (p: Partial<Track>) => void, onDelete: () => void, isSaving: boolean }) {
  const [localTitle, setLocalTitle] = useState(track.title);
  const [localUrl, setLocalUrl] = useState(track.audio_url);

  return (
    <Card className="bg-card/50 border-primary/10 overflow-hidden group">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-gold" />
                </div>
                <Input 
                  value={localTitle} 
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={() => localTitle !== track.title && onUpdate({ title: localTitle })}
                  className="bg-transparent border-none text-lg font-serif p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30"
                  placeholder="Título da Faixa"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] opacity-60">Faixa {track.display_order}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.confirm('Remover faixa?') && onDelete()}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Arquivo de Áudio</label>
                <AudioUpload 
                  value={localUrl} 
                  onChange={(url) => onUpdate({ audio_url: url })}
                  folder="clube-v3/audios"
                  label="Selecionar Áudio"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!track.audio_url}
                className="gap-2 border-primary/10"
                onClick={() => window.open(track.audio_url, '_blank')}
              >
                <Play className="w-3.5 h-3.5" />
                Testar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
