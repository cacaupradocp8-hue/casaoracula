import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Music,
  Disc,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Filter,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TAXONOMIA_EDITORIAL } from '../AdminClubeAudioteca';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (track: any) => void;
}

export function AudiotecaSelector({ open, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [selectedEditorial, setSelectedEditorial] = useState<string>('all');

  const { data: albums } = useQuery({
    queryKey: ['admin-clube-audio-albums-selector'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_albums')
        .select('id, titulo')
        .order('titulo');
      if (error) throw error;
      return data;
    }
  });

  const { data: tracks, isLoading } = useQuery({
    queryKey: ['admin-clube-audio-tracks-selector'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_audio_tracks')
        .select(`
          *,
          album:clube_audio_albums(titulo)
        `)
        .order('titulo');
      if (error) throw error;
      return data;
    }
  });

  const filteredTracks = tracks?.filter(t => {
    const matchesSearch = t.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.album?.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlbum = selectedAlbumId === 'all' || t.album_id === selectedAlbumId;
    const matchesTipo = selectedTipo === 'all' || t.tipo === selectedTipo;
    const matchesEditorial = selectedEditorial === 'all' || (t.tags && t.tags.includes(selectedEditorial));
    return matchesSearch && matchesAlbum && matchesTipo && matchesEditorial;
  });

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-2xl bg-midnight border-white/10">
        <DialogHeader>
          <DialogTitle className="text-gold flex items-center gap-2">
            <Music className="w-5 h-5" /> Vincular da Audioteca
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar áudio..." 
                className="pl-10 bg-midnight/40 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
                <SelectTrigger className="w-[140px] bg-midnight/40 border-white/10">
                  <SelectValue placeholder="Álbum" />
                </SelectTrigger>
                <SelectContent className="bg-midnight border-white/10">
                  <SelectItem value="all">Todos Álbuns</SelectItem>
                  {albums?.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.titulo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEditorial} onValueChange={setSelectedEditorial}>
                <SelectTrigger className="w-[110px] bg-midnight/40 border-white/10">
                  <SelectValue placeholder="Taxonomia" />
                </SelectTrigger>
                <SelectContent className="bg-midnight border-white/10">
                  <SelectItem value="all">Todas</SelectItem>
                  {TAXONOMIA_EDITORIAL.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="w-[110px] bg-midnight/40 border-white/10">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-midnight border-white/10">
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-[400px] border border-white/5 rounded-lg bg-black/20 p-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gold" />
              </div>
            ) : filteredTracks?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Nenhuma faixa encontrada</div>
            ) : (
              <div className="grid gap-2">
                {filteredTracks?.map((track) => (
                  <div 
                    key={track.id}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer transition-all group"
                    onClick={() => onSelect(track)}
                  >
                    <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Music className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{track.titulo}</span>
                        {track.publicado ? (
                          <Badge variant="outline" className="text-[8px] h-4 bg-emerald-500/5 text-emerald-500 border-emerald-500/20">Publicado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[8px] h-4 text-white/20 border-white/5">Rascunho</Badge>
                        )}
                        {!track.tags?.some((tag: string) => TAXONOMIA_EDITORIAL.some(t => t.value === tag)) && (
                          <AlertCircle className="w-2.5 h-2.5 text-amber-500/50" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {track.tags?.map((tag: string) => {
                          const taxonomy = TAXONOMIA_EDITORIAL.find(t => t.value === tag);
                          if (taxonomy) {
                            return (
                              <Badge key={tag} variant="outline" className={`text-[7px] h-3 px-1 py-0 leading-none ${taxonomy.color}`}>
                                {taxonomy.label}
                              </Badge>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <Disc className="w-3 h-3" /> {track.album?.titulo || 'Sem Álbum'}
                        <span className="mx-1">•</span>
                        <Clock className="w-3 h-3" /> {formatDuration(track.duracao_segundos)}
                        <span className="mx-1">•</span>
                        {track.tipo}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-xs text-gold">Selecionar</Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="border-t border-white/5 pt-4">
          <Button variant="outline" onClick={onClose} className="border-white/10">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
