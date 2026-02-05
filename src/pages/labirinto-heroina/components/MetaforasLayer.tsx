import { Card, CardContent } from "@/components/ui/card";
import { Feather } from "lucide-react";
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
      {/* Introdução Atmosférica — Sem Explicação */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 via-transparent to-accent/5">
        <CardContent className="p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl text-gold mb-3 text-center">
            Os 14 Cenários do Inconsciente
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-center max-w-2xl mx-auto">
            Paisagens simbólicas onde a psique se mostra, não se explica.
            Atmosferas, limiares, territórios internos que habitam você.
          </p>
          
          {/* Instrução ritual */}
          <div className="mt-6 pt-4 border-t border-gold/10 text-center">
            <p className="text-xs text-muted-foreground/70 italic">
              Permita-se habitar cada cenário. 
              Não busque significado — deixe que a paisagem fale.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cenários — Estilo Contemplativo */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metaforas.map((metafora) => (
          <div key={metafora.id} className="relative">
            <MetaforaCard metafora={metafora} />
            
            {/* Badge de Registros */}
            {registrosPorCenario[metafora.id] > 0 && (
              <div className="absolute top-2 right-2 bg-gold/90 text-gold-foreground text-xs px-2 py-1 rounded-full font-medium">
                {registrosPorCenario[metafora.id]}×
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fechamento Contemplativo */}
      <Card className="border-gold/20 bg-card/50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground italic">
            "A heroína não atravessa o labirinto buscando saídas.
            Ela atravessa até que o labirinto não seja mais estranho."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
