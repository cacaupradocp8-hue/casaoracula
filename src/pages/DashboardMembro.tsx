import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBussolaOracular } from "@/hooks/useBussolaOracular";
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
import { motion, AnimatePresence } from "framer-motion";
import { Moon } from "lucide-react";

export default function DashboardMembro() {
  const bussola = useBussolaOracular();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBoasVindas = searchParams.get('boas-vindas') === 'true';
  const [showBanner, setShowBanner] = useState(isBoasVindas);

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
      <div className="container mx-auto px-5 md:px-6 py-8 pb-24 max-w-2xl">
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

        {/* 1. Bússola — Momento atual */}
        <BussolaAtual
          leituraMomento={bussola.leituraMomento}
          distritoDominante={bussola.distritoDominante}
          distritoTensao={bussola.distritoTensao}
          nivelIntegracao={bussola.nivelIntegracao}
          temCartografia={bussola.temCartografia}
          welcomeName={bussola.welcomeName}
        />

        {/* 2. Próxima Ação — CTA principal */}
        <ProximaAcao
          principal={bussola.acaoPrincipal}
          secundarias={bussola.acoesSecundarias}
        />

        {/* 3. Mini Mapa CidaDELA — Mandala real */}
        <MiniMapaCidadela
          temCartografia={bussola.temCartografia}
          distritoDominante={bussola.distritoDominante}
          distritosAtivos={bussola.distritosAtivos}
          distritoTensao={bussola.distritoTensao}
          corHex={bussola.corHex}
          distritosRaw={bussola.distritosRaw}
        />

        {/* 4. Jornada de Leitura */}
        <JornadaRecomendada leitura={bussola.leitura} />

        {/* 5. Práticas filtradas */}
        <PraticasRelevantes praticas={bussola.praticasSugeridas} />

        {/* 6. Sua Voz (resumida) */}
        <SuaVozResumo voz={bussola.voz} welcomeName={bussola.welcomeName} />

        {/* 7. Alertas clínicos (só quando necessário) */}
        <AlertaOracular alertas={bussola.alertas} />
      </div>
    </AppLayout>
  );
}
