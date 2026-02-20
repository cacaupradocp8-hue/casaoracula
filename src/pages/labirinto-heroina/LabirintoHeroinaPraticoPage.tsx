// ============================================
// LABIRINTO DA HEROÍNA INTERNA® — VERSÃO PRÁTICA
// Arquitetura Dual-Mode: Pessoal + Profissional
// ============================================

import { useState } from "react";
import { Compass, ArrowRight, Sparkles, BookOpen, Map } from "lucide-react";
import { FerramentaPageTemplate } from "@/components/shared/FerramentaPageTemplate";
import { useLabirintoFases } from "@/hooks/useLabirintoHeroina";
import { ModoSelector, type LabirintoModo } from "./components/ModoSelector";
import { ModoIndicator } from "./components/ModoIndicator";
import { PortaSelecao } from "./components/pratico/PortaSelecao";
import { PortaTravessia } from "./components/pratico/PortaTravessia";
import { MapaHeroina } from "./components/pratico/MapaHeroina";
import { CamposClinicosCard, type CamposClinicosData } from "./components/profissional/CamposClinicosCard";
import { GuiaTerapeutaTab } from "./components/profissional/GuiaTerapeutaTab";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FlowStep = "modo" | "selecao" | "travessia" | "mapa";

const INITIAL_CAMPOS: CamposClinicosData = {
  nomeCliente: "",
  observacoesClinicas: "",
  hipoteseTerapeutica: "",
  emocaoDominante: "",
  padraoDefensivo: "",
  direcionamentoTerapeutico: "",
  microAcaoDefinida: "",
};

