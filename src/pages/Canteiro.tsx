import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCanteiroPublicEntries, useCanteiroReactions, useToggleReaction, type EntryType, type ReactionType, type CanteiroEntry } from '@/hooks/useCanteiro';
import { useMinhasPublicacoesCanteiro } from '@/hooks/useMinhasPublicacoesCanteiro';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, BookOpen, HelpCircle, Flame, Headphones, Quote,
  Heart, Bookmark, Compass, Sparkles, Eye,
} from 'lucide-react';
import { formatDateSafe } from '@/lib/date-safe';

const ENTRY_TYPE_CONFIG: Record<EntryType, { label: string; icon: React.ElementType; accent: string }> = {
  reflexao:        { label: 'Reflexão',           icon: BookOpen,    accent: 'hsl(var(--gold))' },
  pergunta:        { label: 'Pergunta',           icon: HelpCircle,  accent: 'hsl(var(--mystic))' },
  semente_pratica: { label: 'Semente de Prática', icon: Flame,       accent: 'hsl(var(--accent))' },
  eco_de_leitura:  { label: 'Eco de Leitura',     icon: Headphones,  accent: 'hsl(var(--primary))' },
  fragmento:       { label: 'Fragmento',          icon: Quote,       accent: 'hsl(var(--gold-dark))' },
};

const REACTION_CONFIG: Record<ReactionType, { label: string; icon: React.ElementType }> = {
  ecoou:            { label: 'Ecoou em mim',              icon: Heart },
  guardar_refletir: { label: 'Guardar para refletir',     icon: Bookmark },
  levar_travessia:  { label: 'Levar para minha travessia', icon: Compass },
};

const FILTER_TABS: { key: EntryType | 'todos'; label: string; icon: React.ElementType }[] = [
  { key: 'todos',           label: 'Todas',           icon: Sparkles },
  { key: 'reflexao',        label: 'Reflexões',       icon: BookOpen },
  { key: 'pergunta',        label: 'Perguntas',       icon: HelpCircle },
  { key: 'semente_pratica', label: 'Sementes',        icon: Flame },
  { key: 'eco_de_leitura',  label: 'Ecos de Leitura', icon: Headphones },
  { key: 'fragmento',       label: 'Fragmentos',      icon: Quote },
];

