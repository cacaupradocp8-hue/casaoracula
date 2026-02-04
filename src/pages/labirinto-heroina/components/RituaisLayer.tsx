import { Card, CardContent } from "@/components/ui/card";
import { Flame, Sparkles } from "lucide-react";
import type { LabirintoRitual } from "@/hooks/useLabirintoHeroina";
import { RitualCard } from "./RitualCard";
import { useHeroinaRitualRegistros } from "@/hooks/useHeroinaRitualRegistro";

interface RituaisLayerProps {
  rituais: LabirintoRitual[];
}

export function RituaisLayer({ rituais }: RituaisLayerProps) {
  const { data: registros } = useHeroinaRitualRegistros();

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

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-display text-xl text-gold">
            🔥 Os 7 Rituais de Integração
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Práticas simbólicas para ancorar as transformações no corpo e na vida cotidiana.
            Cada ritual é uma ponte entre o simbólico e o vivido — um gesto que marca a passagem.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 pt-2 border-t border-gold/10">
            <Sparkles className="w-3 h-3" />
            <span>
              {rituaisRealizados} de {rituais.length} rituais realizados no seu Mapa
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Aviso Ético */}
      <div className="text-center text-sm text-muted-foreground/70 italic">
        Rituais são gestos de integração. Realize no seu tempo, quando sentir o chamado.
      </div>

      {/* Rituals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {rituais.map((ritual) => (
          <RitualCard
            key={ritual.id}
            ritual={ritual}
            jaRealizado={!!realizacoesPorRitual[ritual.id]}
            vezesRealizado={realizacoesPorRitual[ritual.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
