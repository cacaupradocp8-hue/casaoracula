import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Loader2,
  Compass,
  Shield,
  Brain,
  Sparkles,
  Lock,
  ArrowRight,
  Plus,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeroVideoBanner } from "@/components/sales/HeroVideoBanner";
import { useRef } from "react";

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  rota: string | null;
  icone: string | null;
  tipo: string | null;
  tipo_ferramenta: string | null;
  origem_metodologica: string | null;
  finalidade_pratica: string | null;
  portal_minimo: string;
  ordem: number;
  ativa: boolean;
}

const SECTIONS = [
  {
    key: 'travessia',
    title: 'Travessia Simbólica',
    subtitle: 'Jornadas de transformação profunda',
    icon: Compass,
    color: 'purple' as const,
  },
  {
    key: 'estrutura',
    title: 'Estrutura & Sobrevivência',
    subtitle: 'Suporte para reorganização',
    icon: Shield,
    color: 'emerald' as const,
  },
  {
    key: 'mapas',
    title: 'Mapas da Psique',
    subtitle: 'Cartografias do mundo interior',
    icon: Brain,
    color: 'gold' as const,
  },
  {
    key: 'oracular',
    title: 'Prática Oracular',
    subtitle: 'Leitura e interpretação simbólica',
    icon: Sparkles,
    color: 'rose' as const,
  },
];

const getSectionForTipoFerramenta = (tipoFerramenta: string | null): string => {
  if (!tipoFerramenta) return 'mapas';
  switch (tipoFerramenta) {
    case 'diagnostico':
    case 'autoleitura':
      return 'mapas';
    case 'leitura_simbolica':
      return 'oracular';
    case 'conducao_terapeutica':
    case 'ferramenta_narrativa':
      return 'travessia';
    case 'ritual_simbolico':
      return 'estrutura';
    default:
      return 'mapas';
  }
};

const sectionGradients = {
  purple: 'from-purple-900/60 via-purple-800/30 to-transparent',
  emerald: 'from-emerald-900/60 via-emerald-800/30 to-transparent',
  gold: 'from-amber-900/60 via-amber-800/30 to-transparent',
  rose: 'from-rose-900/60 via-rose-800/30 to-transparent',
};

const sectionAccents = {
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  gold: 'text-gold',
  rose: 'text-rose-400',
};

const cardAccents = {
  purple: 'border-purple-500/30 hover:border-purple-500/60',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60',
  gold: 'border-gold/30 hover:border-gold/60',
  rose: 'border-rose-500/30 hover:border-rose-500/60',
};

const badgeColors = {
  purple: 'bg-purple-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  gold: 'bg-gold text-background',
  rose: 'bg-rose-500 text-white',
};

/** Horizontal scroll row with arrows */
function ScrollRow({ children, color }: { children: React.ReactNode; color: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/scroll">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-background to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6 text-foreground/70" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6 text-foreground/70" />
      </button>
    </div>
  );
}

/** Netflix-style card for each ferramenta */
function VitrineCard({ ferramenta, color }: { ferramenta: Ferramenta; color: 'purple' | 'emerald' | 'gold' | 'rose' }) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] aspect-[3/4] rounded-lg overflow-hidden border transition-all duration-300 snap-start cursor-default group/card hover:scale-105 hover:z-10",
        cardAccents[color]
      )}
    >
      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-b", sectionGradients[color])} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Lock badge */}
      <div className="absolute top-2 right-2">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", badgeColors[color])}>
          <Lock className="w-3 h-3" />
        </div>
      </div>

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <Lock className="w-16 h-16 text-foreground" />
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {ferramenta.ferramenta_nome}
        </h3>
        <p className="text-[10px] text-foreground/50 line-clamp-2">
          {ferramenta.finalidade_pratica || ferramenta.ferramenta_descricao || 'Ferramenta simbólica'}
        </p>
        {/* Portal badge */}
        <span className={cn("inline-block text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded", badgeColors[color])}>
          {ferramenta.portal_minimo?.replace('_', ' ') || 'Formação'}
        </span>
      </div>
    </div>
  );
}

