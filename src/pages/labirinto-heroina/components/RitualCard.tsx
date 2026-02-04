import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Flame, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { LabirintoRitual } from "@/hooks/useLabirintoHeroina";
import { useRegistrarRitual } from "@/hooks/useHeroinaRitualRegistro";

interface RitualCardProps {
  ritual: LabirintoRitual;
  jaRealizado: boolean;
  vezesRealizado: number;
}

export function RitualCard({ ritual, jaRealizado, vezesRealizado }: RitualCardProps) {
  const [open, setOpen] = useState(false);
  const [reflexao, setReflexao] = useState("");
  const { mutate: registrar, isPending } = useRegistrarRitual();

  const handleRegistrar = () => {
    registrar(
      { ritualId: ritual.id, reflexao },
      {
        onSuccess: () => {
          setOpen(false);
          setReflexao("");
        },
      }
    );
  };

  return (
    <>
      <Card
        className={cn(
          "border-gold/20 hover:border-gold/40 transition-all cursor-pointer group",
          "hover:bg-card/80",
          jaRealizado && "border-gold/50 bg-gold/5"
        )}
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all",
              jaRealizado ? "bg-gold/20" : "bg-gold/10 group-hover:bg-gold/15"
            )}>
              <span className="text-3xl">{ritual.icone}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
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

              {jaRealizado && (
                <div className="flex items-center gap-1 text-xs text-gold mt-2">
                  <Check className="w-3 h-3" />
                  <span>Realizado {vezesRealizado}×</span>
                </div>
              )}
            </div>

            <Flame className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              jaRealizado ? "text-gold" : "text-gold/30 group-hover:text-gold/50"
            )} />
          </div>
        </CardContent>
      </Card>

      {/* Ritual Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-4xl">{ritual.icone}</span>
              </div>
              <div>
                <DialogTitle className="font-display text-xl">
                  {ritual.nome}
                </DialogTitle>
                {ritual.duracao && (
                  <DialogDescription className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {ritual.duracao}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Descrição */}
            {ritual.descricao && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gold mb-2">O que é</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {ritual.descricao}
                </p>
              </div>
            )}

            {/* Instruções */}
            {ritual.instrucoes && (
              <div className="border-l-2 border-gold/30 pl-4">
                <h4 className="text-sm font-medium text-gold mb-2">Como fazer</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                  {ritual.instrucoes}
                </p>
              </div>
            )}

            {/* Campo de Reflexão */}
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <h4 className="text-sm font-medium text-gold">
                Depois de realizar o ritual...
              </h4>
              <p className="text-xs text-muted-foreground italic">
                O que você sentiu? O que emergiu? (opcional)
              </p>
              <Textarea
                value={reflexao}
                onChange={(e) => setReflexao(e.target.value)}
                placeholder="Escreva livremente sua experiência..."
                className="min-h-[100px] bg-background/50 border-gold/20 focus:border-gold/40"
              />
            </div>

            {/* Botão de Registro */}
            <Button
              onClick={handleRegistrar}
              disabled={isPending}
              className="w-full bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Marcar como Realizado
                </>
              )}
            </Button>

            {jaRealizado && (
              <p className="text-center text-xs text-muted-foreground">
                Você já realizou este ritual {vezesRealizado} vez(es).
                <br />Pode realizar novamente quando sentir o chamado.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
