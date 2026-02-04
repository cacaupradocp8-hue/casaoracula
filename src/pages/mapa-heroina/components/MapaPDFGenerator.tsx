import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { MapaHeroinaData } from "@/hooks/useMapaHeroina";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface MapaPDFGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapa: MapaHeroinaData;
  insights: string;
}

export function MapaPDFGenerator({
  open,
  onOpenChange,
  mapa,
  insights,
}: MapaPDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#0E1A24",
        logging: false,
      });
      
      const link = document.createElement("a");
      link.download = `mapa-heroina-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("Mapa da Travessia salvo com sucesso ✨");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar o Mapa. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatData = (data: string | null | undefined) => {
    if (!data) return "—";
    try {
      return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return "—";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-gold flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Encerrar Travessia
          </DialogTitle>
          <DialogDescription>
            Gere uma imagem cerimonial do seu Mapa Pessoal da Heroína
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div 
          ref={contentRef}
          className="bg-gradient-to-br from-[#0E1A24] via-[#142634] to-[#0E1A24] rounded-lg p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 border-b border-gold/20 pb-6">
            <div className="text-4xl mb-4">🌕</div>
            <h2 className="font-display text-2xl text-gold">
              Mapa Pessoal da Heroína®
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>

          {/* Four Quadrants */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fase */}
            <div className="bg-blue-900/20 rounded-lg p-4 border border-gold/10">
              <h4 className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                Reino das Marés — Fase
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {mapa.faseAtiva?.fase?.icone || "🌙"}
                </span>
                <div>
                  <p className="font-display text-foreground">
                    {mapa.faseAtiva?.fase?.nome || "Não registrada"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatData(mapa.faseAtiva?.registrado_em)}
                  </p>
                </div>
              </div>
            </div>

            {/* Arquétipo */}
            <div className="bg-purple-900/20 rounded-lg p-4 border border-gold/10">
              <h4 className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                Reino das Figuras — Arquétipo
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {mapa.ultimoArquetipo?.arquetipo?.icone || "✨"}
                </span>
                <div>
                  <p className="font-display text-foreground">
                    {mapa.ultimoArquetipo?.arquetipo?.nome || "Não registrado"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatData(mapa.ultimoArquetipo?.registrado_em)}
                  </p>
                </div>
              </div>
              {mapa.ultimoArquetipo?.polaridade_percebida && (
                <p className="text-xs text-muted-foreground/70 mt-2 italic">
                  "{mapa.ultimoArquetipo.polaridade_percebida}"
                </p>
              )}
            </div>

            {/* Cenário */}
            <div className="bg-emerald-900/20 rounded-lg p-4 border border-gold/10">
              <h4 className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                Reino dos Cenários — Metáfora
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {mapa.ultimoCenario?.metafora?.icone || "🪶"}
                </span>
                <div>
                  <p className="font-display text-foreground">
                    {mapa.ultimoCenario?.metafora?.nome || "Não registrado"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatData(mapa.ultimoCenario?.registrado_em)}
                  </p>
                </div>
              </div>
              {mapa.ultimoCenario?.anotacao_livre && (
                <p className="text-xs text-muted-foreground/70 mt-2 italic line-clamp-2">
                  "{mapa.ultimoCenario.anotacao_livre}"
                </p>
              )}
            </div>

            {/* Ritual */}
            <div className="bg-amber-900/20 rounded-lg p-4 border border-gold/10">
              <h4 className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                Reino dos Gestos — Ritual
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {mapa.ultimoRitual?.ritual?.icone || "🔥"}
                </span>
                <div>
                  <p className="font-display text-foreground">
                    {mapa.ultimoRitual?.ritual?.nome || "Não registrado"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatData(mapa.ultimoRitual?.completado_em)}
                  </p>
                </div>
              </div>
              {mapa.ultimoRitual?.reflexao && (
                <p className="text-xs text-muted-foreground/70 mt-2 italic line-clamp-2">
                  "{mapa.ultimoRitual.reflexao}"
                </p>
              )}
            </div>
          </div>

          {/* Insights */}
          {insights && (
            <div className="bg-gold/5 rounded-lg p-4 border border-gold/20">
              <h4 className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                Caderno de Insights
              </h4>
              <p className="text-sm text-foreground/80 italic whitespace-pre-wrap">
                {insights}
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="flex justify-center gap-8 pt-4 border-t border-gold/20">
            <div className="text-center">
              <p className="text-lg font-display text-gold">{mapa.totalFases}</p>
              <p className="text-xs text-muted-foreground">Fases</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display text-gold">{mapa.totalArquetipos}</p>
              <p className="text-xs text-muted-foreground">Arquétipos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display text-gold">{mapa.totalCenarios}</p>
              <p className="text-xs text-muted-foreground">Cenários</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display text-gold">{mapa.totalRituais}</p>
              <p className="text-xs text-muted-foreground">Rituais</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gold/20">
            <p className="text-xs text-gold/50">
              ✧ O Labirinto da Heroína Interna® ✧
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Casa ORÁCULA — Método Terapêutico Integrativo
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Salvar Imagem
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
