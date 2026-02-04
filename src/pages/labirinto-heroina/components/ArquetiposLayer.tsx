import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { LabirintoArquetipo } from "@/hooks/useLabirintoHeroina";
import { ArquetipoCard } from "./ArquetipoCard";

interface ArquetiposLayerProps {
  arquetipos: LabirintoArquetipo[];
}

export function ArquetiposLayer({ arquetipos }: ArquetiposLayerProps) {
  if (arquetipos.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum arquétipo configurado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-gold mb-2">
            Os 14 Arquétipos da Psique Feminina
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Cada arquétipo carrega luz e sombra. O sistema não diagnostica, não classifica 
            e não interpreta automaticamente. Você é a única que pode reconhecer como 
            cada força atua em sua vida.
          </p>
        </CardContent>
      </Card>

      {/* Archetypes Grid - Ceremonial Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {arquetipos.map((arquetipo) => (
          <ArquetipoCard key={arquetipo.id} arquetipo={arquetipo} />
        ))}
      </div>
    </div>
  );
}
