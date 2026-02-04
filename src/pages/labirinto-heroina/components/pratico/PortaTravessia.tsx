// ============================================
// TRAVESSIA DA PORTA — LABIRINTO PRÁTICO
// Fluxo linear: Texto Oracular → Exercício → Registro → PDF
// ============================================

import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2canvas from "html2canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Scroll, 
  Sparkles, 
  PenLine, 
  FileDown, 
  Loader2,
  Check,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

interface PortaTravessiaProps {
  porta: LabirintoFase;
  onBack: () => void;
  onComplete: () => void;
}

// Exercícios fixos por fase (baseados no Caderno da Heroína)
// TODO: Migrar para banco de dados quando conteúdo estiver disponível
const EXERCICIOS_POR_FASE: Record<string, { titulo: string; instrucao: string }> = {
  "O Chamado Silenciado": {
    titulo: "Exercício: Ouvir o Chamado",
    instrucao: "Sente-se em silêncio por 5 minutos. Depois, escreva: O que em mim pede atenção e ainda não foi nomeado? Que sussurro tenho ignorado?"
  },
  "A Descida": {
    titulo: "Exercício: O Primeiro Passo Para Dentro",
    instrucao: "Desenhe ou descreva simbolicamente o que você está deixando para trás ao entrar nesta jornada. O que o mundo externo não pode lhe dar?"
  },
  "A Fragmentação": {
    titulo: "Exercício: Nomear os Pedaços",
    instrucao: "Liste 3 certezas que estão se desfazendo. Para cada uma, escreva: O que eu acreditava ser verdade? O que está se revelando?"
  },
  "A Morte Simbólica": {
    titulo: "Exercício: Ritual de Entrega",
    instrucao: "Escreva uma carta de despedida para uma versão de si mesma que precisa morrer. O que você agradece? O que você libera?"
  },
  "A Travessia": {
    titulo: "Exercício: O Passo Sem Garantias",
    instrucao: "Feche os olhos e pergunte: Qual é o próximo passo que não depende de certeza? Escreva sua resposta sem julgamento."
  },
  "A Reintegração": {
    titulo: "Exercício: Reunir os Fragmentos",
    instrucao: "Descreva 3 qualidades ou partes de si que você está recuperando. O que foi perdido e está retornando transformado?"
  },
  "O Retorno": {
    titulo: "Exercício: A Nova Mulher no Mundo",
    instrucao: "Escreva um compromisso consigo mesma: Como você vai viver de forma diferente a partir de agora? O que você traz de volta?"
  },
};

