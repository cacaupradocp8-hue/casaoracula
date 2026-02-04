import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Shuffle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LabirintoRitual } from "@/hooks/useLabirintoHeroina";
import { RitualTarotCard } from "./RitualTarotCard";
import { useHeroinaRitualRegistros } from "@/hooks/useHeroinaRitualRegistro";

interface RituaisLayerProps {
  rituais: LabirintoRitual[];
}

export function RituaisLayer({ rituais }: RituaisLayerProps) {
  const { data: registros } = useHeroinaRitualRegistros();
  const [shuffleKey, setShuffleKey] = useState(0);
  const [displayedRituais, setDisplayedRituais] = useState(rituais);

  if (rituais.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Flame className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum ritual configurado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  // Contagem de realizações por ritual
  const realizacoesPorRitual = registros?.reduce((acc, r) => {
    acc[r.ritual_id] = (acc[r.ritual_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const rituaisRealizados = Object.keys(realizacoesPorRitual).length;

  const handleShuffle = () => {
    // Shuffle the array
    const shuffled = [...rituais].sort(() => Math.random() - 0.5);
    setDisplayedRituais(shuffled);
    setShuffleKey(prev => prev + 1);
  };

  const handleReset = () => {
    setDisplayedRituais(rituais);
    setShuffleKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-purple-950/30 via-card to-purple-950/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTMwIDBMMzAgNjBNMCA2MEw2MCAwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50" />
        <CardContent className="p-6 space-y-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-purple-900/30 flex items-center justify-center border border-gold/30">
              <Flame className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-xl text-gold">
                🜂 Reino dos Gestos
              </h3>
              <p className="text-xs text-gold/60">Cartas de Ritual</p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            Cada carta é um gesto sagrado, um ato poético que transforma compreensão em travessia.
            Toque uma carta para revelar seu ritual. Depois de realizá-lo, registre sua experiência.
          </p>
          
          <div className="flex items-center justify-between pt-3 border-t border-gold/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>
                {rituaisRealizados} de {rituais.length} rituais selados no seu Mapa
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShuffle}
                className="text-gold/70 hover:text-gold hover:bg-gold/10 gap-1"
              >
                <Shuffle className="w-3 h-3" />
                <span className="hidden sm:inline">Embaralhar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gold/70 hover:text-gold hover:bg-gold/10 gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Resetar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso Ético */}
      <div className="text-center text-sm text-muted-foreground/70 italic px-4">
        ✧ Rituais são gestos de integração. Realize no seu tempo, quando sentir o chamado. ✧
      </div>

      {/* Tarot Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={shuffleKey}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {displayedRituais.map((ritual, index) => (
            <RitualTarotCard
              key={`${ritual.id}-${shuffleKey}`}
              ritual={ritual}
              jaRealizado={!!realizacoesPorRitual[ritual.id]}
              vezesRealizado={realizacoesPorRitual[ritual.id] || 0}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer hint */}
      <p className="text-center text-xs text-muted-foreground/50 pt-4">
        Toque em uma carta para revelar o gesto sagrado dentro dela
      </p>
    </div>
  );
}
