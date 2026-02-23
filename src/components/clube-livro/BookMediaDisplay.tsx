import { useState } from 'react';
import { useBookMedia, type BookMedia } from '@/hooks/useBookMedia';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, FileText, Download, ExternalLink, Eye } from 'lucide-react';

interface Props {
  stationId: string;
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function MediaMeta({ item }: { item: BookMedia }) {
  const [showSource, setShowSource] = useState(false);
  const hasMeta = item.caption || item.credit || item.source_url;
  if (!hasMeta) return null;
  return (
    <div className="space-y-0.5">
      {item.caption && <p className="text-[11px] text-muted-foreground italic">{item.caption}</p>}
      {item.credit && <p className="text-[10px] text-muted-foreground">Crédito: {item.credit}</p>}
      {item.source_url && (
        showSource ? (
          <a href={item.source_url} target="_blank" rel="noopener" className="text-[10px] text-primary hover:underline break-all">
            {item.source_url}
          </a>
        ) : (
          <button onClick={() => setShowSource(true)} className="text-[10px] text-primary/70 hover:text-primary">
            Ver fonte
          </button>
        )
      )}
    </div>
  );
}

export function BookMediaDisplay({ stationId }: Props) {
  const { data: items } = useBookMedia(stationId);
  const [lightbox, setLightbox] = useState<BookMedia | null>(null);

  if (!items || items.length === 0) return null;

  const cover = items.find(i => i.type === 'cover' && i.published);
  const banner = items.find(i => i.type === 'banner' && i.published);
  const gallery = items.filter(i => i.type === 'gallery' && i.published);

  if (!cover && !banner && gallery.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Cover + Banner */}
      {(cover || banner) && (
        <div className="space-y-4">
          {banner && (
            <div>
              <div className="rounded-xl overflow-hidden border border-border">
                <AspectRatio ratio={16 / 6}>
                  <img src={banner.file_url} alt={banner.title} className="w-full h-full object-cover" />
                </AspectRatio>
              </div>
              <MediaMeta item={banner} />
            </div>
          )}
          {cover && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={cover.file_url}
                alt={cover.title}
                className="w-40 h-56 object-cover rounded-xl shadow-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setLightbox(cover)}
              />
              <MediaMeta item={cover} />
            </div>
          )}
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-2">
            <Image className="w-3.5 h-3.5" />
            Materiais do Livro
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map(item => (
              <Card key={item.id} className="overflow-hidden">
                {item.file_kind === 'image' ? (
                  <AspectRatio ratio={4 / 3}>
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  </AspectRatio>
                ) : (
                  <div className="flex items-center justify-center h-28 bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <MediaMeta item={item} />
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="gap-1.5 flex-1 h-8 text-xs"
                      onClick={() => {
                        if (item.file_kind === 'pdf') {
                          window.open(item.file_url, '_blank');
                        } else {
                          setLightbox(item);
                        }
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      Abrir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8 text-xs"
                      onClick={() => downloadFile(item.file_url, item.title || 'material')}
                    >
                      <Download className="w-3 h-3" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-2xl p-2">
          <DialogTitle className="sr-only">{lightbox?.title || 'Imagem'}</DialogTitle>
          {lightbox && (
            <div className="space-y-3">
              <img src={lightbox.file_url} alt={lightbox.title} className="w-full rounded-lg" />
              <div className="px-2 space-y-1">
                <p className="text-sm font-medium text-foreground">{lightbox.title}</p>
                <MediaMeta item={lightbox} />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 w-full"
                onClick={() => downloadFile(lightbox.file_url, lightbox.title || 'imagem')}
              >
                <Download className="w-3.5 h-3.5" />
                Baixar imagem
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
