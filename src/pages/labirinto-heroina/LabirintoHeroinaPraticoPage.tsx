// ============================================
// LABIRINTO DA HEROÍNA INTERNA® — VERSÃO PRÁTICA
// Fluxo Linear: Carta → Texto Oracular → Exercício → Registro → PDF
// ============================================

import { useState } from "react";
import { Compass, ArrowRight, Sparkles } from "lucide-react";
import { FerramentaPageTemplate } from "@/components/shared/FerramentaPageTemplate";
import { useLabirintoFases } from "@/hooks/useLabirintoHeroina";
import { PortaSelecao } from "./components/pratico/PortaSelecao";
import { PortaTravessia } from "./components/pratico/PortaTravessia";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Steps do fluxo
type FlowStep = "selecao" | "travessia";

export default function LabirintoHeroinaPraticoPage() {
  const { data: fases, isLoading } = useLabirintoFases();
  const [step, setStep] = useState<FlowStep>("selecao");
  const [selectedPortaId, setSelectedPortaId] = useState<string | null>(null);

  const handleSelectPorta = (portaId: string) => {
    setSelectedPortaId(portaId);
    setStep("travessia");
  };

  const handleBack = () => {
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const handleComplete = () => {
    // Reset para nova travessia
    setStep("selecao");
    setSelectedPortaId(null);
  };

  const selectedPorta = fases?.find(f => f.id === selectedPortaId);

  if (isLoading) {
    return (
      <FerramentaPageTemplate
        title="O Labirinto da Heroína Interna®"
        subtitle="Aplicação prática do livro A Jornada da Heroína"
        icon={<Compass className="w-5 h-5" />}
        categoriaBadge="metodo_oracula"
        backHref="/ferramentas-metodo"
        backLabel="Voltar às Ferramentas do Método"
        textoQuandoUsar="Use quando precisar aplicar na prática os ensinamentos do livro A Jornada da Heroína e do Caderno da Heroína."
        textoOQueSustenta="Esta ferramenta sustenta a aplicação concreta dos exercícios e reflexões do método, transformando teoria em experiência vivida."
        textoComoAtravessar="Escolha uma carta (porta da jornada), leia o texto oracular, realize o exercício proposto e registre sua experiência. Ao final, você poderá gerar um PDF ritual de sua travessia."
        toolName="Labirinto da Heroína Interna"
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </FerramentaPageTemplate>
    );
  }

  return (
    <FerramentaPageTemplate
      title="O Labirinto da Heroína Interna®"
      subtitle="Aplicação prática do livro A Jornada da Heroína"
      icon={<Compass className="w-5 h-5" />}
      categoriaBadge="metodo_oracula"
      backHref="/ferramentas-metodo"
      backLabel="Voltar às Ferramentas do Método"
      textoQuandoUsar="Use quando precisar aplicar na prática os ensinamentos do livro A Jornada da Heroína e do Caderno da Heroína."
      textoOQueSustenta="Esta ferramenta sustenta a aplicação concreta dos exercícios e reflexões do método, transformando teoria em experiência vivida."
      textoComoAtravessar="Escolha uma carta (porta da jornada), leia o texto oracular, realize o exercício proposto e registre sua experiência. Ao final, você poderá gerar um PDF ritual de sua travessia."
      toolName="Labirinto da Heroína Interna"
    >
      {/* Indicador de Passo */}
      <Card className="border-gold/20 bg-card/30">
        <CardContent className="py-4">
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

      {/* Conteúdo do Fluxo */}
      {step === "selecao" && (
        <PortaSelecao 
          portas={fases || []} 
          onSelect={handleSelectPorta} 
        />
      )}

      {step === "travessia" && selectedPorta && (
        <PortaTravessia 
          porta={selectedPorta} 
          onBack={handleBack}
          onComplete={handleComplete}
        />
      )}
    </FerramentaPageTemplate>
  );
}

// Componente auxiliar para indicador de passo
function StepIndicator({ 
  number, 
  label, 
  active, 
  completed 
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
