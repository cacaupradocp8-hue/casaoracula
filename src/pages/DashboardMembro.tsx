import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBussolaOracular } from "@/hooks/useBussolaOracular";
import { useJourneyGuard } from "@/hooks/useJourneyGuard";
import {
  BussolaAtual,
  ProximaAcao,
  MiniMapaCidadela,
  JornadaRecomendada,
  PraticasRelevantes,
  SuaVozResumo,
  AlertaOracular,
} from "@/components/bussola-home";
import { BoasVindasBanner } from "@/components/bussola-home/BoasVindasBanner";
import { ProximoPasso } from "@/components/dashboard/ProximoPasso";
import { motion, AnimatePresence } from "framer-motion";
import { Moon } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";

export default function DashboardMembro() {
  const navigate = useNavigate();
  const bussola = useBussolaOracular();
  const journey = useJourneyGuard();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBoasVindas = searchParams.get('boas-vindas') === 'true';
  const [showBanner, setShowBanner] = useState(isBoasVindas);

  // Journey guard: redirect to correct step if flow not completed
  useEffect(() => {
    if (!journey.loading && journey.redirectTo) {
      navigate(journey.redirectTo, { replace: true });
    }
  }, [journey.loading, journey.redirectTo, navigate]);

  const handleDismissBanner = () => {
    setShowBanner(false);
    searchParams.delete('boas-vindas');
    setSearchParams(searchParams, { replace: true });
  };

  if (bussola.loading) {
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
      <ResponsiveContainer size="wide" className="py-6 md:py-8 pb-24">
        {/* Banner de boas-vindas (pós-compra) */}
        <AnimatePresence>
          {showBanner && (
            <BoasVindasBanner
              nome={bussola.welcomeName}
              temCartografia={bussola.temCartografia}
              onDismiss={handleDismissBanner}
            />
          )}
        </AnimatePresence>

        {/* 1. Bússola — full width */}
        <BussolaAtual
          leituraMomento={bussola.leituraMomento}
          distritoDominante={bussola.distritoDominante}
          distritoTensao={bussola.distritoTensao}
          nivelIntegracao={bussola.nivelIntegracao}
          temCartografia={bussola.temCartografia}
          welcomeName={bussola.welcomeName}
        />

        {/* Layout adaptativo: stack em mobile, 2 colunas em xl+ */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6 xl:gap-8 mt-6">
          <div className="space-y-6 min-w-0">
            <ProximaAcao
              principal={bussola.acaoPrincipal}
              secundarias={bussola.acoesSecundarias}
            />
            <ProximoPasso />
            <JornadaRecomendada leitura={bussola.leitura} />
            <PraticasRelevantes praticas={bussola.praticasSugeridas} />
          </div>
          <div className="space-y-6 min-w-0">
            <MiniMapaCidadela
              temCartografia={bussola.temCartografia}
              distritoDominante={bussola.distritoDominante}
              distritosAtivos={bussola.distritosAtivos}
              distritoTensao={bussola.distritoTensao}
              corHex={bussola.corHex}
              distritosRaw={bussola.distritosRaw}
            />
            <SuaVozResumo voz={bussola.voz} welcomeName={bussola.welcomeName} />
            <AlertaOracular alertas={bussola.alertas} />
          </div>
        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}