export default function FerramentasVitrine() {
  const navigate = useNavigate();

  const { data: ferramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-vitrine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, icone, tipo, tipo_ferramenta, origem_metodologica, finalidade_pratica, portal_minimo, ordem, ativa')
        .eq('ativa', true)
        .not('tipo_ferramenta', 'is', null)
        .not('finalidade_pratica', 'is', null)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ferramenta[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const groupedBySection = ferramentas?.reduce((acc, ferramenta) => {
    const sectionKey = getSectionForTipoFerramenta(ferramenta.tipo_ferramenta);
    if (!acc[sectionKey]) acc[sectionKey] = [];
    acc[sectionKey].push(ferramenta);
    return acc;
  }, {} as Record<string, Ferramenta[]>) || {};

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  const hasAnyTools = ferramentas && ferramentas.length > 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* ═══ HERO VIDEO BANNER ═══ */}
        <HeroVideoBanner />

        {/* ═══ TITLE & KEYWORDS ═══ */}
        <div className="relative -mt-16 z-10 text-center px-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gold/70 uppercase tracking-[0.3em] text-xs mb-3">
              Casa Orácula
            </p>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground tracking-wide mb-3">
              VITRINE DE
              <br />
              <span className="font-bold text-3xl md:text-4xl lg:text-5xl">FERRAMENTAS</span>
            </h1>
            <p className="text-foreground/50 text-sm mb-5">
              Recursos da Formação Orácula
            </p>

            {/* Keywords row */}
            <div className="flex items-center justify-center gap-3 text-foreground/60 text-sm mb-6">
              <span>Leitura</span>
              <span className="text-gold/30">-</span>
              <span>Método</span>
              <span className="text-gold/30">-</span>
              <span>Sustentação</span>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => navigate('/sala-da-visitante')}
                className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px]">Iniciar</span>
              </button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-foreground/30 hover:border-foreground/60"
                onClick={() => navigate('/sala-da-visitante')}
              >
                <ArrowRight className="w-4 h-4" />
                Iniciar Travessia
              </Button>

              <button
                onClick={() => {
                  const el = document.getElementById('ferramentas-sections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
              >
                <Info className="w-6 h-6" />
                <span className="text-[10px]">Explorar</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ═══ SECTIONS WITH HORIZONTAL SCROLL ═══ */}
        <div id="ferramentas-sections" className="space-y-10 pb-20 pt-6">
          {!hasAnyTools ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma ferramenta disponível no momento.
              </p>
            </div>
          ) : (
            SECTIONS.map((section, sectionIndex) => {
              const sectionTools = groupedBySection[section.key] || [];
              if (sectionTools.length === 0) return null;

              const IconComponent = section.icon;

              return (
                <motion.section
                  key={section.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  {/* Section title */}
                  <div className="flex items-center gap-3 px-4 md:px-6 mb-3">
                    <IconComponent className={cn("w-5 h-5", sectionAccents[section.color])} />
                    <div>
                      <h2 className={cn("font-display text-lg font-semibold", sectionAccents[section.color])}>
                        {section.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                    </div>
                  </div>

                  {/* Horizontal scroll row */}
                  <ScrollRow color={section.color}>
                    {sectionTools.map((ferramenta) => (
                      <VitrineCard
                        key={ferramenta.id}
                        ferramenta={ferramenta}
                        color={section.color}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              );
            })
          )}

          {/* CTA Final */}
          {hasAnyTools && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center px-4 pt-6"
            >
              <p className="text-muted-foreground text-sm mb-4">
                Pronta para desbloquear essas ferramentas?
              </p>
              <Button
                onClick={() => navigate('/sala-da-visitante')}
                size="lg"
                className="gap-2 bg-gold hover:bg-gold/90 text-background"
              >
                Atravessar o Limiar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
