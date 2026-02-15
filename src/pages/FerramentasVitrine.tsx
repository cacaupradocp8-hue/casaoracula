import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Loader2,
  Lock,
  ArrowRight,
  Plus,
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeroVideoBanner } from "@/components/sales/HeroVideoBanner";
import { useRef } from "react";

interface ModuloFormativo {
  id: string;
  nome_modulo: string;
  tipo_modulo: string;
  descricao_curta: string | null;
  imagem_capa: string | null;
  ordem_exibicao: number;
  nivel_acesso: string;
  status_publicacao: string;
  destaque_vitrine: boolean;
  rota_destino: string | null;
}

const NIVEL_MAP: Record<string, { label: string; portals: string[] }> = {
  aberta: { label: "Aberto", portals: ["visitante", "mentorada", "aluna_formacao", "assinante", "oracula", "admin"] },
  iniciada: { label: "Certificação", portals: ["aluna_formacao", "assinante", "oracula", "admin"] },
  certificada: { label: "Assinante", portals: ["assinante", "oracula", "admin"] },
  mentoria: { label: "Mentoria", portals: ["mentorada", "aluna_formacao", "assinante", "oracula", "admin"] },
};

const TIPO_LABELS: Record<string, string> = {
  jornada: "Jornadas",
  curso: "Cursos",
  circulo: "Círculos",
  travessia: "Travessias",
  biblioteca: "Biblioteca",
};

const TIPO_COLORS: Record<string, { accent: string; gradient: string; badge: string; card: string }> = {
  jornada: {
    accent: "text-purple-400",
    gradient: "from-purple-900/60 via-purple-800/30 to-transparent",
    badge: "bg-purple-500 text-white",
    card: "border-purple-500/30 hover:border-purple-500/60",
  },
  curso: {
    accent: "text-gold",
    gradient: "from-amber-900/60 via-amber-800/30 to-transparent",
    badge: "bg-gold text-background",
    card: "border-gold/30 hover:border-gold/60",
  },
  circulo: {
    accent: "text-emerald-400",
    gradient: "from-emerald-900/60 via-emerald-800/30 to-transparent",
    badge: "bg-emerald-500 text-white",
    card: "border-emerald-500/30 hover:border-emerald-500/60",
  },
  travessia: {
    accent: "text-rose-400",
    gradient: "from-rose-900/60 via-rose-800/30 to-transparent",
    badge: "bg-rose-500 text-white",
    card: "border-rose-500/30 hover:border-rose-500/60",
  },
  biblioteca: {
    accent: "text-sky-400",
    gradient: "from-sky-900/60 via-sky-800/30 to-transparent",
    badge: "bg-sky-500 text-white",
    card: "border-sky-500/30 hover:border-sky-500/60",
  },
};

function hasAccess(userPortal: string | undefined, nivelAcesso: string): boolean {
  const portal = userPortal || "visitante";
  if (portal === "admin") return true;
  const config = NIVEL_MAP[nivelAcesso];
  return config ? config.portals.includes(portal) : false;
}

function getBlockMessage(nivelAcesso: string): string {
  switch (nivelAcesso) {
    case "iniciada": return "Disponível na Certificação";
    case "certificada": return "Disponível para Assinantes";
    case "mentoria": return "Disponível na Mentoria";
    default: return "Acesso restrito";
  }
}

/** Horizontal scroll row */
function ScrollRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/scroll">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-background to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6 text-foreground/70" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 md:px-6 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent opacity-0 group-hover/scroll:opacity-100 transition-opacity flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6 text-foreground/70" />
      </button>
    </div>
  );
}

