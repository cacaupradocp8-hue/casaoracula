import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCanteiroPublicEntries, useCanteiroReactions, useToggleReaction, type EntryType, type ReactionType, type CanteiroEntry } from '@/hooks/useCanteiro';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, BookOpen, HelpCircle, Flame, Headphones, Quote,
  Heart, Bookmark, Compass, Loader2,
} from 'lucide-react';
import { formatDateSafe } from '@/lib/date-safe';

const ENTRY_TYPE_CONFIG: Record<EntryType, { label: string; icon: React.ElementType; accent: string }> = {
  reflexao: { label: 'Reflexão', icon: BookOpen, accent: 'hsl(var(--gold))' },
  pergunta: { label: 'Pergunta', icon: HelpCircle, accent: 'hsl(var(--mystic))' },
  semente_pratica: { label: 'Semente de Prática', icon: Flame, accent: 'hsl(var(--accent))' },
  eco_de_leitura: { label: 'Eco de Leitura', icon: Headphones, accent: 'hsl(var(--primary))' },
  fragmento: { label: 'Fragmento', icon: Quote, accent: 'hsl(var(--gold-dark, var(--gold)))' },
};

const REACTION_CONFIG: Record<ReactionType, { label: string; icon: React.ElementType }> = {
  ecoou: { label: 'Ecoou em mim', icon: Heart },
  guardar_refletir: { label: 'Guardar para refletir', icon: Bookmark },
  levar_travessia: { label: 'Levar para minha travessia', icon: Compass },
};

const FILTER_TABS: { key: EntryType | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'reflexao', label: 'Reflexões' },
  { key: 'pergunta', label: 'Perguntas' },
  { key: 'semente_pratica', label: 'Sementes' },
  { key: 'eco_de_leitura', label: 'Ecos de Leitura' },
  { key: 'fragmento', label: 'Fragmentos' },
];

export default function Canteiro() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<EntryType | 'todos'>('todos');
  const { data: entries, isLoading } = useCanteiroPublicEntries(activeFilter);

  const entryIds = useMemo(() => entries?.map(e => e.id) || [], [entries]);
  const { data: reactionsMap } = useCanteiroReactions(entryIds);
  const toggleReaction = useToggleReaction();

  // Count per type for badges
  const typeCounts = useMemo(() => {
    if (!entries) return {};
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      counts[e.entry_type] = (counts[e.entry_type] || 0) + 1;
    });
    return counts;
  }, [entries]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10 space-y-8">

        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <Sprout className="w-7 h-7 text-gold" />
            <h1 className="text-3xl font-display text-gold-gradient">Canteiro</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            O solo comum onde reflexões cultivadas no Jardim da Psique encontram
            outras vozes — com presença, escuta e consentimento.
          </p>
        </motion.div>

        {/* ─── My presence ─── */}
        {user && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/20 bg-card/40">
            <span className="text-xs text-muted-foreground">Minha presença no Canteiro</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gold/70 hover:text-gold"
              onClick={() => navigate('/jardim-da-psique')}
            >
              <Sprout className="w-3 h-3 mr-1" />
              Minhas publicações
            </Button>
          </div>
        )}

        {/* ─── Filters ─── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FILTER_TABS.map(tab => (
            <Button
              key={tab.key}
              variant={activeFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              className={`text-xs rounded-full h-8 ${
                activeFilter === tab.key
                  ? 'bg-gold/20 text-gold border-gold/30 hover:bg-gold/30'
                  : 'border-border/30 text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
              {tab.key !== 'todos' && typeCounts[tab.key] ? (
                <Badge variant="outline" className="ml-1 text-[9px] h-4 px-1.5">
                  {typeCounts[tab.key]}
                </Badge>
              ) : null}
            </Button>
          ))}
        </div>

        {/* ─── Entries ─── */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : !entries?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sprout className="w-12 h-12 text-muted-foreground/15 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground/50">
              Nenhuma partilha encontrada neste momento.
            </p>
            <p className="text-xs text-muted-foreground/30 mt-1">
              As sementes estão sendo cultivadas em silêncio.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-5">
              {entries.map((entry, i) => (
                <CanteiroCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  reactions={reactionsMap?.[entry.id]}
                  onReact={(type) => toggleReaction.mutate({ entryId: entry.id, reactionType: type })}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ─── Card Component ─── */

interface CanteiroCardProps {
  entry: CanteiroEntry;
  index: number;
  reactions?: Record<ReactionType, { count: number; userReacted: boolean }>;
  onReact: (type: ReactionType) => void;
  isAuthenticated: boolean;
}

function CanteiroCard({ entry, index, reactions, onReact, isAuthenticated }: CanteiroCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = ENTRY_TYPE_CONFIG[entry.entry_type] || ENTRY_TYPE_CONFIG.reflexao;
  const Icon = config.icon;

  const isLong = entry.texto.length > 280;
  const displayText = expanded || !isLong ? entry.texto : entry.texto.slice(0, 280) + '…';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="border-border/15 bg-card/60 backdrop-blur-sm hover:border-border/30 transition-all duration-500 group overflow-hidden">
        <CardContent className="p-5 space-y-3">
          {/* Type + Title */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config.accent}15` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.accent }} />
            </div>
            <Badge variant="outline" className="text-[10px] border-border/20 font-normal">
              {config.label}
            </Badge>
            {entry.published_title && (
              <span className="text-xs font-medium text-foreground/70 ml-1">{entry.published_title}</span>
            )}
          </div>

          {/* Text */}
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {displayText}
          </p>
          {isLong && (
            <button
              className="text-xs text-gold/60 hover:text-gold transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Recolher' : 'Ler com presença →'}
            </button>
          )}

          {/* Footer: Author + Date */}
          <div className="flex items-center justify-between pt-2 border-t border-border/10">
            <span className="text-[11px] text-muted-foreground/50">
              {entry.author_nome || 'Partilha anônima'}
              {entry.origem && entry.origem !== 'psique' && (
                <span className="ml-2 text-muted-foreground/30">· {entry.origem}</span>
              )}
            </span>
            <span className="text-[10px] text-muted-foreground/30">
              {formatDateSafe(entry.publicado_em || entry.created_at, "dd MMM yyyy")}
            </span>
          </div>

          {/* Reactions */}
          {isAuthenticated && (
            <div className="flex items-center gap-1.5 pt-1">
              {(Object.entries(REACTION_CONFIG) as [ReactionType, typeof REACTION_CONFIG[ReactionType]][]).map(([type, cfg]) => {
                const data = reactions?.[type];
                const isActive = data?.userReacted || false;
                const RIcon = cfg.icon;
                return (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 text-[10px] gap-1 rounded-full transition-all ${
                      isActive
                        ? 'text-gold bg-gold/10 hover:bg-gold/15'
                        : 'text-muted-foreground/40 hover:text-muted-foreground/70'
                    }`}
                    onClick={() => onReact(type)}
                    title={cfg.label}
                  >
                    <RIcon className="w-3 h-3" />
                    {data?.count ? data.count : null}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