export default function LabirintoHeroinaPraticoPage() {
  const { data: fases, isLoading } = useLabirintoFases();
  const [step, setStep] = useState<FlowStep>("modo");
  const [modo, setModo] = useState<LabirintoModo | null>(null);
  const [selectedPortaId, setSelectedPortaId] = useState<string | null>(null);
  const [portasAtravessadas, setPortasAtravessadas] = useState<string[]>([]);
  const [camposClinicos, setCamposClinicos] = useState<CamposClinicosData>(INITIAL_CAMPOS);

  const handleChangeCampo = (field: keyof CamposClinicosData, value: string) => {
    setCamposClinicos(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectModo = (selectedModo: LabirintoModo) => {
    setModo(selectedModo);
    setStep("selecao");
  };

  const handleSwitchModo = () => {
    setStep("modo");
    setModo(null);
    setSelectedPortaId(null);
    setPortasAtravessadas([]);
    setCamposClinicos(INITIAL_CAMPOS);
  };

  const handleSelectPorta = (portaId: string) => {
    setSelectedPortaId(portaId);
    setStep("travessia");
  };

  const handleBack = () => {
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const handleComplete = () => {
    if (selectedPortaId && !portasAtravessadas.includes(selectedPortaId)) {
      setPortasAtravessadas(prev => [...prev, selectedPortaId]);
    }
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const handleOpenMapa = () => setStep("mapa");
  const handleBackFromMapa = () => setStep("selecao");

  const selectedPorta = fases?.find(f => f.id === selectedPortaId);
  const fasesAtravessadasData = (fases || []).filter(f => portasAtravessadas.includes(f.id));

  const templateProps = {
    title: "O Labirinto da Heroína Interna®",
    subtitle: "Aplicação prática do livro A Jornada da Heroína",
    icon: <Compass className="w-5 h-5" />,
    categoriaBadge: "metodo_oracula" as const,
    backHref: "/ferramentas-metodo",
    backLabel: "Voltar às Ferramentas do Método",
    textoQuandoUsar: "Use quando precisar aplicar na prática os ensinamentos do livro A Jornada da Heroína e do Caderno da Heroína.",
    textoOQueSustenta: "Esta ferramenta sustenta a aplicação concreta dos exercícios e reflexões do método, transformando teoria em experiência vivida.",
    textoComoAtravessar: "Escolha seu modo (Pessoal ou Profissional), selecione uma carta da jornada, leia o texto oracular, realize o exercício proposto e registre sua experiência.",
    toolName: "Labirinto da Heroína Interna",
  };

  if (isLoading) {
    return (
      <FerramentaPageTemplate {...templateProps}>
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </FerramentaPageTemplate>
    );
  }

  return (
    <FerramentaPageTemplate {...templateProps}>
      {/* Step Indicator */}
      <AnimatePresence mode="wait">
        {step !== "modo" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-gold/20 bg-gradient-to-r from-card/60 via-card/40 to-card/60 backdrop-blur-sm relative overflow-hidden">
              {/* Subtle shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-pulse pointer-events-none" />
              <CardContent className="py-5 space-y-3 relative">
                {modo && <ModoIndicator modo={modo} onSwitch={handleSwitchModo} />}
                <div className="flex items-center justify-center gap-4 text-sm">
                  <StepIndicator number={1} label="Escolher Carta" active={step === "selecao"} completed={step === "travessia" || step === "mapa"} />
                  <ArrowRight className="w-4 h-4 text-gold/20" />
                  <StepIndicator number={2} label="Atravessar" active={step === "travessia"} completed={step === "mapa"} />
                  <ArrowRight className="w-4 h-4 text-gold/20" />
                  <StepIndicator number={3} label="Mapa" active={step === "mapa"} completed={false} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === STEP: Seleção de Modo === */}
      <AnimatePresence mode="wait">
        {step === "modo" && (
          <motion.div
            key="modo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <ModoSelector onSelect={handleSelectModo} />
          </motion.div>
        )}

        {/* === STEP: Seleção de Carta === */}
        {step === "selecao" && modo && (
          <motion.div
            key="selecao"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {portasAtravessadas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-gold/30 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 cursor-pointer hover:shadow-lg hover:shadow-gold/10 transition-all duration-300" onClick={handleOpenMapa}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                        <Map className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Mapa da Heroína</p>
                        <p className="text-xs text-muted-foreground">{portasAtravessadas.length} porta(s) atravessada(s)</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {modo === "profissional" ? (
              <Tabs defaultValue="cartas" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-card/50 border border-gold/10">
                  <TabsTrigger value="cartas" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                    <Compass className="w-4 h-4" />
                    Cartas
                  </TabsTrigger>
                  <TabsTrigger value="guia" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                    <BookOpen className="w-4 h-4" />
                    Guia da Terapeuta
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cartas" className="space-y-6">
                  <CamposClinicosCard campos={camposClinicos} onChange={handleChangeCampo} />
                  <PortaSelecao portas={fases || []} onSelect={handleSelectPorta} />
                </TabsContent>
                <TabsContent value="guia">
                  <GuiaTerapeutaTab />
                </TabsContent>
              </Tabs>
            ) : (
              <PortaSelecao portas={fases || []} onSelect={handleSelectPorta} />
            )}
          </motion.div>
        )}

        {/* === STEP: Travessia === */}
        {step === "travessia" && selectedPorta && modo && (
          <motion.div
            key="travessia"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <PortaTravessia
              porta={selectedPorta}
              modo={modo}
              camposClinicos={modo === "profissional" ? camposClinicos : undefined}
              onBack={handleBack}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {/* === STEP: Mapa === */}
        {step === "mapa" && modo && (
          <motion.div
            key="mapa"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <button onClick={handleBackFromMapa} className="text-sm text-muted-foreground hover:text-gold flex items-center gap-1 transition-colors">
              ← Voltar às cartas
            </button>
            <MapaHeroina
              modo={modo}
              fasesAtravessadas={fasesAtravessadasData}
              todasFases={fases || []}
              camposClinicos={modo === "profissional" ? {
                nomeCliente: camposClinicos.nomeCliente,
                observacoesClinicas: camposClinicos.observacoesClinicas,
                hipoteseTerapeutica: camposClinicos.hipoteseTerapeutica,
                crencaCentral: "",
                emocaoDominante: camposClinicos.emocaoDominante,
                padraoDefensivo: camposClinicos.padraoDefensivo,
                direcionamento: camposClinicos.direcionamentoTerapeutico,
              } : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </FerramentaPageTemplate>
  );
}

function StepIndicator({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
  return (
    <div className={`flex items-center gap-2 transition-colors duration-300 ${active ? 'text-gold' : completed ? 'text-gold/50' : 'text-muted-foreground/40'}`}>
      <div className={`relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
        active 
          ? 'bg-gold text-gold-foreground shadow-md shadow-gold/30' 
          : completed 
            ? 'bg-gold/20 text-gold' 
            : 'bg-muted text-muted-foreground'
      }`}>
        {completed ? <Sparkles className="w-3.5 h-3.5" /> : number}
        {active && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-gold"
          />
        )}
      </div>
      <span className="hidden sm:inline text-xs tracking-wide">{label}</span>
    </div>
  );
}