/** Netflix-style card */
function ModuloCard({
  modulo,
  canAccess,
  onClick,
}: {
  modulo: ModuloFormativo;
  canAccess: boolean;
  onClick: () => void;
}) {
  const colors = TIPO_COLORS[modulo.tipo_modulo] || TIPO_COLORS.curso;

  return (
    <div
      onClick={canAccess ? onClick : undefined}
      className={cn(
        "relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] aspect-[3/4] rounded-lg overflow-hidden border transition-all duration-300 snap-start group/card hover:scale-105 hover:z-10",
        colors.card,
        canAccess ? "cursor-pointer" : "cursor-not-allowed opacity-70"
      )}
    >
      {/* Background image or gradient */}
      {modulo.imagem_capa ? (
        <img src={modulo.imagem_capa} alt={modulo.nome_modulo} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-b", colors.gradient)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Destaque badge */}
      {modulo.destaque_vitrine && (
        <div className="absolute top-2 left-2">
          <div className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1", colors.badge)}>
            <Star className="w-2.5 h-2.5" /> DESTAQUE
          </div>
        </div>
      )}

      {/* Lock badge if no access */}
      {!canAccess && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
            <Lock className="w-3 h-3 text-foreground/70" />
          </div>
        </div>
      )}

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {modulo.nome_modulo}
        </h3>
        {modulo.descricao_curta && (
          <p className="text-[10px] text-foreground/50 line-clamp-2">{modulo.descricao_curta}</p>
        )}
        {!canAccess ? (
          <span className="inline-block text-[9px] font-medium text-foreground/60 bg-white/10 px-1.5 py-0.5 rounded">
            🔒 {getBlockMessage(modulo.nivel_acesso)}
          </span>
        ) : (
          <span className={cn("inline-block text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded", colors.badge)}>
            {TIPO_LABELS[modulo.tipo_modulo] || modulo.tipo_modulo}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FerramentasVitrine() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: modulos, isLoading } = useQuery({
    queryKey: ["modulos-formativos-vitrine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modulos_formativos")
        .select("*")
        .eq("status_publicacao", "publicado")
        .order("ordem_exibicao", { ascending: true });
      if (error) throw error;
      return data as ModuloFormativo[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  // Group by tipo_modulo
  const grouped = (modulos || []).reduce((acc, m) => {
    if (!acc[m.tipo_modulo]) acc[m.tipo_modulo] = [];
    acc[m.tipo_modulo].push(m);
    return acc;
  }, {} as Record<string, ModuloFormativo[]>);

  // Destaques
  const destaques = (modulos || []).filter((m) => m.destaque_vitrine);

  const handleCardClick = (modulo: ModuloFormativo) => {
    if (modulo.rota_destino) {
      navigate(modulo.rota_destino);
    }
  };

  const hasAny = modulos && modulos.length > 0;
  const sectionOrder = ["jornada", "curso", "travessia", "circulo", "biblioteca"];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <HeroVideoBanner />

        {/* Title Section */}
        <div className="relative -mt-16 z-10 text-center px-4 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-gold/70 uppercase tracking-[0.3em] text-xs mb-3">Casa Orácula</p>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground tracking-wide mb-3">
              VITRINE DE
              <br />
              <span className="font-bold text-3xl md:text-4xl lg:text-5xl">FORMAÇÃO</span>
            </h1>
            <p className="text-foreground/50 text-sm mb-5">Jornadas, cursos e travessias da Casa Orácula</p>

            <div className="flex items-center justify-center gap-3 text-foreground/60 text-sm mb-6">
              <span>Leitura</span>
              <span className="text-gold/30">-</span>
              <span>Método</span>
              <span className="text-gold/30">-</span>
              <span>Sustentação</span>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => navigate("/sala-da-visitante")}
                className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px]">Iniciar</span>
              </button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-foreground/30 hover:border-foreground/60"
                onClick={() => navigate("/sala-da-visitante")}
              >
                <ArrowRight className="w-4 h-4" />
                Iniciar Travessia
              </Button>
              <button
                onClick={() => document.getElementById("vitrine-sections")?.scrollIntoView({ behavior: "smooth" })}
                className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
              >
                <Info className="w-6 h-6" />
                <span className="text-[10px]">Explorar</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Content Sections */}
        <div id="vitrine-sections" className="space-y-10 pb-20 pt-6">
          {!hasAny ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum módulo disponível no momento.</p>
            </div>
          ) : (
            <>
              {/* Destaques row */}
              {destaques.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 px-4 md:px-6 mb-3">
                    <Star className="w-5 h-5 text-gold" />
                    <h2 className="font-display text-lg font-semibold text-gold">Destaques</h2>
                  </div>
                  <ScrollRow>
                    {destaques.map((m) => (
                      <ModuloCard
                        key={m.id}
                        modulo={m}
                        canAccess={hasAccess(user?.portal, m.nivel_acesso)}
                        onClick={() => handleCardClick(m)}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              )}

              {/* Grouped by tipo */}
              {sectionOrder.map((tipo, i) => {
                const items = grouped[tipo];
                if (!items || items.length === 0) return null;
                const colors = TIPO_COLORS[tipo] || TIPO_COLORS.curso;

                return (
                  <motion.section
                    key={tipo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 px-4 md:px-6 mb-3">
                      <h2 className={cn("font-display text-lg font-semibold", colors.accent)}>
                        {TIPO_LABELS[tipo] || tipo}
                      </h2>
                    </div>
                    <ScrollRow>
                      {items.map((m) => (
                        <ModuloCard
                          key={m.id}
                          modulo={m}
                          canAccess={hasAccess(user?.portal, m.nivel_acesso)}
                          onClick={() => handleCardClick(m)}
                        />
                      ))}
                    </ScrollRow>
                  </motion.section>
                );
              })}
            </>
          )}

          {/* CTA Final */}
          {hasAny && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center px-4 pt-6"
            >
              <p className="text-muted-foreground text-sm mb-4">Pronta para desbloquear novos conteúdos?</p>
              <Button
                onClick={() => navigate("/sala-da-visitante")}
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
