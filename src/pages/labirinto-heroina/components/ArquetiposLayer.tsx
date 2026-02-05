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
      {/* Introduction - Symbolic Language */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 via-transparent to-accent/5">
        <CardContent className="p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl text-gold mb-3 text-center">
            Os 14 Arquétipos da Psique Feminina
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-center max-w-2xl mx-auto">
            Cada arquétipo carrega uma polaridade — luz e sombra que coexistem.
            Este não é um teste. Não há resultado certo ou errado.
            Você é a única que pode reconhecer como cada força pulsa em sua vida.
          </p>
          
          {/* Ritual instruction */}
          <div className="mt-6 pt-4 border-t border-gold/10 text-center">
            <p className="text-xs text-muted-foreground/70 italic">
              Permita-se contemplar cada carta sem pressa. 
              Deixe que a imagem fale antes das palavras.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Archetypes Grid - Ceremonial Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {arquetipos.map((arquetipo) => (
          <ArquetipoCard key={arquetipo.id} arquetipo={arquetipo} />
        ))}
      </div>

      {/* Closing reflection */}
      <Card className="border-gold/20 bg-card/50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground italic">
            "A heroína não escolhe apenas um arquétipo. 
            Ela atravessa todos — até integrar a totalidade que sempre foi."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
