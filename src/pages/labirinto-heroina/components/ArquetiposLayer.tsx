import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Sun, Moon as MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabirintoArquetipo } from "@/hooks/useLabirintoHeroina";

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
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-gold mb-2">
            Os 7 Arquétipos Regentes
          </h3>
          <p className="text-muted-foreground text-sm">
            Cada arquétipo carrega luz e sombra. Conhecer ambas faces é parte da integração.
          </p>
        </CardContent>
      </Card>

      {/* Archetypes Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {arquetipos.map((arquetipo) => (
          <Card 
            key={arquetipo.id}
            className="border-gold/20 hover:border-gold/40 transition-all overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{arquetipo.icone}</span>
                  <div>
                    <h4 className="font-display text-lg text-foreground">
                      {arquetipo.nome}
                    </h4>
                    {arquetipo.territorio && (
                      <span className="text-xs text-gold/70">
                        Território: {arquetipo.territorio}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Light & Shadow */}
              <div className="grid grid-cols-2 divide-x divide-gold/10">
                {/* Luz */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-gold">
                    <Sun className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Luz</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {arquetipo.descricao_luz || "—"}
                  </p>
                </div>

                {/* Sombra */}
                <div className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <MoonIcon className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Sombra</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {arquetipo.descricao_sombra || "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
