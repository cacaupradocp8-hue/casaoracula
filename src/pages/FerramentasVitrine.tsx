import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAmbientAudio } from "@/components/audio/PageAmbientAudio";

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

function HeroCard({ card, onClick }: { card: VitrineCard; onClick: () => void }) {
  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden flex items-end">
      {/* Media background */}
      <div className="absolute inset-0">
        {card.video_url ? (
          <video
            src={card.video_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          />
        ) : card.imagem ? (
          <img
            src={card.imagem}
            alt={card.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
        )}
        {/* Multi-layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 backdrop-blur-sm [mask-image:linear-gradient(to_top,black_60%,transparent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {/* Decorative line */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
            <Sparkles className="w-3.5 h-3.5 text-gold/60" />
          </div>

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground tracking-wide font-light leading-[1.15]">
            {card.titulo}
          </h1>

          {card.subtitulo && (
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              {card.subtitulo}
            </p>
          )}

          {card.descricao_curta && (
            <p className="text-muted-foreground/60 text-sm max-w-lg">
              {card.descricao_curta}
            </p>
          )}

          {card.link_destino && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-4"
            >
              <Button
                variant="gold"
                size="lg"
                className="gap-3 shadow-[0_0_30px_-5px_hsl(var(--gold)/0.3)]"
                onClick={onClick}
              >
                Acessar
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function SecondaryCard({ card, onClick, index }: { card: VitrineCard; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Card container */}
      <div className="relative rounded-xl overflow-hidden border border-border/20 bg-card/80 backdrop-blur-sm transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.15)]">
        {/* Image */}
        {card.imagem ? (
          <div className="aspect-[16/10] overflow-hidden relative">
            <img
              src={card.imagem}
              alt={card.titulo}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
        )}

        {/* Content */}
        <div className="p-6 space-y-3 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <h3 className="font-display text-lg md:text-xl font-medium text-foreground leading-snug tracking-wide group-hover:text-gold transition-colors duration-300">
            {card.titulo}
          </h3>

          {card.subtitulo && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.subtitulo}
            </p>
          )}

          {card.descricao_curta && (
            <p className="text-xs text-muted-foreground/60 line-clamp-2 leading-relaxed">
              {card.descricao_curta}
            </p>
          )}

          <div className="pt-2 flex items-center gap-2 text-sm text-gold/70 font-medium group-hover:text-gold group-hover:gap-3 transition-all duration-300">
            <span className="tracking-wide">Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium">
                Territórios
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
