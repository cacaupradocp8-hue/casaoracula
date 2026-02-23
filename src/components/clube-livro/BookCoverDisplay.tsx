import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, Download, BookOpen } from 'lucide-react';

interface BookCoverDisplayProps {
  capaUrl: string | null | undefined;
  titulo: string;
  autor: string | null | undefined;
}

export function BookCoverDisplay({ capaUrl, titulo, autor }: BookCoverDisplayProps) {
  const [lightbox, setLightbox] = useState(false);

  const handleDownload = () => {
    if (!capaUrl) return;
    const a = document.createElement('a');
    a.href = capaUrl;
    a.download = `capa-${titulo.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  return (
    <>
      <Card className="overflow-hidden mb-8">
        <CardContent className="p-6 flex flex-col items-center">
          {/* Capa */}
          <div
            className="relative w-44 md:w-52 aspect-[2/3] rounded-lg overflow-hidden bg-muted/60 border border-border/50 mb-4 cursor-pointer group"
            onClick={() => capaUrl && setLightbox(true)}
          >
            {capaUrl ? (
              <img
                src={capaUrl}
                alt={`Capa: ${titulo}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <BookOpen className="w-8 h-8" />
                <span className="text-xs">Capa do Livro</span>
              </div>
            )}
          </div>

          {/* Título + Autor */}
          <p className="text-sm font-medium text-foreground text-center">{titulo}</p>
          {autor && <p className="text-xs text-muted-foreground text-center mt-0.5">{autor}</p>}

          {/* Botões */}
          {capaUrl && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setLightbox(true)}>
                <Eye className="w-3.5 h-3.5" />
                Abrir
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5" />
                Baixar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-lg p-2 bg-background/95">
          {capaUrl && (
            <img
              src={capaUrl}
              alt={`Capa: ${titulo}`}
              className="w-full rounded-lg"
            />
          )}
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-foreground">{titulo}</p>
            {autor && <p className="text-xs text-muted-foreground">{autor}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
