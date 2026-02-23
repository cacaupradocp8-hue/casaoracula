// ============================================
// Seção "Áudio da Estação" — Card para a página da estação
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ChevronDown, ChevronUp, Disc3, Loader2 } from 'lucide-react';
import { useAudioAlbums, type AudioAlbum } from '@/hooks/useAudioAlbums';
import { AlbumPlayerView } from '@/components/audio/AlbumPlayerView';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  estacaoId: string;
}

export function EstacaoAudioSection({ estacaoId }: Props) {
  const { data: albums, isLoading } = useAudioAlbums(estacaoId);
  const [selectedAlbum, setSelectedAlbum] = useState<AudioAlbum | null>(null);

  // Only show published albums
  const publishedAlbums = (albums || []).filter(a => a.status === 'published');

  if (isLoading) return null;
  if (publishedAlbums.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            Áudio da Estação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!selectedAlbum ? (
            /* Album list */
            publishedAlbums.map(album => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors flex items-center gap-3"
              >
                <Disc3 className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{album.titulo}</p>
                  {album.descricao && <p className="text-xs text-muted-foreground truncate">{album.descricao}</p>}
                </div>
                <span className="text-xs text-primary font-medium">Abrir</span>
              </button>
            ))
          ) : (
            /* Album view */
            <div className="space-y-3">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => setSelectedAlbum(null)}>
                ← Voltar aos álbuns
              </Button>
              <AlbumPlayerView
                albumId={selectedAlbum.id}
                titulo={selectedAlbum.titulo}
                descricao={selectedAlbum.descricao}
                capaUrl={selectedAlbum.capa_url}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
