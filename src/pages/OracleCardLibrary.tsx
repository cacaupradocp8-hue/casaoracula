import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOracleBySlug } from '@/hooks/useOracles';
import { OracleCardDetail } from '@/components/oracle/OracleCardDetail';
import { OracleCard as OracleCardType } from '@/types/oracle';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function useOracleBasePath() {
  const location = useLocation();
  return location.pathname.startsWith('/casa-das-maquinas') 
    ? '/casa-das-maquinas/oraculo' 
    : '/oraculos';
}

export default function OracleCardLibrary() {
  const { oracleSlug } = useParams<{ oracleSlug: string }>();
  const navigate = useNavigate();
  const basePath = useOracleBasePath();
  const { oracle, cards, isLoading, hasAccess } = useOracleBySlug(oracleSlug || '');

  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<(OracleCardType & Record<string, any>) | null>(null);

  const publishedCards = useMemo(() => cards.filter(c => c.status === 'published'), [cards]);

  // Extract unique families and elements
  const families = useMemo(() => {
    const set = new Set<string>();
    publishedCards.forEach(c => {
      const card = c as OracleCardType & Record<string, any>;
      if (card.familia) set.add(card.familia);
    });
    return Array.from(set).sort();
  }, [publishedCards]);

  const elements = useMemo(() => {
    const set = new Set<string>();
    publishedCards.forEach(c => {
      const card = c as OracleCardType & Record<string, any>;
      if (card.elemento) set.add(card.elemento);
    });
    return Array.from(set).sort();
  }, [publishedCards]);

  // Filter cards
  const filtered = useMemo(() => {
    return publishedCards.filter(c => {
      const card = c as OracleCardType & Record<string, any>;
      if (search && !card.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedFamily && card.familia !== selectedFamily) return false;
      if (selectedElement && card.elemento !== selectedElement) return false;
      return true;
    });
  }, [publishedCards, search, selectedFamily, selectedElement]);

  const primaryColor = oracle?.theme_json?.primaryColor || 'hsl(var(--gold))';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-8 h-8 animate-breathe text-primary" />
      </div>
    );
  }

  if (!oracle || !hasAccess()) {
    navigate(basePath);
    return null;
  }

  const hasActiveFilters = !!search || !!selectedFamily || !!selectedElement;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border/10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`${basePath}/${oracle.slug}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-display text-foreground truncate">Biblioteca de Cartas</h1>
          <p className="text-xs text-muted-foreground/50">{oracle.name}</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar carta..."
              className="pl-9 bg-card/20 border-border/10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Family filter */}
          {families.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <FilterChip
                label="Todas"
                active={!selectedFamily}
                onClick={() => setSelectedFamily(null)}
                primaryColor={primaryColor}
              />
              {families.map(f => (
                <FilterChip
                  key={f}
                  label={f}
                  active={selectedFamily === f}
                  onClick={() => setSelectedFamily(selectedFamily === f ? null : f)}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          )}

          {/* Element filter */}
          {elements.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {elements.map(e => (
                <FilterChip
                  key={e}
                  label={e}
                  active={selectedElement === e}
                  onClick={() => setSelectedElement(selectedElement === e ? null : e)}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          )}

          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground/40">
              {filtered.length} {filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
            </p>
          )}
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground/50">Nenhuma carta encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filtered.map((card, index) => {
              const c = card as OracleCardType & Record<string, any>;
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
                  onClick={() => setSelectedCard(c)}
                  className="group text-left"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/5 group-hover:ring-gold/20 transition-all duration-500 group-hover:shadow-[0_10px_30px_-10px_hsl(var(--gold)/0.15)]">
                    {card.main_image_url ? (
                      <img
                        src={card.main_image_url}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}
                      >
                        <Sparkles className="w-5 h-5 text-gold/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <p className="text-xs text-foreground/60 mt-2 truncate group-hover:text-foreground transition-colors duration-300">
                    {card.title}
                  </p>
                  {c.familia && (
                    <p className="text-[10px] text-muted-foreground/30 truncate">
                      {c.familia}
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      <OracleCardDetail
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        primaryColor={primaryColor}
      />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  primaryColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0',
        active
          ? 'text-background font-medium'
          : 'bg-card/30 text-muted-foreground/60 hover:text-foreground border border-border/10'
      )}
      style={active ? { backgroundColor: primaryColor } : undefined}
    >
      {label}
    </button>
  );
}
