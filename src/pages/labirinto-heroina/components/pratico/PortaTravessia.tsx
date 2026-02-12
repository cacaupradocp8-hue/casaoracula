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
  PenLine, 
  FileDown, 
  Loader2,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";
import type { LabirintoModo } from "../ModoSelector";
import { ExercicioCaderno } from "./ExercicioCaderno";

interface PortaTravessiaProps {
  porta: LabirintoFase;
  modo: LabirintoModo;
  onBack: () => void;
  onComplete: () => void;
}

// Exercícios agora vivem em ExercicioCaderno.tsx

export function PortaTravessia({ porta, modo, onBack, onComplete }: PortaTravessiaProps) {
  const [registroAcao, setRegistroAcao] = useState("");
  const [registroPercepcao, setRegistroPercepcao] = useState("");
  const [exercicioRealizado, setExercicioRealizado] = useState(false);
  const [respostasExercicio, setRespostasExercicio] = useState<Record<string, string>>({});
  const [camposClinicos, setCamposClinicos] = useState({
    crencaCentral: "",
    emocaoDominante: "",
    padraoDefensivo: "",
    direcionamento: "",
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleChangeResposta = (key: string, value: string) => {
    setRespostasExercicio(prev => ({ ...prev, [key]: value }));
  };

  const handleChangeCampoClinico = (key: string, value: string) => {
    setCamposClinicos(prev => ({ ...prev, [key]: value }));
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

      {/* 2. Exercício do Caderno */}
      <ExercicioCaderno
        faseName={porta.nome}
        modo={modo}
        respostas={respostasExercicio}
        onChangeResposta={handleChangeResposta}
        camposClinicos={camposClinicos}
        onChangeCampoClinico={handleChangeCampoClinico}
        exercicioRealizado={exercicioRealizado}
        onMarcarRealizado={handleMarcarRealizado}
      />

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

          {/* Respostas do Exercício */}
          <div className="py-6 border-b border-amber-800/20">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">
              Exercício do Caderno
            </h4>
            {Object.entries(respostasExercicio).filter(([, v]) => v.trim()).map(([key, value]) => (
              <div key={key} className="mb-2">
                <p className="text-sm leading-relaxed opacity-90">{value}</p>
              </div>
            ))}
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
