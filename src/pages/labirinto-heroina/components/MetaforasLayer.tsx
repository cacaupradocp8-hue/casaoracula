import { Card, CardContent } from "@/components/ui/card";
import { Feather, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabirintoMetafora } from "@/hooks/useLabirintoHeroina";

interface MetaforasLayerProps {
  metaforas: LabirintoMetafora[];
}

export function MetaforasLayer({ metaforas }: MetaforasLayerProps) {
  if (metaforas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Feather className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhuma metáfora configurada ainda.</p>
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
            As 7 Metáforas-Espelho
          </h3>
          <p className="text-muted-foreground text-sm">
            Cada metáfora é um espelho simbólico — uma imagem que reflete aspectos 
            do processo interno de forma segura e poética.
          </p>
        </CardContent>
      </Card>

      {/* Metaphors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metaforas.map((metafora) => (
          <Card 
            key={metafora.id}
            className={cn(
              "border-gold/20 hover:border-gold/40 transition-all",
              "group cursor-pointer"
            )}
          >
            <CardContent className="p-6 space-y-4">
              {/* Icon & Title */}
              <div className="text-center">
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                  {metafora.icone}
                </span>
                <h4 className="font-display text-lg text-foreground">
                  {metafora.nome}
                </h4>
              </div>

              {/* Evocative Text */}
              {metafora.texto_evocativo && (
                <p className="text-sm text-muted-foreground italic text-center">
                  "{metafora.texto_evocativo}"
                </p>
              )}

              {/* Reflection Question */}
              {metafora.pergunta_reflexao && (
                <div className="pt-4 border-t border-gold/10">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-gold/80">
                      {metafora.pergunta_reflexao}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
