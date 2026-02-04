import { Card, CardContent } from "@/components/ui/card";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

interface FasesLayerProps {
  fases: LabirintoFase[];
}

export function FasesLayer({ fases }: FasesLayerProps) {
  if (fases.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Moon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhuma fase configurada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-gold mb-2">
            As 7 Fases da Travessia
          </h3>
          <p className="text-muted-foreground text-sm">
            Cada fase representa um estágio no processo de transformação. 
            Não são lineares — podemos revisitá-las em espiral.
          </p>
        </CardContent>
      </Card>

      {/* Phases Timeline */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10 hidden md:block" />

        <div className="space-y-4">
          {fases.map((fase, index) => (
            <Card 
              key={fase.id} 
              className={cn(
                "border-gold/20 hover:border-gold/40 transition-all cursor-pointer",
                "hover:bg-card/80"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Phase Number */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-card border-2 border-gold/50 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{fase.icone || fase.ordem}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gold/70">Fase {fase.ordem}</span>
                    </div>
                    <h4 className="font-display text-lg text-foreground">
                      {fase.nome}
                    </h4>
                    {fase.subtitulo && (
                      <p className="text-sm text-gold/80 italic">
                        {fase.subtitulo}
                      </p>
                    )}
                    {fase.descricao && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {fase.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
