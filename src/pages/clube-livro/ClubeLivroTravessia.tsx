// ============================================
// TRAVESSIA — Página interna de uma Travessia
// Mostra portas e pontes conectadas
// ============================================

import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useBook, useBookLinksForBook, useActiveCycle, useCycleBooks, useBookLinks } from '@/hooks/useBooks';
import { BookOpen, ChevronRight, Home, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const LAYER_META: Record<string, { cor: string; icon: string; label: string }> = {
  PORTA: { cor: 'hsl(152, 37%, 36%)', icon: '🗝', label: 'Porta' },
  PONTE: { cor: 'hsl(268, 38%, 64%)', icon: '⌒', label: 'Ponte' },
};

export default function ClubeLivroTravessia() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading } = useBook(bookId);
  const { data: cycle } = useActiveCycle();
  const { data: cycleBooks } = useCycleBooks(cycle?.id);
  const { data: links } = useBookLinks(cycle?.id);

  const { portas, pontes } = useMemo(() => {
    if (!bookId || !links || !cycleBooks) return { portas: [], pontes: [] };
    const getChildren = (type: string) => {
      const childIds = links.filter(l => l.from_book_id === bookId && l.link_type === type).map(l => l.to_book_id);
      return cycleBooks.filter(cb => cb.book && childIds.includes(cb.book.id)).sort((a, b) => a.layer_order - b.layer_order);
    };
    return { portas: getChildren('ABRE'), pontes: getChildren('INTEGRA') };
  }, [bookId, links, cycleBooks]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-16">
          <span className="text-muted-foreground text-sm animate-pulse">Carregando travessia…</span>
        </div>
      </AppLayout>
    );
  }

  if (!book) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Travessia não encontrada.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/clube-livro/mandala')}>
            Voltar à Mandala
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb — Orientação visual */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Clube do Livro</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro/mandala" className="hover:text-foreground transition-colors">Mandala</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[150px]">Travessia</span>
        </nav>

        {/* Topo */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge variant="outline" className="text-xs mb-2" style={{ color: 'hsl(212, 50%, 36%)', borderColor: 'hsl(212, 50%, 36%)' }}>
            Travessia
          </Badge>
          <h1 className="font-display text-xl text-foreground mb-1">{book.title}</h1>
          {book.author && <p className="text-sm text-muted-foreground">{book.author}</p>}
          <p className="text-sm text-foreground/70 italic mt-3">
            Esta travessia sustenta esta parte da jornada.
          </p>
        </motion.div>

        {/* Portas desta Travessia */}
        {portas.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: LAYER_META.PORTA.cor }}>
              Portas desta Travessia
            </h2>
            <div className="space-y-2">
              {portas.map((cb) => cb.book && (
                <Card
                  key={cb.id}
                  className="cursor-pointer hover:border-[hsl(152,37%,36%,0.5)] transition-all"
                  onClick={() => navigate(`/clube-livro/livro/${cb.book!.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="text-lg shrink-0" style={{ color: LAYER_META.PORTA.cor }}>🗝</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cb.book.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{cb.book.author}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Pontes desta Travessia */}
        {pontes.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: LAYER_META.PONTE.cor }}>
              Pontes desta Travessia
            </h2>
            <div className="flex flex-wrap gap-2">
              {pontes.map((cb) => cb.book && (
                <button
                  key={cb.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 hover:border-[hsl(268,38%,64%,0.4)] bg-card/50 transition-all text-left"
                  onClick={() => navigate(`/clube-livro/livro/${cb.book!.id}`)}
                >
                  <span className="text-sm" style={{ color: LAYER_META.PONTE.cor }}>⌒</span>
                  <span className="text-xs text-foreground truncate">{cb.book.title}</span>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Botão principal */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            size="lg"
            className="w-full gap-2 h-14 text-base"
            onClick={() => navigate(`/clube-livro/livro/${book.id}`)}
          >
            <ArrowRight className="w-5 h-5" />
            Entrar na Jornada deste Livro
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
