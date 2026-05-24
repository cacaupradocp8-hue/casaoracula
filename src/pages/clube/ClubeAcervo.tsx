import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAllBooks, type Book } from '@/hooks/useBooks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Search, FlaskConical, ArrowRight } from 'lucide-react';
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
      <ResponsiveContainer size="wide" className="py-10 md:py-16 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-border/40" onClick={() => navigate('/clube')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-gold/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold/70 font-bold">Obras Atemporais</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-foreground tracking-tight leading-none">
                Acervo das Rotas
              </h1>
              <p className="text-muted-foreground/70 text-sm font-serif italic mt-2">
                {books?.length ?? 0} registros na biblioteca da alma
              </p>
            </div>
          </div>

          {/* Search Bar - Wide on Desktop */}
          <div className="w-full md:max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-gold transition-colors" />
              <Input
                placeholder="Buscar por título ou autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-card/40 border-border/30 rounded-2xl focus:border-gold/30 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold mr-2">Filtrar por:</span>
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-1.5 rounded-full transition-all text-xs ${!filterCat ? 'bg-gold/10 text-gold border-gold/30' : 'hover:bg-muted border-border/30'}`}
            onClick={() => setFilterCat(null)}
          >
            Todas as Estações
          </Badge>
          {categories.map((cat) => {
            const info = CATEGORY_LABELS[cat];
            return (
              <Badge
                key={cat}
                variant="outline"
                className={`cursor-pointer px-4 py-1.5 rounded-full transition-all text-xs ${filterCat === cat ? info.color : 'hover:bg-muted border-border/30'}`}
                onClick={() => setFilterCat(filterCat === cat ? null : cat)}
              >
                {info.label}
              </Badge>
            );
          })}
        </div>

        {/* Book Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 space-y-4">
             <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto" />
             <p className="text-muted-foreground/60 font-serif italic">Nenhuma obra encontrada nesta cartografia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        )}
      </ResponsiveContainer>
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
        className="group relative h-full border-border/30 bg-card/40 hover:bg-card/60 transition-all duration-500 cursor-pointer overflow-hidden rounded-2xl flex flex-col hover:border-gold/30 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
        onClick={() => navigate(`/clube/laboratorio/book/${book.id}`)}
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Top/Cover Area */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
            {book.cover_url ? (
              <img 
                src={book.cover_url} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">Sem Capa</span>
              </div>
            )}
            
            {/* Category Overlay */}
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter backdrop-blur-md font-bold ${catInfo.color}`}>
                {catInfo.label}
              </Badge>
            </div>
            
            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <Button variant="gold" size="sm" className="rounded-full font-bold shadow-lg">Explorar Obra</Button>
            </div>
          </div>

          {/* Info Area */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <h3 className="font-display text-lg text-foreground group-hover:text-gold transition-colors leading-tight line-clamp-2">
                {book.title}
              </h3>
              {book.author && (
                <p className="text-xs font-serif italic text-muted-foreground/80">{book.author}</p>
              )}
            </div>
            
            {book.description_short && (
              <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed">
                {book.description_short}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border/10">
               <div onClick={(e) => e.stopPropagation()}>
                  <Laboratorio8020Modal 
                    bookId={book.id} 
                    bookTitle={book.title}
                    trigger={
                      <Button variant="ghost" size="sm" className="h-8 gap-2 text-[10px] uppercase tracking-widest font-bold text-gold/60 hover:text-gold hover:bg-gold/10 px-2">
                        <FlaskConical className="w-3.5 h-3.5" />
                        80/20
                      </Button>
                    }
                  />
               </div>
               <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
