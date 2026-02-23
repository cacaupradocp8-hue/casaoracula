import { useState } from 'react';
import { useJourneyMedia, type GalleryItem } from '@/hooks/useJourneyMedia';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, FileText, ExternalLink, Download, Eye } from 'lucide-react';

interface Props {
  journeyId: string;
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

function GalleryMeta({ item }: { item: GalleryItem }) {
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

export function JourneyMediaDisplay({ journeyId }: Props) {
  const { data: media } = useJourneyMedia(journeyId);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (!media || !media.published) return null;
  const hasContent = media.header_image_url || media.infographic_url || (media.gallery_items && media.gallery_items.length > 0);
  if (!hasContent) return null;

  const gallery = (Array.isArray(media.gallery_items) ? media.gallery_items : []) as GalleryItem[];

  return (
    <div className="space-y-4">
      {/* Header image */}
      {media.header_image_url && (
        <div className="rounded-xl overflow-hidden border border-border">
          <AspectRatio ratio={16 / 6}>
            <img src={media.header_image_url} alt="Header da jornada" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
      )}

      {/* Infographic */}
      {media.infographic_url && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5" />
            Infográfico
          </h4>
          <div className="flex gap-2">
            <Button
              className="gap-1.5 flex-1"
              onClick={() => {
                if (media.infographic_kind === 'pdf') {
                  window.open(media.infographic_url!, '_blank');
                } else {
                  setLightbox({ url: media.infographic_url!, title: 'Infográfico', kind: media.infographic_kind as any, order: 0 });
                }
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Abrir
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => downloadFile(media.infographic_url!, 'infografico')}
            >
              <Download className="w-3.5 h-3.5" />
              Baixar
            </Button>
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5" />
            Materiais
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map((item, i) => (
              <Card key={i} className="overflow-hidden">
                {item.kind === 'image' ? (
                  <AspectRatio ratio={4 / 3}>
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  </AspectRatio>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <GalleryMeta item={item} />
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="gap-1.5 flex-1 h-8 text-xs"
                      onClick={() => {
                        if (item.kind === 'pdf') window.open(item.url, '_blank');
                        else setLightbox(item);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      Abrir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8 text-xs"
                      onClick={() => downloadFile(item.url, item.title || 'material')}
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
          <DialogTitle className="sr-only">{lightbox?.title || 'Visualização'}</DialogTitle>
          {lightbox && (
            <div className="space-y-3">
              <img src={lightbox.url} alt={lightbox.title} className="w-full rounded-lg" />
              <div className="px-2 space-y-1">
                <p className="text-sm font-medium text-foreground">{lightbox.title}</p>
                <GalleryMeta item={lightbox} />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 w-full"
                onClick={() => downloadFile(lightbox.url, lightbox.title || 'imagem')}
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
