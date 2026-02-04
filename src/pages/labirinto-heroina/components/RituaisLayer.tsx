import { Card, CardContent } from "@/components/ui/card";
import { Flame, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabirintoRitual } from "@/hooks/useLabirintoHeroina";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface RituaisLayerProps {
  rituais: LabirintoRitual[];
}

export function RituaisLayer({ rituais }: RituaisLayerProps) {
  const [selectedRitual, setSelectedRitual] = useState<LabirintoRitual | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-gold mb-2">
            Os 7 Rituais de Integração
          </h3>
          <p className="text-muted-foreground text-sm">
            Práticas simbólicas para ancorar as transformações no corpo e na vida cotidiana.
            Cada ritual é uma ponte entre o simbólico e o vivido.
          </p>
        </CardContent>
      </Card>

      {/* Rituals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {rituais.map((ritual) => (
          <Card 
            key={ritual.id}
            className={cn(
              "border-gold/20 hover:border-gold/40 transition-all",
              "cursor-pointer hover:bg-card/80"
            )}
            onClick={() => setSelectedRitual(ritual)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">{ritual.icone}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-lg text-foreground">
                    {ritual.nome}
                  </h4>
                  
                  {ritual.duracao && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{ritual.duracao}</span>
                    </div>
                  )}
                  
                  {ritual.descricao && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {ritual.descricao}
                    </p>
                  )}
                </div>

                <BookOpen className="w-4 h-4 text-gold/50 shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ritual Detail Dialog */}
      <Dialog open={!!selectedRitual} onOpenChange={() => setSelectedRitual(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedRitual?.icone}</span>
              <div>
                <DialogTitle className="font-display text-xl">
                  {selectedRitual?.nome}
                </DialogTitle>
                {selectedRitual?.duracao && (
                  <DialogDescription className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {selectedRitual.duracao}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRitual?.descricao && (
              <div>
                <h4 className="text-sm font-medium text-gold mb-2">Descrição</h4>
                <p className="text-muted-foreground">{selectedRitual.descricao}</p>
              </div>
            )}

            {selectedRitual?.instrucoes && (
              <div className="pt-4 border-t border-gold/10">
                <h4 className="text-sm font-medium text-gold mb-2">Instruções</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedRitual.instrucoes}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
