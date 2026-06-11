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
      <ResponsiveContainer size="wide" className="py-6 md:py-10 pb-32">
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
          <div className="space-y-12 md:space-y-24">
            <div className="text-center space-y-4 md:space-y-8 pt-4 md:pt-16 max-w-4xl mx-auto px-4">
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1]"
               >
                 Sua <span className="text-gold italic">CidadELA</span> está viva
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/50 font-serif italic max-w-2xl mx-auto"
               >
                 Este é o centro da sua travessia. Aqui a Casa reúne os rastros que você deixou nas rotas, nos Jardins e nas ferramentas.
               </motion.p>
            </div>

            <div className="w-full overflow-hidden">
              <CidadelaRotasView bussola={bussola} />
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8 md:pt-20 pb-16">
              <div className="space-y-6 md:space-y-10">
                <h3 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold/60 font-bold px-1">Próximo passo recomendado</h3>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 bg-white/[0.02] space-y-6 md:space-y-10 group hover:border-gold/30 transition-all duration-700"
                >
                   <div className="space-y-3 md:space-y-5">
                     <h4 className="text-2xl md:text-4xl font-serif text-white group-hover:text-gold transition-colors">Rota dos Lobos</h4>
                     <p className="text-base md:text-xl text-white/50 italic font-serif leading-relaxed">O retorno da mulher que sabe. Sua cartografia revelou este caminho.</p>
                   </div>
                   <Button 
                     variant="gold" 
                     size="xl" 
                     className="w-full h-14 md:h-20 shadow-premium-glow rounded-full text-base md:text-lg group-hover:scale-[1.02] transition-transform"
                     onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                   >
                     Continuar Travessia
                     <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                   </Button>
                </motion.div>
              </div>

              <div className="space-y-6 md:space-y-10">
                <h3 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold/60 font-bold px-1">Rastros nos Jardins</h3>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                   <motion.button 
                     whileHover={{ x: 5 }}
                     onClick={() => navigate('/jardim-da-psique')}
                     className="p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-left transition-all flex flex-col gap-2"
                   >
                     <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-gold/50 font-semibold">Jardim da Psique</p>
                     <p className="text-white/70 text-sm md:text-lg italic font-serif">Ver últimos registros do inconsciente...</p>
                   </motion.button>
                   <motion.button 
                     whileHover={{ x: 5 }}
                     onClick={() => navigate('/casa-das-maquinas/jardim-oficio')}
                     className="p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/5 text-left transition-all flex flex-col gap-2"
                   >
                     <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-gold/50 font-semibold">Jardim do Ofício</p>
                     <p className="text-white/70 text-sm md:text-lg italic font-serif">Ver últimos rastros da prática profissional...</p>
                   </motion.button>
                </div>
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
