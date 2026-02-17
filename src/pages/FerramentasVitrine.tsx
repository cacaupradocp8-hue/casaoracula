import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAmbientAudio } from "@/components/audio/PageAmbientAudio";

interface VitrineCard {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao_curta: string | null;
  imagem: string | null;
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
    <section className="relative w-full h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden">
      {card.imagem ? (
        <img
          src={card.imagem}
          alt={card.titulo}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent" />
      )}

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[6%] px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-3 max-w-2xl"
        >
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground/90 tracking-wider font-medium leading-relaxed">
            {card.titulo}
          </h1>
          {card.subtitulo && (
            <p className="text-muted-foreground text-sm md:text-base">{card.subtitulo}</p>
          )}
          {card.descricao_curta && (
            <p className="text-muted-foreground/70 text-xs md:text-sm max-w-md mx-auto">{card.descricao_curta}</p>
          )}
        </motion.div>

        {card.link_destino && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8"
          >
            <Button
              variant="hero"
              size="xl"
              className="gap-3 border-[hsl(40,35%,60%)]/40 text-[hsl(40,35%,60%)] hover:border-[hsl(40,35%,60%)]/80 hover:bg-[hsl(40,35%,60%)]/10 transition-all duration-300"
              onClick={onClick}
            >
              Acessar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}

function SecondaryCard({ card, onClick, index }: { card: VitrineCard; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      className="relative rounded-lg overflow-hidden cursor-pointer group bg-card border border-border/30 hover:shadow-[0_8px_30px_-8px_hsl(40,35%,60%,0.12)] hover:-translate-y-1 hover:border-[hsl(40,35%,60%)]/20 transition-all duration-300"
    >
      {card.imagem ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={card.imagem}
            alt={card.titulo}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-transparent" />
      )}

      <div className="p-5 space-y-3">
        <h3 className="font-display text-base md:text-lg font-medium text-foreground leading-snug">
          {card.titulo}
        </h3>
        {card.subtitulo && (
          <p className="text-sm text-muted-foreground">{card.subtitulo}</p>
        )}
        {card.descricao_curta && (
          <p className="text-sm text-muted-foreground/70 line-clamp-2">{card.descricao_curta}</p>
        )}
        <div className="h-px bg-border/30" />
        <button className="flex items-center gap-2 text-sm text-[hsl(40,35%,60%)] font-medium group-hover:gap-3 transition-all duration-300">
          Acessar
          <ArrowRight className="w-4 h-4" />
        </button>
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
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Nenhum conteúdo disponível no momento.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
