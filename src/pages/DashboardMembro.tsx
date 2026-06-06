import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBussolaOracular } from "@/hooks/useBussolaOracular";
import { useJourneyGuard } from "@/hooks/useJourneyGuard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon } from "lucide-react";
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
import { CidadelaRotasView } from "@/components/cidadela/CidadelaRotasView";
import { motion, AnimatePresence } from "framer-motion";
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

        {/* 1. SE TEM CARTOGRAFIA: REVELAÇÃO COMPLETA (VERSÃO ROTAS) */}
        {bussola.temCartografia ? (
          <div className="space-y-12">
            <CidadelaRotasView bussola={bussola} />
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-2xl font-display text-center">Sua Travessia: Rota dos Lobos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Reutilizando lógica de progresso simples ou botão de continuar */}
                 <Button 
                   variant="gold" 
                   size="lg" 
                   className="w-full h-16 shadow-premium-glow"
                   onClick={() => navigate('/clube/rotas/lobos')}
                 >
                   Continuar Travessia
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-4xl font-display text-foreground">
                Sua CidadELA ainda não foi revelada
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Antes de atravessar a Casa, revele o mapa simbólico do modo como você habita este momento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                className="gap-2 px-12 h-16 text-lg shadow-premium-glow"
              >
                Revelar minha CidadELA
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <div className="pt-12">
              <button 
                onClick={() => navigate('/clube/rotas')}
                className="text-xs text-muted-foreground/40 hover:text-gold/60 underline underline-offset-4 transition-colors"
              >
                Explorar Rotas da Casa
              </button>
            </div>
          </div>
        )}

      </ResponsiveContainer>
    </AppLayout>
  );
}
