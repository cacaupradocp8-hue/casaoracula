// ============================================
// MAPA PDF GENERATOR - GRIMÓRIO CERIMONIAL
// ============================================
// Generates a ceremonial PDF/image of the Heroína journey
// with parchment-style design and ritual elements

import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileDown, Mail, Scroll, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { MapaHeroinaData } from "@/hooks/useMapaHeroina";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface MapaPDFGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapa: MapaHeroinaData;
  insights: string;
}

// Frases de encerramento rituais
const FRASES_ENCERRAMENTO = [
  "Que esta travessia continue a ecoar em seu despertar.",
  "O labirinto se fecha, mas suas revelações permanecem.",
  "Você entrou buscando — sai portando.",
  "A heroína que entra não é a mesma que atravessa.",
  "Cada espiral guarda um fragmento de quem você está se tornando.",
  "O caminho se fez caminhando, a mulher se fez atravessando.",
];

export function MapaPDFGenerator({
  open,
  onOpenChange,
  mapa,
  insights,
}: MapaPDFGeneratorProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [anotacoesPessoais, setAnotacoesPessoais] = useState(insights);
  const contentRef = useRef<HTMLDivElement>(null);

  // Random closing phrase
  const fraseEncerramento = FRASES_ENCERRAMENTO[
    Math.floor(Math.random() * FRASES_ENCERRAMENTO.length)
  ];

  const nomeHeroina = user?.name || "Heroína";
  const dataTravessia = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const handleGeneratePDF = async () => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `travessia-heroina-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("A Travessia foi selada. Deseja abrir um novo ciclo?", {
        duration: 5000,
        icon: "✨",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao selar a Travessia. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = () => {
    toast.info("Funcionalidade de envio por e-mail em desenvolvimento", {
      icon: "📧",
    });
  };

  const formatData = (data: string | null | undefined) => {
    if (!data) return "—";
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "—";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto bg-stone-950 border-gold/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-gold flex items-center gap-2">
            <Scroll className="w-5 h-5" />
            Encerramento Cerimonial da Travessia
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Seu grimório pessoal será selado com as revelações desta jornada
          </DialogDescription>
        </DialogHeader>

        {/* Anotações Pessoais Input */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-gold/80 font-medium">
            Anotações Pessoais da Travessia
          </label>
          <Textarea
            value={anotacoesPessoais}
            onChange={(e) => setAnotacoesPessoais(e.target.value)}
            placeholder="O que esta travessia revelou? Que imagens, sonhos ou intuições emergiram?"
            className="min-h-[80px] bg-stone-900/50 border-gold/20 focus:border-gold/40 text-foreground"
          />
        </div>

        {/* PDF Preview - Grimório Style */}
        <div 
          ref={contentRef}
          className="relative rounded-lg overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(139, 115, 85, 0.15) 0%, transparent 70%),
              linear-gradient(135deg, 
                #1a1510 0%, 
                #252018 25%, 
                #1f1a14 50%, 
                #252018 75%, 
                #1a1510 100%
              )
            `,
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
          }}
        >
          {/* Textured Overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative p-8 md:p-10 space-y-6">
            
            {/* Header with Seal */}
            <div className="text-center space-y-4 pb-6 border-b border-amber-800/30">
              {/* Mandala Seal */}
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-900/40 to-amber-950/60 border-2 border-amber-700/50 flex items-center justify-center shadow-lg shadow-amber-900/20">
                  <span className="text-5xl">🌕</span>
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-500/60" />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-600/70">
                  ✧ Grimório da Travessia ✧
                </p>
                <h1 
                  className="font-display text-3xl md:text-4xl"
                  style={{ 
                    color: "#d4a574",
                    textShadow: "0 2px 10px rgba(212, 165, 116, 0.3)",
                  }}
                >
                  Mapa Pessoal da Heroína®
                </h1>
              </div>

              {/* Heroína Name & Date */}
              <div className="pt-4 space-y-1">
                <p className="text-amber-500/90 font-display text-xl">
                  {nomeHeroina}
                </p>
                <p className="text-amber-700/70 text-sm">
                  Travessia selada em {dataTravessia}
                </p>
              </div>
            </div>

            {/* Four Realms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Reino das Marés - Fase */}
              <div 
                className="rounded-lg p-5 border"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 58, 95, 0.3) 0%, rgba(20, 40, 65, 0.4) 100%)",
                  borderColor: "rgba(100, 150, 200, 0.25)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mapa.faseAtiva?.fase?.icone || "🌙"}</span>
                  <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-wider text-blue-400/70 mb-1">
                      Reino das Marés — Fase da Jornada
                    </h4>
                    <p className="font-display text-lg text-blue-200/90">
                      {mapa.faseAtiva?.fase?.nome || "Não registrada"}
                    </p>
                    <p className="text-xs text-blue-400/50 mt-1">
                      {formatData(mapa.faseAtiva?.registrado_em)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reino das Figuras - Arquétipo */}
              <div 
                className="rounded-lg p-5 border"
                style={{
                  background: "linear-gradient(135deg, rgba(75, 35, 95, 0.3) 0%, rgba(50, 25, 70, 0.4) 100%)",
                  borderColor: "rgba(150, 100, 180, 0.25)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mapa.ultimoArquetipo?.arquetipo?.icone || "✨"}</span>
                  <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-wider text-purple-400/70 mb-1">
                      Reino das Figuras — Arquétipo em Trânsito
                    </h4>
                    <p className="font-display text-lg text-purple-200/90">
                      {mapa.ultimoArquetipo?.arquetipo?.nome || "Não registrado"}
                    </p>
                    {mapa.ultimoArquetipo?.polaridade_percebida && (
                      <p className="text-xs text-purple-300/60 mt-1 italic">
                        "{mapa.ultimoArquetipo.polaridade_percebida}"
                      </p>
                    )}
                    <p className="text-xs text-purple-400/50 mt-1">
                      {formatData(mapa.ultimoArquetipo?.registrado_em)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reino dos Cenários - Metáfora */}
              <div 
                className="rounded-lg p-5 border"
                style={{
                  background: "linear-gradient(135deg, rgba(25, 70, 55, 0.3) 0%, rgba(18, 50, 40, 0.4) 100%)",
                  borderColor: "rgba(80, 160, 120, 0.25)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mapa.ultimoCenario?.metafora?.icone || "🪶"}</span>
                  <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-wider text-emerald-400/70 mb-1">
                      Reino dos Cenários — Metáfora Revelada
                    </h4>
                    <p className="font-display text-lg text-emerald-200/90">
                      {mapa.ultimoCenario?.metafora?.nome || "Não registrado"}
                    </p>
                    {mapa.ultimoCenario?.anotacao_livre && (
                      <p className="text-xs text-emerald-300/60 mt-1 italic line-clamp-2">
                        "{mapa.ultimoCenario.anotacao_livre}"
                      </p>
                    )}
                    <p className="text-xs text-emerald-400/50 mt-1">
                      {formatData(mapa.ultimoCenario?.registrado_em)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reino dos Gestos - Ritual */}
              <div 
                className="rounded-lg p-5 border"
                style={{
                  background: "linear-gradient(135deg, rgba(95, 55, 25, 0.3) 0%, rgba(70, 40, 18, 0.4) 100%)",
                  borderColor: "rgba(200, 140, 80, 0.25)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mapa.ultimoRitual?.ritual?.icone || "🔥"}</span>
                  <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-wider text-amber-400/70 mb-1">
                      Reino dos Gestos — Ritual Escolhido
                    </h4>
                    <p className="font-display text-lg text-amber-200/90">
                      {mapa.ultimoRitual?.ritual?.nome || "Não registrado"}
                    </p>
                    <p className="text-xs text-amber-300/70 mt-1">
                      {mapa.ultimoRitual?.completado_em ? "✓ Realizado" : "○ Em curso"}
                    </p>
                    {mapa.ultimoRitual?.reflexao && (
                      <p className="text-xs text-amber-300/60 mt-1 italic line-clamp-2">
                        "{mapa.ultimoRitual.reflexao}"
                      </p>
                    )}
                    <p className="text-xs text-amber-400/50 mt-1">
                      {formatData(mapa.ultimoRitual?.completado_em)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anotações Pessoais */}
            {anotacoesPessoais && (
              <div 
                className="rounded-lg p-5 mt-4"
                style={{
                  background: "rgba(212, 165, 116, 0.08)",
                  border: "1px solid rgba(212, 165, 116, 0.2)",
                }}
              >
                <h4 className="text-xs uppercase tracking-wider text-amber-500/70 mb-3 flex items-center gap-2">
                  <Scroll className="w-3 h-3" />
                  Anotações da Tecelã
                </h4>
                <p 
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "rgba(212, 190, 160, 0.9)" }}
                >
                  {anotacoesPessoais}
                </p>
              </div>
            )}

            {/* Statistics Bar */}
            <div 
              className="flex justify-center gap-8 py-4 mt-4 rounded-lg"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(212, 165, 116, 0.15)",
              }}
            >
              <div className="text-center">
                <p className="text-xl font-display text-amber-500">{mapa.totalFases}</p>
                <p className="text-[10px] uppercase tracking-wider text-amber-700/60">Fases</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display text-amber-500">{mapa.totalArquetipos}</p>
                <p className="text-[10px] uppercase tracking-wider text-amber-700/60">Arquétipos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display text-amber-500">{mapa.totalCenarios}</p>
                <p className="text-[10px] uppercase tracking-wider text-amber-700/60">Cenários</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display text-amber-500">{mapa.totalRituais}</p>
                <p className="text-[10px] uppercase tracking-wider text-amber-700/60">Rituais</p>
              </div>
            </div>

            {/* Closing Phrase */}
            <div className="text-center pt-6 pb-2">
              <p 
                className="font-display text-lg italic"
                style={{ color: "rgba(212, 175, 140, 0.8)" }}
              >
                "{fraseEncerramento}"
              </p>
            </div>

            {/* Footer Seal */}
            <div className="text-center pt-4 border-t border-amber-800/20">
              <div className="inline-flex items-center gap-2 text-amber-700/50 text-xs">
                <span>✧</span>
                <span>Labirinto da Heroína Interna®</span>
                <span>✧</span>
              </div>
              <p className="text-[10px] text-amber-800/40 mt-1">
                Casa ORÁCULA — Método Terapêutico Integrativo
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground"
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={handleSendEmail}
            className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar por E-mail
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Selando Travessia...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Selar e Baixar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
