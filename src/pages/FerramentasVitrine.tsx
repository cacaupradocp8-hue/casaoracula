import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeroVideoBanner } from "@/components/sales/HeroVideoBanner";
import { AmbientAudioPlayer } from "@/components/sales/AmbientAudioPlayer";

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

/** Vertical card — institutional style */
function ModuloCard({
  modulo,
  canAccess,
  onClick,
  index,
}: {
  modulo: ModuloFormativo;
  canAccess: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={canAccess ? onClick : undefined}
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300 group",
        "bg-[hsl(240,5%,7%)] border border-[hsl(0,0%,100%)]/[0.06]",
        canAccess
          ? "cursor-pointer hover:shadow-[0_8px_30px_-8px_hsl(40,35%,60%,0.12)] hover:-translate-y-1 hover:border-[hsl(40,35%,60%)]/20"
          : "cursor-not-allowed opacity-60"
      )}
    >
      {/* Image area */}
      {modulo.imagem_capa ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={modulo.imagem_capa}
            alt={modulo.nome_modulo}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-[hsl(40,35%,60%)]/10 to-transparent" />
      )}

      {/* Lock overlay */}
      {!canAccess && (
        <div className="absolute top-3 right-3">
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[hsl(40,10%,80%)]" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[hsl(40,35%,60%)]/70 font-medium">
            {TIPO_LABELS[modulo.tipo_modulo] || modulo.tipo_modulo}
          </p>
          <h3 className="font-display text-base md:text-lg font-medium text-[hsl(40,10%,90%)] leading-snug">
            {modulo.nome_modulo}
          </h3>
        </div>

        {modulo.descricao_curta && (
          <p className="text-sm text-[hsl(40,5%,55%)] leading-relaxed line-clamp-3">
            {modulo.descricao_curta}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-[hsl(0,0%,100%)]/[0.06]" />

        {/* Action */}
        {canAccess ? (
          <button className="flex items-center gap-2 text-sm text-[hsl(40,35%,60%)] font-medium group-hover:gap-3 transition-all duration-300">
            Acessar
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-[hsl(40,5%,45%)]">
            {getBlockMessage(modulo.nivel_acesso)}
          </span>
        )}
      </div>
    </motion.div>
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
        <AmbientAudioPlayer />

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* Section header — subtle, institutional */}
          <div className="py-12 md:py-20 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <p className="text-[hsl(40,35%,60%)]/60 uppercase tracking-[0.25em] text-xs mb-4">
                Casa Orácula
              </p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(40,10%,90%)] tracking-wide font-medium">
                Caminhos de Formação
              </h1>
              <p className="text-[hsl(40,5%,50%)] text-sm mt-3 max-w-md mx-auto leading-relaxed">
                Jornadas, cursos e travessias para quem busca presença, método e sustentação.
              </p>
            </motion.div>
          </div>

          {/* Sections */}
          <div className="space-y-12 md:space-y-20 pb-20">
            {!hasAny ? (
              <div className="text-center py-12">
                <p className="text-[hsl(40,5%,45%)]">Nenhum módulo disponível no momento.</p>
              </div>
            ) : (
              <>
                {sectionOrder.map((tipo) => {
                  const items = grouped[tipo];
                  if (!items || items.length === 0) return null;

                  return (
                    <section key={tipo}>
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <h2 className="font-display text-lg md:text-xl text-[hsl(40,10%,85%)] font-medium tracking-wide">
                          {TIPO_LABELS[tipo] || tipo}
                        </h2>
                        <div className="flex-1 h-px bg-[hsl(0,0%,100%)]/[0.06]" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {items.map((m, i) => (
                          <ModuloCard
                            key={m.id}
                            modulo={m}
                            index={i}
                            canAccess={hasAccess(user?.portal, m.nivel_acesso)}
                            onClick={() => handleCardClick(m)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </>
            )}

            {/* CTA Final — contemplative, not promotional */}
            {hasAny && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-8 pb-4"
              >
                <div className="h-px w-16 bg-[hsl(40,35%,60%)]/20 mx-auto mb-8" />
                <p className="text-[hsl(40,5%,50%)] text-sm mb-6">
                  Cada jornada começa com um passo consciente.
                </p>
                <Button
                  onClick={() => navigate("/sala-da-visitante")}
                  variant="hero"
                  size="lg"
                  className="gap-3 border-[hsl(40,35%,60%)]/30 text-[hsl(40,35%,60%)] hover:border-[hsl(40,35%,60%)]/60 hover:bg-[hsl(40,35%,60%)]/5 transition-all duration-300"
                >
                  Iniciar minha travessia
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
