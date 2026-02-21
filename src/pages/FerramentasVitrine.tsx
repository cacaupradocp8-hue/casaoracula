import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAmbientAudio } from "@/components/audio/PageAmbientAudio";
import { cn } from "@/lib/utils";

interface VitrineCard {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao_curta: string | null;
  imagem: string | null;
  video_url: string | null;
  link_destino: string | null;
  ordem: number;
  ativo: boolean;
  estilo: string;
  visibilidade_role: string[];
}

function userCanSeeCard(userPortal: string | undefined, roles: string[]): boolean {
  const portal = userPortal || "visitante";
  if (portal === "admin") return true;
  return roles.includes(portal) || roles.includes("visitante");
}

/* ─── Hero Card — Cinematic Full-Screen ─── */
function HeroCard({ card, onClick }: { card: VitrineCard; onClick: () => void }) {
  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden flex items-end">
      {/* Media background */}
      <div className="absolute inset-0">
        {card.video_url ? (
          <video
            src={card.video_url}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover scale-105"
          />
        ) : card.imagem ? (
          <img src={card.imagem} alt={card.titulo} className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary via-card to-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--gold)/0.12),transparent_60%)]" />
          </div>
        )}
        {/* Cinematic overlay — 4 layers for rich depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-60 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-32 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Decorative accent */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-gold/80 to-gold/20" />
            <Sparkles className="w-4 h-4 text-gold/50" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground tracking-wide font-light leading-[1.1]">
            {card.titulo}
          </h1>

          {card.subtitulo && (
            <p className="text-foreground/70 text-lg md:text-xl max-w-2xl leading-relaxed font-body">
              {card.subtitulo}
            </p>
          )}

          {card.descricao_curta && (
            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
              {card.descricao_curta}
            </p>
          )}

          {card.link_destino && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="pt-4"
            >
              <Button
                variant="gold"
                size="lg"
                className="gap-3 text-base px-8 shadow-[0_0_40px_-8px_hsl(var(--gold)/0.4)]"
                onClick={onClick}
              >
                Acessar Território
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Secondary Card — Editorial Magazine Style ─── */
function SecondaryCard({ card, onClick, index }: { card: VitrineCard; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden border border-border/10 bg-card/60 backdrop-blur-sm transition-all duration-700 group-hover:border-gold/25 group-hover:shadow-[0_16px_60px_-16px_hsl(var(--gold)/0.2)]">
        {/* Image with parallax-like scale */}
        {card.imagem ? (
          <div className="aspect-[3/2] overflow-hidden relative">
            <img
              src={card.imagem}
              alt={card.titulo}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            {/* Ambient gold overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-700" />
          </div>
        ) : (
          <div className="aspect-[3/2] bg-gradient-to-br from-secondary via-card to-background relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(var(--gold)/0.06),transparent_70%)]" />
          </div>
        )}

        {/* Content */}
        <div className="p-7 md:p-8 space-y-4 relative">
          <h3 className="font-display text-xl md:text-2xl font-medium text-foreground leading-snug tracking-wide group-hover:text-gold transition-colors duration-500">
            {card.titulo}
          </h3>

          {card.subtitulo && (
            <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">
              {card.subtitulo}
            </p>
          )}

          <div className="pt-3 flex items-center gap-2 text-sm text-gold/60 font-medium group-hover:text-gold group-hover:gap-4 transition-all duration-500">
            <div className="w-6 h-px bg-gold/40 group-hover:w-10 transition-all duration-500" />
            <span className="tracking-widest uppercase text-xs">Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function FerramentasVitrine() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["vitrine-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vitrine_cards")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as VitrineCard[];
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

  const visibleCards = (cards || []).filter((c) =>
    userCanSeeCard(user?.portal, c.visibilidade_role)
  );

  const heroCard = visibleCards.find((c) => c.estilo === "hero_unico");
  const secondaryCards = visibleCards.filter((c) => c.estilo === "card_secundario");

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <PageAmbientAudio settingsPrefix="vitrine" />

        {heroCard && (
          <HeroCard
            card={heroCard}
            onClick={() => heroCard.link_destino && navigate(heroCard.link_destino)}
          />
        )}

        {secondaryCards.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-20 md:py-28">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-5 mb-16"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              <div className="text-center space-y-1">
                <Sparkles className="w-4 h-4 text-gold/40 mx-auto" />
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-medium block">
                  Territórios
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {secondaryCards.map((card, i) => (
                <SecondaryCard
                  key={card.id}
                  card={card}
                  index={i}
                  onClick={() => card.link_destino && navigate(card.link_destino)}
                />
              ))}
            </div>
          </div>
        )}

        {visibleCards.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Sparkles className="w-8 h-8 text-gold/30" />
            <p className="text-muted-foreground text-sm">Nenhum conteúdo disponível no momento.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
