// ============================================
// LABIRINTO DA HEROÍNA INTERNA® — VERSÃO PRÁTICA
// Arquitetura Dual-Mode: Pessoal + Profissional
// ============================================

import { useState } from "react";
import { Compass, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { FerramentaPageTemplate } from "@/components/shared/FerramentaPageTemplate";
import { useLabirintoFases } from "@/hooks/useLabirintoHeroina";
import { ModoSelector, type LabirintoModo } from "./components/ModoSelector";
import { ModoIndicator } from "./components/ModoIndicator";
import { PortaSelecao } from "./components/pratico/PortaSelecao";
import { PortaTravessia } from "./components/pratico/PortaTravessia";
import { CamposClinicosCard } from "./components/profissional/CamposClinicosCard";
import { GuiaTerapeutaTab } from "./components/profissional/GuiaTerapeutaTab";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Steps do fluxo
type FlowStep = "modo" | "selecao" | "travessia";

export default function LabirintoHeroinaPraticoPage() {
  const { data: fases, isLoading } = useLabirintoFases();
  const [step, setStep] = useState<FlowStep>("modo");
  const [modo, setModo] = useState<LabirintoModo | null>(null);
  const [selectedPortaId, setSelectedPortaId] = useState<string | null>(null);

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
    // Reset campos profissionais
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
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const selectedPorta = fases?.find(f => f.id === selectedPortaId);

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
            {/* Modo Indicator */}
            {modo && <ModoIndicator modo={modo} onSwitch={handleSwitchModo} />}

            {/* Steps */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <StepIndicator
                number={1}
                label="Escolher Carta"
                active={step === "selecao"}
                completed={step === "travessia"}
              />
              <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
              <StepIndicator
                number={2}
                label="Atravessar"
                active={step === "travessia"}
                completed={false}
              />
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
          {/* Modo Profissional: Tabs com Guia */}
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
                {/* Campos Clínicos */}
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
            /* Modo Pessoal: Direto para cartas */
            <PortaSelecao portas={fases || []} onSelect={handleSelectPorta} />
          )}
        </div>
      )}

      {/* === STEP: Travessia === */}
      {step === "travessia" && selectedPorta && (
        <div className="space-y-6">
          {/* Campos Clínicos no modo profissional (acessíveis durante travessia) */}
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
            modo={modo!}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </div>
      )}
    </FerramentaPageTemplate>
  );
}

// Componente auxiliar para indicador de passo
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
