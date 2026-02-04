import { Card, CardContent } from "@/components/ui/card";
import { Feather, MapPin } from "lucide-react";
import type { LabirintoMetafora } from "@/hooks/useLabirintoHeroina";
import { MetaforaCard } from "./MetaforaCard";
import { useHeroinaCenarioRegistros } from "@/hooks/useHeroinaCenarioRegistro";

interface MetaforasLayerProps {
  metaforas: LabirintoMetafora[];
}

export function MetaforasLayer({ metaforas }: MetaforasLayerProps) {
  const { data: registros } = useHeroinaCenarioRegistros();
  
  if (metaforas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Feather className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum cenário configurado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  // Contagem de registros por cenário
  const registrosPorCenario = registros?.reduce((acc, r) => {
    acc[r.metafora_id] = (acc[r.metafora_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8">
      {/* Introdução Poética */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-display text-xl text-gold">
            🜃 O Reino dos Cenários
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Este é o palco do inconsciente. Aqui, a psique não se explica — ela se mostra.
            Imagens internas, atmosferas simbólicas, paisagens psíquicas que habitam
            sonhos e devaneios.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 pt-2 border-t border-gold/10">
            <MapPin className="w-3 h-3" />
            <span>
              {registros?.length || 0} cenário(s) registrado(s) no seu Mapa Pessoal
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Aviso Ético */}
      <div className="text-center text-sm text-muted-foreground/70 italic">
        O sistema apresenta e sustenta o campo. Não interpreta, não associa significados automáticos.
      </div>

      {/* Grid de Cartas-Cenário */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metaforas.map((metafora) => (
          <div key={metafora.id} className="relative">
            <MetaforaCard metafora={metafora} />
            
            {/* Badge de Registros */}
            {registrosPorCenario[metafora.id] > 0 && (
              <div className="absolute top-2 right-2 bg-gold/90 text-gold-foreground text-xs px-2 py-1 rounded-full">
                {registrosPorCenario[metafora.id]}×
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
