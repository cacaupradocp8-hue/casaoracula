import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Eye, Download, BookOpen, ArrowRight } from 'lucide-react';

export interface BookNavLink {
  label: string;
  icon?: string;
  to: string;
}

interface BookCoverDisplayProps {
  capaUrl: string | null | undefined;
  titulo: string;
  autor: string | null | undefined;
  navLinks?: BookNavLink[];
  layout?: 'default' | 'compact';
}

export function BookCoverDisplay({ capaUrl, titulo, autor, navLinks, layout = 'default' }: BookCoverDisplayProps) {
  const [lightbox, setLightbox] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!capaUrl) return;
    const a = document.createElement('a');
    a.href = capaUrl;
    a.download = `capa-${titulo.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  const coverImage = (
    <div
      className={`relative rounded-lg overflow-hidden bg-muted/60 border border-border/50 cursor-pointer group ${
        layout === 'compact' ? 'w-full h-full' : 'w-44 md:w-52 aspect-[2/3]'
      }`}
      onClick={() => setLightbox(true)}
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
  );

  const modal = (
    <Dialog open={lightbox} onOpenChange={setLightbox}>
      <DialogContent className="max-w-md p-4 bg-background/95">
        <DialogTitle className="sr-only">Livro: {titulo}</DialogTitle>

        {capaUrl && (
          <img
            src={capaUrl}
            alt={`Capa: ${titulo}`}
            className="w-full max-h-[50vh] object-contain rounded-lg"
          />
        )}

        <div className="text-center mt-2">
          <p className="text-sm font-semibold text-foreground">{titulo}</p>
          {autor && <p className="text-xs text-muted-foreground">{autor}</p>}
        </div>

        {navLinks && navLinks.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {navLinks.map((link, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-between gap-2 text-sm"
                onClick={() => {
                  setLightbox(false);
                  navigate(link.to);
                }}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <span>{link.icon}</span>}
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        )}

        {capaUrl && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" className="gap-1.5 flex-1 text-xs" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              Baixar imagem
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Compact: just the image + modal (no card wrapper)
  if (layout === 'compact') {
    return (
      <>
        {coverImage}
        {modal}
      </>
    );
  }

  // Default: full card with buttons
  return (
    <>
      <Card className="overflow-hidden mb-8">
        <CardContent className="p-6 flex flex-col items-center">
          {coverImage}
          <p className="text-sm font-medium text-foreground text-center mt-4">{titulo}</p>
          {autor && <p className="text-xs text-muted-foreground text-center mt-0.5">{autor}</p>}
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
      {modal}
    </>
  );
}
