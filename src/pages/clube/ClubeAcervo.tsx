import { AppLayout } from '@/components/layout/AppLayout';
import { useAllBooks, type Book } from '@/hooks/useBooks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Search, FlaskConical } from 'lucide-react';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  MATRIZ: { label: 'Matriz', color: 'bg-primary/20 text-primary border-primary/30' },
  TRAVESSIA: { label: 'Travessia', color: 'bg-gold/20 text-gold border-gold/30' },
  PORTA: { label: 'Porta', color: 'bg-mystic/20 text-mystic border-mystic/30' },
  PONTE: { label: 'Ponte', color: 'bg-accent/20 text-accent-foreground border-accent/30' },
  FUNDACAO: { label: 'Fundação', color: 'bg-muted text-muted-foreground border-border' },
};

export default function ClubeAcervo() {
  const navigate = useNavigate();
  const { data: books, isLoading } = useAllBooks();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!books) return [];
    return books.filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || b.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [books, search, filterCat]);

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-10 md:py-16 max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
              Acervo do Clube
            </h1>
            <p className="text-muted-foreground text-sm">
              {books?.length ?? 0} obras na biblioteca simbólica
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/60 border-border/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`cursor-pointer transition-colors ${!filterCat ? 'bg-primary/20 text-primary border-primary/30' : 'hover:bg-muted'}`}
              onClick={() => setFilterCat(null)}
            >
              Todas
            </Badge>
            {categories.map((cat) => {
              const info = CATEGORY_LABELS[cat];
              return (
                <Badge
                  key={cat}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${filterCat === cat ? info.color : 'hover:bg-muted'}`}
                  onClick={() => setFilterCat(filterCat === cat ? null : cat)}
                >
                  {info.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Book Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Carregando acervo…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Nenhuma obra encontrada.</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function BookCard({ book, index }: { book: Book; index: number }) {
  const navigate = useNavigate();
  const catInfo = CATEGORY_LABELS[book.category] || CATEGORY_LABELS.FUNDACAO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <Card
        className="border-border/40 bg-card/60 hover:bg-card/80 transition-colors cursor-pointer group"
        onClick={() => navigate(`/clube/laboratorio/book/${book.id}`)}
      >
        <CardContent className="p-5 flex gap-5">
          {/* Cover */}
          <div className="w-16 h-22 flex-shrink-0 rounded-md bg-muted/30 border border-border/30 flex items-center justify-center overflow-hidden">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover rounded-md" />
            ) : (
              <BookOpen className="w-6 h-6 text-muted-foreground/40" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base text-foreground group-hover:text-primary transition-colors leading-tight">
                {book.title}
              </h3>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${catInfo.color}`}>
                  {catInfo.label}
                </Badge>
                <div onClick={(e) => e.stopPropagation()}>
                  <Laboratorio8020Modal 
                    bookId={book.id} 
                    bookTitle={book.title}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <FlaskConical className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
            {book.author && (
              <p className="text-xs text-muted-foreground">{book.author}</p>
            )}
            {book.description_short && (
              <p className="text-xs text-muted-foreground/70 line-clamp-2">{book.description_short}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
