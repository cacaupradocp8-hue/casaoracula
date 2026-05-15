import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Headphones, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Edit3, 
  Eye, 
  EyeOff,
  MoreVertical,
  Music,
  Disc,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
  ArrowUpDown,
  Tag,
  AlertCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const TAXONOMIA_EDITORIAL = [
  { value: 'abertura_campo', label: 'Abertura de Campo', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'aula_principal', label: 'Aula Principal', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'conto_simbolo', label: 'Conto & Símbolo', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'laboratorio_80_20', label: 'Laboratório 80/20', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { value: 'pratica_guiada', label: 'Prática Guiada', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { value: 'fechamento_campo', label: 'Fechamento de Campo', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { value: 'forja_profissional', label: 'Forja Profissional', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { value: 'meditacao', label: 'Meditação', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { value: 'instrucao_tecnica', label: 'Instrução Técnica', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

export function AdminClubeAudioteca() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEditorial, setSelectedEditorial] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [editingTrack, setEditingTrack] = useState<any>(null);
  const [prevTrack, setPrevTrack] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  // Queries
  const { data: albums, isLoading: loadingAlbums } = useQuery({
    queryKey: ['admin-clube-audio-albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_albums')
        .select(`
          *,
          estacao:clube_estacoes(titulo),
          tracks:clube_audio_tracks(count)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: tracks, isLoading: loadingTracks } = useQuery({
    queryKey: ['admin-clube-audio-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_tracks')
        .select(`
          *,
          album:clube_audio_albums(titulo)
        `)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: rotaItens } = useQuery({
    queryKey: ['admin-clube-itens-rota-metadata'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('id, titulo, metadata');
      if (error) throw error;
      return data;
    }
  });

  const getTrackUsage = (audioUrl: string) => {
    if (!rotaItens || !audioUrl) return [];
    return rotaItens.filter(item => {
      const meta = item.metadata as any;
      if (!meta) return false;
      return JSON.stringify(meta).includes(audioUrl);
    });
  };

  const updateTrack = useMutation({
    mutationFn: async (payload: any) => {
      const { id, album, album_id, ...updates } = payload;
      const { error } = await supabase
        .from('clube_audio_tracks')
        .update(updates)
        .eq('id', id);
      if (error) throw error;

      // Log changes
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const key in updates) {
          const valAnterior = prevTrack[key];
          const valNovo = updates[key];
          
          if (valNovo !== undefined && String(valAnterior) !== String(valNovo)) {
            await supabase.from('clube_audit_log').insert({
              user_id: user.id,
              tabela: 'clube_audio_tracks',
              registro_id: id,
              acao: 'UPDATE',
              campo_alterado: key,
              valor_anterior: valAnterior !== null && valAnterior !== undefined ? String(valAnterior) : 'vazio',
              valor_novo: valNovo !== null && valNovo !== undefined ? String(valNovo) : 'vazio'
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-audio-tracks'] });
      toast.success('Áudio atualizado com sucesso');
      setIsEditDialogOpen(false);
    }
  });

  const handlePlay = (track: any) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.audio_url;
        audioRef.current.play();
        setPlayingId(track.id);
      }
    }
  };

  const filteredTracks = tracks?.filter(t => {
    const matchesSearch = t.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.album?.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEditorial = selectedEditorial === 'all' || (t.tags && t.tags.includes(selectedEditorial));
    return matchesSearch && matchesEditorial;
  });

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Disc className="w-4 h-4 text-gold" /> Álbuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music className="w-4 h-4 text-gold" /> Total de Faixas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tracks?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Headphones className="w-4 h-4 text-gold" /> Em Uso (Rota)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tracks?.filter(t => getTrackUsage(t.audio_url).length > 0).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-midnight/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold" /> Publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tracks?.filter(t => t.publicado).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar áudio ou álbum..." 
            className="pl-10 bg-midnight/40 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedEditorial} onValueChange={setSelectedEditorial}>
            <SelectTrigger className="w-[180px] bg-midnight/40 border-white/10">
              <SelectValue placeholder="Taxonomia Editorial" />
            </SelectTrigger>
            <SelectContent className="bg-midnight border-white/10">
              <SelectItem value="all">Todas Categorias</SelectItem>
              {TAXONOMIA_EDITORIAL.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-midnight/40 border-white/10" onClick={() => setSelectedAlbum(null)}>
            <Filter className="w-4 h-4" /> Álbuns
          </Button>
          <Button className="gap-2 bg-gold text-midnight hover:bg-gold/90">
            <Plus className="w-4 h-4" /> Novo Álbum
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg text-white/90">Álbuns / Estações</h2>
            <Badge variant="outline" className="border-gold/30 text-gold/60">clube_audio_albums</Badge>
          </div>
          <ScrollArea className="h-[600px] rounded-xl border border-white/5 bg-midnight/20 p-4">
            <div className="space-y-3">
              {loadingAlbums ? (
                <div className="text-center py-8 text-muted-foreground">Carregando álbuns...</div>
              ) : albums?.map((album) => (
                <Card 
                  key={album.id} 
                  className={`bg-midnight/40 border-white/10 hover:border-gold/30 transition-all cursor-pointer ${selectedAlbum?.id === album.id ? 'border-gold/50 bg-gold/5' : ''}`}
                  onClick={() => setSelectedAlbum(album)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                        {album.capa_url ? (
                          <img src={album.capa_url} alt={album.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <Disc className="w-6 h-6 text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{album.titulo}</p>
                        <p className="text-[10px] text-muted-foreground truncate uppercase">{album.estacao?.titulo || 'Sem Estação'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[10px]">{album.tracks?.[0]?.count || 0} faixas</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg text-white/90">Faixas de Áudio</h2>
              <Badge variant="outline" className="border-gold/30 text-gold/60">clube_audio_tracks</Badge>
            </div>
            {selectedAlbum && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlbum(null)} className="text-xs text-gold">Ver todos</Button>
            )}
          </div>

          <div className="rounded-xl border border-white/5 overflow-hidden bg-midnight/20">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Álbum</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Uso na Rota</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingTracks ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando faixas...</TableCell></TableRow>
                ) : (selectedAlbum ? filteredTracks?.filter(t => t.album_id === selectedAlbum.id) : filteredTracks)?.map((track) => {
                  const usage = getTrackUsage(track.audio_url);
                  return (
                    <TableRow key={track.id} className="hover:bg-white/[0.01] transition-colors">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-gold/10 hover:text-gold"
                          onClick={() => handlePlay(track)}
                        >
                          {playingId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{track.titulo}</span>
                            {!track.tags?.some((tag: string) => TAXONOMIA_EDITORIAL.some(t => t.value === tag)) && (
                              <AlertCircle className="w-3 h-3 text-amber-500/50" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {track.tags?.map((tag: string) => {
                              const taxonomy = TAXONOMIA_EDITORIAL.find(t => t.value === tag);
                              if (taxonomy) {
                                return (
                                  <Badge key={tag} variant="outline" className={`text-[8px] h-3.5 px-1 py-0 ${taxonomy.color}`}>
                                    {taxonomy.label}
                                  </Badge>
                                );
                              }
                              return (
                                <Badge key={tag} variant="outline" className="text-[8px] h-3.5 px-1 py-0 text-white/30 border-white/5">
                                  {tag}
                                </Badge>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{track.audio_url}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{track.album?.titulo || '-'}</TableCell>
                      <TableCell className="text-xs font-mono">{formatDuration(track.duracao_segundos)}</TableCell>
                      <TableCell>
                        {usage.length > 0 ? (
                          <div className="flex -space-x-2">
                            {usage.map((u, i) => (
                              <Badge key={i} variant="outline" className="bg-gold/5 border-gold/20 text-gold/60 text-[9px] px-1" title={u.titulo}>
                                {u.titulo.substring(0, 2)}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-white/10 italic">Não vinculado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {track.publicado ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">Publicado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-white/20 border-white/5 text-[9px]">Rascunho</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4 text-white/40" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-midnight border-white/10">
                            <DropdownMenuItem onClick={() => {
                              setEditingTrack({...track});
                              setPrevTrack({...track});
                              setIsEditDialogOpen(true);
                            }} className="gap-2">
                              <Edit3 className="w-4 h-4" /> Editar Dados
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(track.audio_url, '_blank')} className="gap-2">
                              <ExternalLink className="w-4 h-4" /> Ver Arquivo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-midnight border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gold font-display">Editar Faixa de Áudio</DialogTitle>
            <DialogDescription>Atualize as informações metadados da faixa.</DialogDescription>
          </DialogHeader>
          
          {editingTrack && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Título da Faixa</Label>
                  <Input 
                    value={editingTrack.titulo} 
                    onChange={(e) => setEditingTrack({...editingTrack, titulo: e.target.value})}
                    className="bg-midnight/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem (#)</Label>
                  <Input 
                    type="number"
                    value={editingTrack.ordem} 
                    onChange={(e) => setEditingTrack({...editingTrack, ordem: parseInt(e.target.value)})}
                    className="bg-midnight/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (segundos)</Label>
                  <Input 
                    type="number"
                    value={editingTrack.duracao_segundos} 
                    onChange={(e) => setEditingTrack({...editingTrack, duracao_segundos: parseInt(e.target.value)})}
                    className="bg-midnight/40 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Taxonomia Editorial</Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  {TAXONOMIA_EDITORIAL.map(t => {
                    const isSelected = editingTrack.tags?.includes(t.value);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          const currentTags = editingTrack.tags || [];
                          const newTags = isSelected 
                            ? currentTags.filter((tag: string) => tag !== t.value)
                            : [...currentTags, t.value];
                          setEditingTrack({...editingTrack, tags: newTags});
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                          isSelected 
                            ? `${t.color} border-current ring-1 ring-current/30` 
                            : 'bg-white/5 text-muted-foreground border-transparent hover:bg-white/10'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground italic">Selecione uma ou mais categorias para organizar a Audioteca.</p>
              </div>

              <div className="space-y-2">
                <Label>URL do Áudio (External)</Label>
                <Input 
                  value={editingTrack.audio_url} 
                  onChange={(e) => setEditingTrack({...editingTrack, audio_url: e.target.value})}
                  className="bg-midnight/40 border-white/10 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <Label>Status de Publicação</Label>
                  <p className="text-[10px] text-muted-foreground">Define se a faixa é visível para assinantes</p>
                </div>
                <Switch 
                  checked={editingTrack.publicado}
                  onCheckedChange={(checked) => setEditingTrack({...editingTrack, publicado: checked})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/10">Cancelar</Button>
            <Button 
              onClick={() => updateTrack.mutate(editingTrack)}
              className="bg-gold text-midnight hover:bg-gold/90"
              disabled={updateTrack.isPending}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
