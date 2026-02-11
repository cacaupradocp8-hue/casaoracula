import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Moon, Sparkles, Feather, Flame,
  FileDown, RefreshCw, Scroll, Save, BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import type { MapaHeroinaData } from "@/hooks/useMapaHeroina";
import { MapaMandalaQuadrante } from "./MapaMandalaQuadrante";
import { toast } from "sonner";

interface MapaPessoalViewProps {
  mapa: MapaHeroinaData;
  onGeneratePDF: () => void;
  onNovaTravessia: () => void;
}

export function MapaPessoalView({ mapa, onGeneratePDF, onNovaTravessia }: MapaPessoalViewProps) {
  const [insights, setInsights] = useState("");

  const hasDados = mapa && (
    mapa.faseAtiva || 
    mapa.ultimoArquetipo || 
    mapa.ultimoCenario || 
    mapa.ultimoRitual
  );

  return (
    <div className="space-y-8">
      {/* Mandala Container */}
      {hasDados ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent rounded-3xl" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <MapaMandalaQuadrante
              titulo="Reino das Marés"
              subtitulo="Fase da Jornada"
              icone={<Moon className="w-5 h-5" />}
              corAccent="from-blue-900/30 to-indigo-900/30"
              item={mapa.faseAtiva ? {
                nome: mapa.faseAtiva.fase?.nome || "Fase",
                icone: mapa.faseAtiva.fase?.icone || "🌙",
                data: mapa.faseAtiva.registrado_em,
                status: "ativa",
              } : null}
              total={mapa.totalFases}
            />
            <MapaMandalaQuadrante
              titulo="Reino das Figuras"
              subtitulo="Arquétipo Ativo"
              icone={<Sparkles className="w-5 h-5" />}
              corAccent="from-purple-900/30 to-fuchsia-900/30"
              item={mapa.ultimoArquetipo ? {
                nome: mapa.ultimoArquetipo.arquetipo?.nome || "Arquétipo",
                icone: mapa.ultimoArquetipo.arquetipo?.icone || "✨",
                data: mapa.ultimoArquetipo.registrado_em,
                anotacao: mapa.ultimoArquetipo.polaridade_percebida,
              } : null}
              total={mapa.totalArquetipos}
            />
            <MapaMandalaQuadrante
              titulo="Reino dos Cenários"
              subtitulo="Metáfora Interna"
              icone={<Feather className="w-5 h-5" />}
              corAccent="from-emerald-900/30 to-teal-900/30"
              item={mapa.ultimoCenario ? {
                nome: mapa.ultimoCenario.metafora?.nome || "Cenário",
                icone: mapa.ultimoCenario.metafora?.icone || "🪶",
                data: mapa.ultimoCenario.registrado_em,
                anotacao: mapa.ultimoCenario.anotacao_livre,
              } : null}
              total={mapa.totalCenarios}
            />
            <MapaMandalaQuadrante
              titulo="Reino dos Gestos"
              subtitulo="Ritual em Curso"
              icone={<Flame className="w-5 h-5" />}
              corAccent="from-amber-900/30 to-orange-900/30"
              item={mapa.ultimoRitual ? {
                nome: mapa.ultimoRitual.ritual?.nome || "Ritual",
                icone: mapa.ultimoRitual.ritual?.icone || "🔥",
                data: mapa.ultimoRitual.completado_em,
                anotacao: mapa.ultimoRitual.reflexao,
                status: "realizado",
              } : null}
              total={mapa.totalRituais}
            />
          </div>

          {/* Center Mandala Symbol */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center shadow-lg shadow-gold/10">
              <span className="text-3xl">🌕</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <Card className="border-dashed border-gold/30">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-gold/30" />
            <h3 className="font-display text-xl text-foreground mb-2">
              Seu Mapa ainda está em branco
            </h3>
            <p className="text-muted-foreground mb-6">
              Entre no Labirinto e comece sua travessia pelas 4 camadas 
              para tecer seu Mapa Pessoal.
            </p>
            <Button
              onClick={onNovaTravessia}
              className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Iniciar Travessia
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Insights Area */}
      {hasDados && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gold/20 bg-gradient-to-br from-amber-950/20 to-stone-900/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-gold" />
                <h3 className="font-display text-lg text-gold">
                  Caderno de Insights
                </h3>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Registre aqui sonhos, imagens, intuições ou qualquer movimento 
                que emergiu durante esta travessia...
              </p>
              <Textarea
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                placeholder="O que você percebeu ao atravessar as camadas? Que padrões emergiram? Que transformações se anunciam?"
                className="min-h-[120px] bg-background/30 border-gold/20 focus:border-gold/40"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Suas anotações são salvas localmente</span>
                <Button variant="ghost" size="sm" className="text-gold/70 hover:text-gold gap-1">
                  <Save className="w-3 h-3" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      {hasDados && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Button
            onClick={onGeneratePDF}
            className="bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-amber-950 gap-2"
          >
            <FileDown className="w-4 h-4" />
            Encerrar esta Travessia (PDF)
          </Button>
          <Button
            variant="outline"
            onClick={onNovaTravessia}
            className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Iniciar Nova Travessia
          </Button>
        </motion.div>
      )}
    </div>
  );
}