export function PortaTravessia({ porta, onBack, onComplete }: PortaTravessiaProps) {
  const [registroAcao, setRegistroAcao] = useState("");
  const [registroPercepcao, setRegistroPercepcao] = useState("");
  const [exercicioRealizado, setExercicioRealizado] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const exercicio = EXERCICIOS_POR_FASE[porta.nome] || {
    titulo: "Exercício de Reflexão",
    instrucao: "Sente-se em silêncio e reflita: O que esta fase da jornada está pedindo de mim? Escreva sua resposta."
  };

  const handleMarcarRealizado = () => {
    setExercicioRealizado(true);
    toast.success("Exercício registrado ✓", { icon: "✨" });
  };

  const handleGeneratePDF = async () => {
    if (!pdfRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `travessia-${porta.nome.toLowerCase().replace(/\s/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("PDF ritual gerado com sucesso!", { icon: "📜" });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const dataTravessia = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const canGeneratePDF = exercicioRealizado && (registroAcao.trim() || registroPercepcao.trim());

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Escolher outra carta
      </Button>

      {/* Card da Carta Selecionada */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-4">{porta.icone || "🌙"}</div>
          <h2 className="font-display text-2xl text-gold mb-2">{porta.nome}</h2>
          {porta.subtitulo && (
            <p className="text-muted-foreground italic">{porta.subtitulo}</p>
          )}
        </CardContent>
      </Card>

      {/* 1. Texto Oracular */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scroll className="w-5 h-5 text-gold" />
            Texto Oracular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed italic">
            {porta.descricao || "Cada porta guarda um ensinamento. Atravesse com presença."}
          </p>
        </CardContent>
      </Card>

      {/* 2. Exercício Prático */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {exercicio.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/80 leading-relaxed">
            {exercicio.instrucao}
          </p>
          
          {!exercicioRealizado ? (
            <Button 
              onClick={handleMarcarRealizado}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              Marcar exercício como realizado
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-500">
              <Check className="w-5 h-5" />
              <span className="font-medium">Exercício realizado</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Registro da Ação */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenLine className="w-5 h-5 text-gold" />
            Registro da Travessia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              O que você fez?
            </label>
            <Textarea
              value={registroAcao}
              onChange={(e) => setRegistroAcao(e.target.value)}
              placeholder="Descreva brevemente a ação que realizou..."
              rows={3}
              className="bg-card/50"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              O que percebeu?
            </label>
            <Textarea
              value={registroPercepcao}
              onChange={(e) => setRegistroPercepcao(e.target.value)}
              placeholder="Que sensações, imagens ou insights surgiram?"
              rows={3}
              className="bg-card/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Gerar PDF */}
      <Card className="border-gold/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <h4 className="font-medium text-foreground">Selar esta Travessia</h4>
              <p className="text-sm text-muted-foreground">
                Gere um PDF ritual com seu registro desta porta
              </p>
            </div>
            <Button
              onClick={handleGeneratePDF}
              disabled={!canGeneratePDF || isGeneratingPDF}
              className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2 min-w-[180px]"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Gerar PDF Ritual
                </>
              )}
            </Button>
          </div>
          
          {!canGeneratePDF && (
            <p className="text-xs text-muted-foreground/60 mt-3 text-center">
              Realize o exercício e preencha ao menos um campo de registro para gerar o PDF.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Nova Travessia */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={onComplete}
          className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Iniciar nova travessia
        </Button>
      </div>

      {/* PDF Hidden Content (para geração) */}
      <div className="fixed -left-[9999px]" aria-hidden="true">
        <div 
          ref={pdfRef}
          className="w-[600px] p-8"
          style={{
            background: `linear-gradient(135deg, #1a1510 0%, #252018 50%, #1a1510 100%)`,
            color: "#d4a574",
            fontFamily: "Georgia, serif",
          }}
        >
          {/* Header */}
          <div className="text-center pb-6 border-b border-amber-800/30">
            <p className="text-xs uppercase tracking-widest mb-2 opacity-70">
              ✧ Labirinto da Heroína Interna® ✧
            </p>
            <div className="text-5xl mb-4">{porta.icone || "🌙"}</div>
            <h1 className="text-2xl mb-1">{porta.nome}</h1>
            {porta.subtitulo && (
              <p className="text-sm opacity-70 italic">{porta.subtitulo}</p>
            )}
            <p className="text-xs mt-4 opacity-50">{dataTravessia}</p>
          </div>

          {/* Texto Oracular */}
          <div className="py-6 border-b border-amber-800/20">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">
              Texto Oracular
            </h4>
            <p className="text-sm leading-relaxed italic opacity-90">
              {porta.descricao || "Cada porta guarda um ensinamento."}
            </p>
          </div>

          {/* Exercício */}
          <div className="py-6 border-b border-amber-800/20">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">
              {exercicio.titulo}
            </h4>
            <p className="text-sm leading-relaxed opacity-80">
              {exercicio.instrucao}
            </p>
          </div>

          {/* Registro */}
          <div className="py-6">
            <h4 className="text-xs uppercase tracking-wider mb-4 opacity-60">
              Meu Registro
            </h4>
            {registroAcao && (
              <div className="mb-4">
                <p className="text-xs opacity-50 mb-1">O que fiz:</p>
                <p className="text-sm leading-relaxed opacity-90">{registroAcao}</p>
              </div>
            )}
            {registroPercepcao && (
              <div>
                <p className="text-xs opacity-50 mb-1">O que percebi:</p>
                <p className="text-sm leading-relaxed opacity-90">{registroPercepcao}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-amber-800/20">
            <p className="text-xs opacity-40">
              Casa ORÁCULA — Método Terapêutico Integrativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
