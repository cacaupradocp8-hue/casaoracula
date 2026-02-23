import { useState } from 'react';
import { useBookMedia, type BookMedia } from '@/hooks/useBookMedia';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Image, FileText, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Props {
  stationId: string;
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
            <div className="rounded-xl overflow-hidden border border-border">
              <AspectRatio ratio={16 / 6}>
                <img src={banner.file_url} alt={banner.title} className="w-full h-full object-cover" />
              </AspectRatio>
            </div>
          )}
          {cover && (
            <div className="flex justify-center">
              <img
                src={cover.file_url}
                alt={cover.title}
                className="w-40 h-56 object-cover rounded-xl shadow-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setLightbox(cover)}
              />
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
          <div className="grid grid-cols-2 gap-3">
            {gallery.map(item => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-primary/30 transition-colors overflow-hidden"
                onClick={() => {
                  if (item.file_kind === 'pdf') {
                    window.open(item.file_url, '_blank');
                  } else {
                    setLightbox(item);
                  }
                }}
              >
                {item.file_kind === 'image' ? (
                  <AspectRatio ratio={4 / 3}>
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  </AspectRatio>
                ) : (
                  <div className="flex items-center justify-center h-28 bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-2.5">
                  <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                  <Badge variant="outline" className="text-[9px] mt-1">
                    {item.file_kind === 'pdf' ? 'PDF' : 'Imagem'}
                  </Badge>
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
            <div className="space-y-2">
              <img src={lightbox.file_url} alt={lightbox.title} className="w-full rounded-lg" />
              <p className="text-sm text-center text-muted-foreground">{lightbox.title}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
