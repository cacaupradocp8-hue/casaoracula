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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Loader2, 
  Headphones, 
  Trash2, 
  Edit, 
  Play,
  Pause,
  Eye,
  EyeOff
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface AudioAsset {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  duracao_segundos: number | null;
  capa_url: string | null;
  portal_minimo: string;
  publicado: boolean;
  ordem: number;
  categoria: string | null;
  created_at: string;
}

const PORTAL_OPTIONS = [
  { value: 'visitante', label: 'Visitante' },
  { value: 'pre_iniciada', label: 'Pré-Iniciada' },
  { value: 'iniciada', label: 'Iniciada' },
];

const CATEGORIA_OPTIONS = [
  'Meditação',
  'Ritual',
  'Formação',
  'Prática Simbólica',
  'Jornada Guiada',
  'Onboarding',
  'Outro',
];

export function AdminAudiosTab() {
  const { toast } = useToast();
  const [audios, setAudios] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<AudioAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [portalMinimo, setPortalMinimo] = useState('visitante');
  const [publicado, setPublicado] = useState(false);
  const [ordem, setOrdem] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [duracaoSegundos, setDuracaoSegundos] = useState<number | null>(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    const { data, error } = await supabase
      .from('audio_assets')
      .select('*')
      .order('ordem');

    if (error) {
      console.error('Erro ao buscar áudios:', error);
    } else {
      setAudios(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setCategoria('');
    setPortalMinimo('visitante');
    setPublicado(false);
    setOrdem(0);
    setFilePath('');
    setCapaUrl('');
    setDuracaoSegundos(null);
    setEditingAudio(null);
  };

  const handleEdit = (audio: AudioAsset) => {
    setEditingAudio(audio);
    setTitulo(audio.titulo);
    setDescricao(audio.descricao || '');
    setCategoria(audio.categoria || '');
    setPortalMinimo(audio.portal_minimo);
    setPublicado(audio.publicado);
    setOrdem(audio.ordem);
    setFilePath(audio.file_path);
    setCapaUrl(audio.capa_url || '');
    setDuracaoSegundos(audio.duracao_segundos);
    setDialogOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('audios')
      .upload(filePath, file);

    if (error) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' });
    } else {
      setFilePath(filePath);
      
      // Try to get duration from file
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuracaoSegundos(Math.round(audio.duration));
        URL.revokeObjectURL(url);
      };
      
      toast({ title: 'Upload concluído!' });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !filePath) {
      toast({ title: 'Preencha título e faça upload do áudio', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const audioData = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      file_path: filePath,
      duracao_segundos: duracaoSegundos,
      capa_url: capaUrl.trim() || null,
      portal_minimo: portalMinimo as any,
      publicado,
      ordem,
      categoria: categoria.trim() || null,
    };

    let error;

    if (editingAudio) {
      ({ error } = await supabase
        .from('audio_assets')
        .update(audioData)
        .eq('id', editingAudio.id));
    } else {
      ({ error } = await supabase
        .from('audio_assets')
        .insert(audioData));
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingAudio ? 'Áudio atualizado!' : 'Áudio criado!' });
      setDialogOpen(false);
      resetForm();
      fetchAudios();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este áudio?')) return;

    const { error } = await supabase
      .from('audio_assets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Áudio excluído!' });
      fetchAudios();
    }
  };

  const togglePublished = async (audio: AudioAsset) => {
    const { error } = await supabase
      .from('audio_assets')
      .update({ publicado: !audio.publicado })
      .eq('id', audio.id);

    if (error) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    } else {
      fetchAudios();
    }
  };

  const getAudioUrl = (path: string) => {
    const { data } = supabase.storage.from('audios').getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePreviewPlay = (audio: AudioAsset) => {
    if (playingId === audio.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(audio.file_path);
        audioRef.current.play();
      }
      setPlayingId(audio.id);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Biblioteca de Áudios
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Áudio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAudio ? 'Editar Áudio' : 'Novo Áudio'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Título *</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Nome do áudio"
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
                  <Label>Arquivo de Áudio *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Fazendo upload...
                    </div>
                  )}
                  {filePath && !uploading && (
                    <p className="text-sm text-green-500 mt-2">
                      ✓ Arquivo carregado: {filePath.split('/').pop()}
                    </p>
                  )}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={ordem}
                      onChange={(e) => setOrdem(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Duração (seg)</Label>
                    <Input
                      type="number"
                      value={duracaoSegundos ?? ''}
                      onChange={(e) => setDuracaoSegundos(parseInt(e.target.value) || null)}
                      placeholder="Auto-detectado"
                    />
                  </div>
                </div>

                <ImageUpload
                  value={capaUrl}
                  onChange={setCapaUrl}
                  folder="audio-capas"
                  label="Capa (opcional)"
                  aspectRatio="square"
                />

                <div className="flex items-center gap-3">
                  <Switch
                    checked={publicado}
                    onCheckedChange={setPublicado}
                  />
                  <Label>Publicado</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingAudio ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {audios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum áudio cadastrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audios.map((audio) => (
                  <TableRow key={audio.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePreviewPlay(audio)}
                      >
                        {playingId === audio.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{audio.titulo}</TableCell>
                    <TableCell>
                      {audio.categoria && (
                        <Badge variant="outline">{audio.categoria}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{audio.portal_minimo}</Badge>
                    </TableCell>
                    <TableCell>{formatDuration(audio.duracao_segundos)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => togglePublished(audio)}
                      >
                        {audio.publicado ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(audio)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(audio.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
