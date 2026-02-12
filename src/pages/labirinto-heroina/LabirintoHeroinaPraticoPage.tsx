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
import { CamposClinicosCard } from "./components/profissional/CamposClinicosCard";
import { GuiaTerapeutaTab } from "./components/profissional/GuiaTerapeutaTab";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type FlowStep = "modo" | "selecao" | "travessia" | "mapa";

export default function LabirintoHeroinaPraticoPage() {
  const { data: fases, isLoading } = useLabirintoFases();
  const [step, setStep] = useState<FlowStep>("modo");
  const [modo, setModo] = useState<LabirintoModo | null>(null);
  const [selectedPortaId, setSelectedPortaId] = useState<string | null>(null);
  const [portasAtravessadas, setPortasAtravessadas] = useState<string[]>([]);

  // Campos profissionais
  const [nomeCliente, setNomeCliente] = useState("");
  const [observacoesClinicas, setObservacoesClinicas] = useState("");
  const [hipoteseTerapeutica, setHipoteseTerapeutica] = useState("");

  const handleSelectModo = (selectedModo: LabirintoModo) => {
    setModo(selectedModo);
    setStep("selecao");
  };

  const handleSwitchModo = () => {
    setStep("modo");
    setModo(null);
    setSelectedPortaId(null);
    setPortasAtravessadas([]);
    setNomeCliente("");
    setObservacoesClinicas("");
    setHipoteseTerapeutica("");
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
    // Mark porta as crossed
    if (selectedPortaId && !portasAtravessadas.includes(selectedPortaId)) {
      setPortasAtravessadas(prev => [...prev, selectedPortaId]);
    }
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const handleOpenMapa = () => {
    setStep("mapa");
  };

  const handleBackFromMapa = () => {
    setStep("selecao");
  };

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
      {step !== "modo" && (
        <Card className="border-gold/20 bg-card/30">
          <CardContent className="py-4 space-y-3">
            {modo && <ModoIndicator modo={modo} onSwitch={handleSwitchModo} />}

            <div className="flex items-center justify-center gap-4 text-sm">
              <StepIndicator number={1} label="Escolher Carta" active={step === "selecao"} completed={step === "travessia" || step === "mapa"} />
              <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
              <StepIndicator number={2} label="Atravessar" active={step === "travessia"} completed={step === "mapa"} />
              <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
              <StepIndicator number={3} label="Mapa" active={step === "mapa"} completed={false} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* === STEP: Seleção de Modo === */}
      {step === "modo" && (
        <ModoSelector onSelect={handleSelectModo} />
      )}

      {/* === STEP: Seleção de Carta === */}
      {step === "selecao" && modo && (
        <div className="space-y-6">
          {/* Mapa button if has crossed portals */}
          {portasAtravessadas.length > 0 && (
            <Card
              className="border-gold/30 bg-gold/5 cursor-pointer hover:bg-gold/10 transition-colors"
              onClick={handleOpenMapa}
            >
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Mapa da Heroína</p>
                    <p className="text-xs text-muted-foreground">{portasAtravessadas.length} porta(s) atravessada(s)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gold" />
              </CardContent>
            </Card>
          )}

          {modo === "profissional" ? (
            <Tabs defaultValue="cartas" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="cartas" className="gap-2">
                  <Compass className="w-4 h-4" />
                  Cartas
                </TabsTrigger>
                <TabsTrigger value="guia" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Guia da Terapeuta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cartas" className="space-y-6">
                <CamposClinicosCard
                  nomeCliente={nomeCliente}
                  observacoesClinicas={observacoesClinicas}
                  hipoteseTerapeutica={hipoteseTerapeutica}
                  onChangeNomeCliente={setNomeCliente}
                  onChangeObservacoes={setObservacoesClinicas}
                  onChangeHipotese={setHipoteseTerapeutica}
                />
                <PortaSelecao portas={fases || []} onSelect={handleSelectPorta} />
              </TabsContent>

              <TabsContent value="guia">
                <GuiaTerapeutaTab />
              </TabsContent>
            </Tabs>
          ) : (
            <PortaSelecao portas={fases || []} onSelect={handleSelectPorta} />
          )}
        </div>
      )}

      {/* === STEP: Travessia === */}
      {step === "travessia" && selectedPorta && modo && (
        <div className="space-y-6">
          {modo === "profissional" && (
            <CamposClinicosCard
              nomeCliente={nomeCliente}
              observacoesClinicas={observacoesClinicas}
              hipoteseTerapeutica={hipoteseTerapeutica}
              onChangeNomeCliente={setNomeCliente}
              onChangeObservacoes={setObservacoesClinicas}
              onChangeHipotese={setHipoteseTerapeutica}
            />
          )}

          <PortaTravessia
            porta={selectedPorta}
            modo={modo}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </div>
      )}

      {/* === STEP: Mapa === */}
      {step === "mapa" && modo && (
        <div className="space-y-6">
          <button
            onClick={handleBackFromMapa}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            ← Voltar às cartas
          </button>

          <MapaHeroina
            modo={modo}
            fasesAtravessadas={fasesAtravessadasData}
            todasFases={fases || []}
            camposClinicos={modo === "profissional" ? {
              nomeCliente,
              observacoesClinicas,
              hipoteseTerapeutica,
            } : undefined}
          />
        </div>
      )}
    </FerramentaPageTemplate>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-gold' : completed ? 'text-gold/50' : 'text-muted-foreground/40'}`}>
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
        ${active ? 'bg-gold text-gold-foreground' : completed ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'}
      `}>
        {completed ? <Sparkles className="w-3 h-3" /> : number}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