export default function Canteiro() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<EntryType | 'todos'>('todos');
  const { data: entries, isLoading } = useCanteiroPublicEntries(activeFilter);
  const { data: minhasPublicacoes } = useMinhasPublicacoesCanteiro();

  const entryIds = useMemo(() => entries?.map(e => e.id) || [], [entries]);
  const { data: reactionsMap } = useCanteiroReactions(entryIds);
  const toggleReaction = useToggleReaction();

  // Highlights: most reacted entries (top 3 by reaction count)
  const highlights = useMemo(() => {
    if (!entries || entries.length < 4 || !reactionsMap) return null;
    return entries
      .map(e => {
        const r = reactionsMap[e.id];
        const total = r ? Object.values(r).reduce((s, v) => s + v.count, 0) : 0;
        return { ...e, totalReactions: total };
      })
      .filter(e => e.totalReactions > 0)
      .sort((a, b) => b.totalReactions - a.totalReactions)
      .slice(0, 3);
  }, [entries, reactionsMap]);

  // User presence stats
  const minhasStats = useMemo(() => {
    if (!minhasPublicacoes) return { total: 0, publicadas: 0, curadoria: 0 };
    const publicadas = minhasPublicacoes.filter(p => p.aprovado_por_admin && p.publicado_em).length;
    const curadoria = minhasPublicacoes.filter(p => !p.aprovado_por_admin && !p.rejeitado).length;
    return { total: minhasPublicacoes.length, publicadas, curadoria };
  }, [minhasPublicacoes]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10 space-y-8">

        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sprout className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-display text-gold-gradient">Canteiro</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            O solo comum onde reflexões cultivadas no Jardim da Psique encontram
            outras vozes — com presença, escuta e consentimento.
          </p>
          <div className="w-16 h-px bg-primary/20 mx-auto" />
        </motion.div>

        {/* ─── Minha presença ─── */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-4 rounded-xl border border-border/15 bg-card/40"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-foreground/60">Minha presença no Canteiro</span>
              <div className="flex items-center gap-3">
                {minhasStats.total > 0 ? (
                  <>
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/70">
                      {minhasStats.publicadas} publicada{minhasStats.publicadas !== 1 ? 's' : ''}
                    </Badge>
                    {minhasStats.curadoria > 0 && (
                      <Badge variant="outline" className="text-[10px] border-border/20 text-muted-foreground">
                        {minhasStats.curadoria} em curadoria
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40">Nenhuma partilha ainda</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary/60 hover:text-primary"
              onClick={() => navigate('/jardim-da-psique')}
            >
              <Sprout className="w-3.5 h-3.5 mr-1.5" />
              Minhas publicações
            </Button>
          </motion.div>
        )}

        {/* ─── Destaques ─── */}
        {highlights && highlights.length > 0 && activeFilter === 'todos' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary/50" />
              <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Sementes que ecoaram</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {highlights.map((entry) => {
                const config = ENTRY_TYPE_CONFIG[entry.entry_type] || ENTRY_TYPE_CONFIG.reflexao;
                const Icon = config.icon;
                return (
                  <Card key={entry.id} className="border-primary/10 bg-card/30 hover:border-primary/20 transition-all">
                    <CardContent className="p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3 text-primary/60" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">{config.label}</span>
                      </div>
                      <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">
                        {entry.texto}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-muted-foreground/40">
                          {entry.author_nome || 'Anônima'}
                        </span>
                        <div className="flex items-center gap-1 text-primary/40">
                          <Heart className="w-2.5 h-2.5" />
                          <span className="text-[9px]">{entry.totalReactions}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Filtros ─── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FILTER_TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeFilter === tab.key;
            return (
              <Button
                key={tab.key}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`text-xs rounded-full h-8 gap-1.5 ${
                  isActive
                    ? 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/20'
                    : 'border-border/20 text-muted-foreground/60 hover:text-foreground hover:border-border/40'
                }`}
                onClick={() => setActiveFilter(tab.key)}
              >
                <TabIcon className="w-3 h-3" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* ─── Partilhas ─── */}
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
            <Sprout className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground/40">
              Nenhuma partilha encontrada neste momento.
            </p>
            <p className="text-xs text-muted-foreground/25 mt-1">
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

/* ─── Card de Partilha ─── */

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
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Card className="border-border/10 bg-card/50 backdrop-blur-sm hover:border-border/25 transition-all duration-500 group overflow-hidden">
        <CardContent className="p-5 space-y-3">
          {/* Tipo + Título */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config.accent}12` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.accent }} />
            </div>
            <Badge variant="outline" className="text-[10px] border-border/15 font-normal text-muted-foreground/60">
              {config.label}
            </Badge>
            {entry.published_title && (
              <span className="text-xs font-medium text-foreground/60 ml-1 italic">
                {entry.published_title}
              </span>
            )}
          </div>

          {/* Texto */}
          <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line">
            {displayText}
          </p>
          {isLong && (
            <button
              className="flex items-center gap-1 text-xs text-primary/50 hover:text-primary transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              <Eye className="w-3 h-3" />
              {expanded ? 'Recolher' : 'Ler com presença'}
            </button>
          )}

          {/* Rodapé: Autora + Data */}
          <div className="flex items-center justify-between pt-2 border-t border-border/8">
            <span className="text-[11px] text-muted-foreground/40">
              {entry.author_nome || 'Partilha anônima'}
            </span>
            <span className="text-[10px] text-muted-foreground/25">
              {formatDateSafe(entry.publicado_em || entry.created_at, "dd MMM yyyy")}
            </span>
          </div>

          {/* Interações simbólicas */}
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
                    className={`h-7 px-2.5 text-[10px] gap-1 rounded-full transition-all ${
                      isActive
                        ? 'text-primary bg-primary/8 hover:bg-primary/12'
                        : 'text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30'
                    }`}
                    onClick={() => onReact(type)}
                    title={cfg.label}
                  >
                    <RIcon className={`w-3 h-3 ${isActive ? 'fill-primary/30' : ''}`} />
                    <span>{cfg.label.split(' ')[0]}</span>
                    {data?.count ? <span className="ml-0.5 font-medium">{data.count}</span> : null}
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
