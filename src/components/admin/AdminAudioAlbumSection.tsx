// ============================================
// Admin: Álbum de Áudio por Estação
// ============================================

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Music, Plus, Trash2, Save, Loader2, Eye, EyeOff,
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Play, Pause, Disc3
} from 'lucide-react';
import {
  useAudioAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum,
  useAudioTracks, useCreateTrack, useUpdateTrack, useDeleteTrack, useReorderTrack,
  type AudioAlbum, type AudioTrack
} from '@/hooks/useAudioAlbums';

// ─── Track Row ──────────────────────────────
function TrackRow({ track, tracks, onRefetch }: { track: AudioTrack; tracks: AudioTrack[]; onRefetch: () => void }) {
  const { toast } = useToast();
  const updateTrack = useUpdateTrack();
  const deleteTrack = useDeleteTrack();
  const reorderTrack = useReorderTrack();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const togglePublish = async () => {
    try {
      await updateTrack.mutateAsync({ id: track.id, publicado: !track.publicado });
      toast({ title: track.publicado ? 'Faixa despublicada' : 'Faixa publicada' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const moveUp = async () => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx <= 0) return;
    const prev = tracks[idx - 1];
    await Promise.all([
      reorderTrack.mutateAsync({ id: track.id, newOrdem: prev.ordem }),
      reorderTrack.mutateAsync({ id: prev.id, newOrdem: track.ordem }),
    ]);
  };

  const moveDown = async () => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx >= tracks.length - 1) return;
    const next = tracks[idx + 1];
    await Promise.all([
      reorderTrack.mutateAsync({ id: track.id, newOrdem: next.ordem }),
      reorderTrack.mutateAsync({ id: next.id, newOrdem: track.ordem }),
    ]);
  };

  const formatDuration = (s: number | null) => {
    if (!s) return '';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-background group">
      <audio ref={audioRef} src={track.audio_url} onEnded={() => setPlaying(false)} />
      
      <span className="text-xs text-muted-foreground w-6 text-center font-mono">{track.ordem}</span>

      <Button variant="ghost" size="sm" onClick={togglePlay} className="w-8 h-8 p-0">
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </Button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{track.titulo}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{track.tipo}</Badge>
          {track.duracao_segundos && <span className="text-[10px] text-muted-foreground">{formatDuration(track.duracao_segundos)}</span>}
          {track.tags?.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
        </div>
      </div>

      <Badge variant={track.publicado ? 'default' : 'secondary'} className="text-[10px]">
        {track.publicado ? 'Pub' : 'Draft'}
      </Badge>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="w-7 h-7 p-0" onClick={moveUp}><ArrowUp className="w-3 h-3" /></Button>
        <Button variant="ghost" size="sm" className="w-7 h-7 p-0" onClick={moveDown}><ArrowDown className="w-3 h-3" /></Button>
        <Button variant="ghost" size="sm" className="w-7 h-7 p-0" onClick={togglePublish}>
          {track.publicado ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-destructive hover:text-destructive">
              <Trash2 className="w-3 h-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir faixa "{track.titulo}"?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTrack.mutate(track.id)} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// ─── Add Track Form ─────────────────────────
function AddTrackForm({ albumId, onCreated }: { albumId: string; onCreated: () => void }) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<'audio' | 'podcast'>('audio');
  const [audioUrl, setAudioUrl] = useState('');
  const [tags, setTags] = useState('');
  const createTrack = useCreateTrack();

  const handleCreate = async () => {
    if (!titulo.trim() || !audioUrl.trim()) return;
    try {
      await createTrack.mutateAsync({
        album_id: albumId,
        titulo: titulo.trim(),
        tipo,
        audio_url: audioUrl.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      setTitulo(''); setAudioUrl(''); setTags('');
      onCreated();
      toast({ title: 'Faixa adicionada' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-2 p-3 rounded-md border border-dashed border-border bg-muted/30">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Label className="text-xs">Título da faixa *</Label>
          <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Faixa 1 — Abertura do Campo" className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs">Tipo</Label>
          <Select value={tipo} onValueChange={v => setTipo(v as any)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="audio">🎵 Áudio</SelectItem>
              <SelectItem value="podcast">🎙️ Podcast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Tags (separadas por vírgula)</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="abertura, portal" className="h-8 text-sm" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">URL do áudio *</Label>
          <Input value={audioUrl} onChange={e => setAudioUrl(e.target.value)} placeholder="https://..." className="h-8 text-sm" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCreated}>Cancelar</Button>
        <Button size="sm" onClick={handleCreate} disabled={createTrack.isPending || !titulo.trim() || !audioUrl.trim()} className="gap-1">
          {createTrack.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          Adicionar Faixa
        </Button>
      </div>
    </div>
  );
}

// ─── Album Card ─────────────────────────────
function AlbumCard({ album }: { album: AudioAlbum }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ titulo: album.titulo, descricao: album.descricao || '' });
  const { data: tracks, isLoading: loadingTracks, refetch } = useAudioTracks(expanded ? album.id : undefined);
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();

  const publishedTrackCount = tracks?.filter(t => t.publicado).length || 0;

  const togglePublish = async () => {
    if (album.status === 'draft' && publishedTrackCount === 0) {
      toast({ title: 'Não permitido', description: 'Publique pelo menos 1 faixa antes de publicar o álbum.', variant: 'destructive' });
      return;
    }
    try {
      const newStatus = album.status === 'published' ? 'draft' : 'published';
      await updateAlbum.mutateAsync({ id: album.id, status: newStatus as any });
      toast({ title: newStatus === 'published' ? 'Álbum publicado' : 'Álbum despublicado' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const saveMeta = async () => {
    try {
      await updateAlbum.mutateAsync({ id: album.id, titulo: draft.titulo, descricao: draft.descricao || null });
      setEditing(false);
      toast({ title: 'Álbum atualizado' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-primary" />
            {album.titulo}
            <Badge variant={album.status === 'published' ? 'default' : 'secondary'} className="text-[10px]">
              {album.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={togglePublish}>
              {album.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir álbum "{album.titulo}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {album.status === 'published'
                      ? 'Este álbum está PUBLICADO. Todas as faixas serão perdidas. Confirma a exclusão?'
                      : 'Todas as faixas serão perdidas. Esta ação é irreversível.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteAlbum.mutate(album.id)} className="bg-destructive text-destructive-foreground">
                    Sim, excluir álbum
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3 pt-0">
          <Separator />

          {/* Edit album meta */}
          {editing ? (
            <div className="space-y-2 p-3 rounded-md border border-border">
              <div>
                <Label className="text-xs">Título</Label>
                <Input value={draft.titulo} onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))} className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Descrição</Label>
                <Textarea value={draft.descricao} onChange={e => setDraft(d => ({ ...d, descricao: e.target.value }))} rows={2} className="text-sm" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
                <Button size="sm" onClick={saveMeta} disabled={updateAlbum.isPending} className="gap-1">
                  <Save className="w-3 h-3" /> Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{album.descricao || 'Sem descrição'}</p>
              <Button variant="outline" size="sm" onClick={() => { setDraft({ titulo: album.titulo, descricao: album.descricao || '' }); setEditing(true); }} className="text-xs">
                Editar
              </Button>
            </div>
          )}

          {/* Tracks list */}
          {loadingTracks ? (
            <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-1">
              {(tracks || []).map(track => (
                <TrackRow key={track.id} track={track} tracks={tracks || []} onRefetch={() => refetch()} />
              ))}
              {(!tracks || tracks.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-3">Nenhuma faixa ainda.</p>
              )}
            </div>
          )}

          {/* Add track */}
          {showAddTrack ? (
            <AddTrackForm albumId={album.id} onCreated={() => setShowAddTrack(false)} />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAddTrack(true)} className="gap-1 w-full border-dashed">
              <Plus className="w-3 h-3" /> Nova Faixa
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Create Album Form ──────────────────────
function CreateAlbumForm({ estacaoId, onCreated }: { estacaoId: string; onCreated: () => void }) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const createAlbum = useCreateAlbum();

  const handleCreate = async () => {
    if (!titulo.trim()) return;
    try {
      await createAlbum.mutateAsync({ estacao_id: estacaoId, titulo: titulo.trim(), descricao: descricao.trim() || undefined });
      setTitulo(''); setDescricao('');
      onCreated();
      toast({ title: 'Álbum criado como rascunho' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-2 p-3 rounded-md border border-dashed border-border">
      <div>
        <Label className="text-xs">Título do álbum *</Label>
        <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Álbum da Estação I" className="h-8 text-sm" />
      </div>
      <div>
        <Label className="text-xs">Descrição</Label>
        <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} placeholder="Descrição do álbum..." className="text-sm" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCreated}>Cancelar</Button>
        <Button size="sm" onClick={handleCreate} disabled={createAlbum.isPending || !titulo.trim()} className="gap-1">
          {createAlbum.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          Criar Álbum
        </Button>
      </div>
    </div>
  );
}

// ─── Main Section (used inside EstacaoSection) ─
export function AdminAudioAlbumSection({ estacaoId }: { estacaoId: string }) {
  const { data: albums, isLoading } = useAudioAlbums(estacaoId);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Music className="w-4 h-4" />
          Álbum de Áudio
        </h4>
        {!showCreate && (
          <Button variant="outline" size="sm" onClick={() => setShowCreate(true)} className="gap-1 text-xs">
            <Plus className="w-3 h-3" /> Novo Álbum
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {showCreate && <CreateAlbumForm estacaoId={estacaoId} onCreated={() => setShowCreate(false)} />}
          {(albums || []).map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
          {(!albums || albums.length === 0) && !showCreate && (
            <p className="text-xs text-muted-foreground text-center py-3">Nenhum álbum nesta estação.</p>
          )}
        </>
      )}
    </div>
  );
}
