// ============================================
// MAPA DA HEROÍNA — VISUALIZAÇÃO DA JORNADA
// Modo Pessoal: Mandala + Registro | Modo Profissional: Dashboard Clínico
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, FileDown, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";
import type { LabirintoModo } from "../ModoSelector";
import { MapaMandala } from "./MapaMandala";
import { MapaProfissional } from "./MapaProfissional";

interface MapaHeroinaProps {
  modo: LabirintoModo;
  fasesAtravessadas: LabirintoFase[];
  todasFases: LabirintoFase[];
  registrosPessoais?: Record<string, string>;
  camposClinicos?: {
    nomeCliente: string;
    observacoesClinicas: string;
    hipoteseTerapeutica: string;
    crencaCentral?: string;
    emocaoDominante?: string;
    padraoDefensivo?: string;
    direcionamento?: string;
  };
}

export function MapaHeroina({
  modo,
  fasesAtravessadas,
  todasFases,
  registrosPessoais,
  camposClinicos,
}: MapaHeroinaProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
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
      const prefix = modo === "profissional" ? "mapa-clinico" : "mapa-pessoal";
      link.download = `${prefix}-heroina-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Mapa exportado com sucesso!", { icon: "🗺️" });
    } catch {
      toast.error("Erro ao exportar mapa.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const dataMapa = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="space-y-6">
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Map className="w-5 h-5 text-gold" />
            {modo === "profissional" ? "Mapa Clínico da Jornada" : "Meu Mapa da Heroína"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modo === "pessoal" ? (
            <MapaMandala
              fasesAtravessadas={fasesAtravessadas}
              todasFases={todasFases}
              registros={registrosPessoais}
            />
          ) : (
            <MapaProfissional
              fasesAtravessadas={fasesAtravessadas}
              todasFases={todasFases}
              camposClinicos={camposClinicos}
            />
          )}
        </CardContent>
      </Card>

      {/* Export */}
      <div className="flex justify-center">
        <Button
          onClick={handleExportPDF}
          disabled={isGeneratingPDF}
          className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
        >
          {isGeneratingPDF ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Exportando...</>
          ) : (
            <><FileDown className="w-4 h-4" /> Exportar Mapa</>
          )}
        </Button>
      </div>

      {/* Hidden PDF content */}
      <div className="fixed -left-[9999px]" aria-hidden="true">
        <div
          ref={pdfRef}
          className="w-[600px] p-8"
          style={{
            background: "linear-gradient(135deg, #1a1510 0%, #252018 50%, #1a1510 100%)",
            color: "#d4a574",
            fontFamily: "Georgia, serif",
          }}
        >
          <div className="text-center pb-4 border-b border-amber-800/30">
            <p className="text-xs uppercase tracking-widest mb-2 opacity-70">
              ✧ Mapa da Heroína Interna® ✧
            </p>
            <p className="text-xs opacity-50">{dataMapa}</p>
            {modo === "profissional" && camposClinicos?.nomeCliente && (
              <p className="text-sm mt-2 opacity-80">Cliente: {camposClinicos.nomeCliente}</p>
            )}
          </div>

          <div className="py-4">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">
              Portas Atravessadas ({fasesAtravessadas.length}/{todasFases.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {todasFases.map((fase) => {
                const atravessada = fasesAtravessadas.some(f => f.id === fase.id);
                return (
                  <div key={fase.id} className={`text-xs py-1 ${atravessada ? "opacity-90" : "opacity-30"}`}>
                    {fase.icone || "○"} {fase.nome}
                  </div>
                );
              })}
            </div>
          </div>

          {modo === "profissional" && camposClinicos && (
            <div className="py-4 border-t border-amber-800/20">
              <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">Ficha Clínica</h4>
              {camposClinicos.observacoesClinicas && (
                <p className="text-xs opacity-80 mb-2">Observações: {camposClinicos.observacoesClinicas}</p>
              )}
              {camposClinicos.hipoteseTerapeutica && (
                <p className="text-xs opacity-80 mb-2">Hipótese: {camposClinicos.hipoteseTerapeutica}</p>
              )}
              {camposClinicos.crencaCentral && (
                <p className="text-xs opacity-80 mb-2">Crença central: {camposClinicos.crencaCentral}</p>
              )}
              {camposClinicos.direcionamento && (
                <p className="text-xs opacity-80">Direcionamento: {camposClinicos.direcionamento}</p>
              )}
            </div>
          )}

          <div className="text-center pt-4 border-t border-amber-800/20">
            <p className="text-xs opacity-40">Casa ORÁCULA — Método Terapêutico Integrativo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
