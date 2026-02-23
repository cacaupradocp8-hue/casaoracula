import { useState } from 'react';
import { useJourneyMedia, type GalleryItem } from '@/hooks/useJourneyMedia';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, FileText, ExternalLink } from 'lucide-react';

interface Props {
  journeyId: string;
}

export function JourneyMediaDisplay({ journeyId }: Props) {
  const { data: media } = useJourneyMedia(journeyId);
  const [lightbox, setLightbox] = useState<string | null>(null);

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
          {media.infographic_kind === 'pdf' ? (
            <Button
              variant="outline"
              className="gap-2 w-full justify-start"
              onClick={() => window.open(media.infographic_url!, '_blank')}
            >
              <FileText className="w-4 h-4" />
              Abrir Infográfico (PDF)
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          ) : (
            <img
              src={media.infographic_url}
              alt="Infográfico"
              className="w-full rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(media.infographic_url!)}
            />
          )}
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5" />
            Materiais
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((item, i) => (
              <Card
                key={i}
                className="cursor-pointer hover:border-primary/30 transition-colors overflow-hidden"
                onClick={() => {
                  if (item.kind === 'pdf') window.open(item.url, '_blank');
                  else setLightbox(item.url);
                }}
              >
                {item.kind === 'image' ? (
                  <AspectRatio ratio={4 / 3}>
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  </AspectRatio>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-2.5">
                  <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                  <Badge variant="outline" className="text-[9px] mt-1">{item.kind === 'pdf' ? 'PDF' : 'Imagem'}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-2xl p-2">
          <DialogTitle className="sr-only">Visualização</DialogTitle>
          {lightbox && <img src={lightbox} alt="Visualização" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
