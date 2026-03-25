import { AppLayout } from "@/components/layout/AppLayout";
import { useHomeInteligente } from "@/hooks/useHomeInteligente";
import { HomeSuaVoz } from "@/components/home-inteligente/HomeSuaVoz";
import { HomeSeuMapa } from "@/components/home-inteligente/HomeSeuMapa";
import { HomeMomento } from "@/components/home-inteligente/HomeMomento";
import { HomeProximoPasso } from "@/components/home-inteligente/HomeProximoPasso";
import { HomeLeitura } from "@/components/home-inteligente/HomeLeitura";
import { HomePraticas } from "@/components/home-inteligente/HomePraticas";
import { DashboardPaths } from "@/components/dashboard/DashboardPaths";
import { DashboardCommunity } from "@/components/dashboard/DashboardCommunity";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";

export default function DashboardMembro() {
  const { voz, mapa, momento, proximoPasso, leitura, loading } = useHomeInteligente();

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full border border-primary/15 flex items-center justify-center">
              <Moon className="w-7 h-7 text-primary/25 animate-pulse" />
            </div>
            <p className="text-muted-foreground/40 text-xs font-display italic">
              Preparando seu espaço...
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-5 md:px-6 py-8 pb-20 max-w-3xl">
        {/* Bloco 1 — Sua Voz */}
        <HomeSuaVoz voz={voz} />

        {/* Bloco 2 — Seu Mapa (CidaDELA) */}
        <HomeSeuMapa mapa={mapa} />

        {/* Bloco 3 — Seu Momento Atual */}
        <HomeMomento momento={momento} mapa={mapa} />

        {/* Bloco 4 — Próximo Passo */}
        <HomeProximoPasso proximoPasso={proximoPasso} />

        {/* Bloco 5 — Jornada de Leitura */}
        <HomeLeitura leitura={leitura} />

        {/* Bloco 6 — Práticas rápidas */}
        <HomePraticas />

        {/* Separador sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent mb-8" />

        {/* Caminhos da Casa (mantido) */}
        <DashboardPaths />

        {/* Comunidade (mantido) */}
        <DashboardCommunity />
      </div>
    </AppLayout>
  );
}
