import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Flame, Check, Loader2, Scroll, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LabirintoRitual } from "@/hooks/useLabirintoHeroina";
import { useRegistrarRitual } from "@/hooks/useHeroinaRitualRegistro";

interface RitualTarotCardProps {
  ritual: LabirintoRitual;
  jaRealizado: boolean;
  vezesRealizado: number;
  index: number;
}

export function RitualTarotCard({ ritual, jaRealizado, vezesRealizado, index }: RitualTarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  const [reflexao, setReflexao] = useState("");
  const [intencao, setIntencao] = useState("");
  const { mutate: registrar, isPending } = useRegistrarRitual();

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      // Open modal after flip animation
      setTimeout(() => setOpen(true), 600);
    } else {
      setOpen(true);
    }
  };

  const handleRegistrar = () => {
    const textoCompleto = intencao 
      ? `[Intenção] ${intencao}\n\n[Reflexão] ${reflexao}` 
      : reflexao;
    
    registrar(
      { ritualId: ritual.id, reflexao: textoCompleto },
      {
        onSuccess: () => {
          setOpen(false);
          setReflexao("");
          setIntencao("");
        },
      }
    );
  };

  return (
    <>
      {/* Tarot Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateY: -10 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="perspective-1000"
      >
        <motion.div
          className={cn(
            "relative w-full aspect-[2/3] cursor-pointer preserve-3d transition-transform duration-700",
            isFlipped && "rotate-y-180"
          )}
          onClick={handleFlip}
          whileHover={{ scale: 1.02, rotateZ: isFlipped ? 0 : [-1, 1, -1, 0] }}
          whileTap={{ scale: 0.98 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Back (before flip) */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rounded-xl overflow-hidden",
              "bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950",
              "border-2 border-gold/40 shadow-xl shadow-purple-950/50",
              "flex items-center justify-center",
              isFlipped && "pointer-events-none"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Ornate pattern */}
            <div className="absolute inset-4 border border-gold/20 rounded-lg" />
            <div className="absolute inset-6 border border-gold/10 rounded-md" />
            
            {/* Center symbol */}
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Flame className="w-10 h-10 text-gold/60" />
              </div>
              <p className="text-gold/60 text-sm font-display">Toque para revelar</p>
            </div>

            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 text-gold/30 text-2xl">✧</div>
            <div className="absolute top-4 right-4 text-gold/30 text-2xl">✧</div>
            <div className="absolute bottom-4 left-4 text-gold/30 text-2xl">✧</div>
            <div className="absolute bottom-4 right-4 text-gold/30 text-2xl">✧</div>
          </div>

          {/* Card Front (after flip) */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rounded-xl overflow-hidden rotate-y-180",
              "bg-gradient-to-br from-amber-950/90 via-stone-900 to-amber-950/90",
              "border-2 shadow-xl",
              jaRealizado 
                ? "border-gold/60 shadow-gold/20" 
                : "border-gold/30 shadow-amber-950/50"
            )}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
            
            {/* Inner border */}
            <div className="absolute inset-3 border border-gold/20 rounded-lg" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-between p-4 text-center">
              {/* Top ornament */}
              <div className="text-gold/40 text-lg">◆ ◇ ◆</div>
              
              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center my-2",
                "bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30",
                jaRealizado && "ring-2 ring-gold/40 ring-offset-2 ring-offset-amber-950"
              )}>
                <span className="text-3xl">{ritual.icone}</span>
              </div>

              {/* Title */}
              <h4 className="font-display text-base text-gold leading-tight px-2">
                {ritual.nome}
              </h4>

              {/* Duration badge */}
              {ritual.duracao && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{ritual.duracao}</span>
                </div>
              )}

              {/* Realized badge */}
              {jaRealizado && (
                <div className="flex items-center gap-1 text-xs text-gold bg-gold/10 px-2 py-1 rounded-full mt-2">
                  <Check className="w-3 h-3" />
                  <span>Realizado {vezesRealizado}×</span>
                </div>
              )}

              {/* Bottom ornament */}
              <div className="text-gold/40 text-lg mt-auto">◆ ◇ ◆</div>
            </div>

            {/* Seal if realized */}
            {jaRealizado && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center shadow-lg transform rotate-12">
                <Flame className="w-6 h-6 text-amber-950" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Grimoire-style Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-950/95 via-stone-900/95 to-amber-950/95 border-gold/30">
          <DialogHeader className="border-b border-gold/20 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                <span className="text-4xl">{ritual.icone}</span>
              </div>
              <div>
                <DialogTitle className="font-display text-xl text-gold">
                  {ritual.nome}
                </DialogTitle>
                {ritual.duracao && (
                  <p className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {ritual.duracao}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Instrução Ritual */}
            {ritual.descricao && (
              <div className="relative bg-gold/5 rounded-lg p-5 border border-gold/20">
                <Scroll className="absolute top-3 right-3 w-4 h-4 text-gold/40" />
                <h4 className="text-xs uppercase tracking-wider text-gold/60 mb-2">
                  O Gesto Sagrado
                </h4>
                <p className="text-foreground font-display text-lg leading-relaxed italic">
                  "{ritual.descricao}"
                </p>
              </div>
            )}

            {/* Instruções detalhadas */}
            {ritual.instrucoes && (
              <div className="border-l-2 border-gold/30 pl-4">
                <h4 className="text-xs uppercase tracking-wider text-gold/60 mb-2">
                  Como Realizar
                </h4>
                <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                  {ritual.instrucoes}
                </p>
              </div>
            )}

            {/* Campo de Intenção - Como vai executar */}
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-gold" />
                <h4 className="text-sm font-medium text-gold">
                  Registrar meu Ritual
                </h4>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Como você irá executar este gesto sagrado? Descreva sua intenção.
              </p>
              <Textarea
                value={intencao}
                onChange={(e) => setIntencao(e.target.value)}
                placeholder="Vou fazer isso ao amanhecer, junto ao rio..."
                className="min-h-[80px] bg-background/30 border-gold/20 focus:border-gold/40"
              />
            </div>

            {/* Campo de Reflexão pós-ritual */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gold">
                Após realizar o Ritual...
              </h4>
              <p className="text-xs text-muted-foreground italic">
                O que emergiu? O que se transformou? (opcional)
              </p>
              <Textarea
                value={reflexao}
                onChange={(e) => setReflexao(e.target.value)}
                placeholder="Escreva sua experiência após a travessia..."
                className="min-h-[100px] bg-background/30 border-gold/20 focus:border-gold/40"
              />
            </div>

            {/* Botão de Registro */}
            <Button
              onClick={handleRegistrar}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-amber-950 font-medium gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Selando...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Selar como Realizado
                </>
              )}
            </Button>

            {jaRealizado && (
              <p className="text-center text-xs text-muted-foreground bg-gold/5 rounded-lg p-3">
                ✧ Este ritual já foi realizado {vezesRealizado} vez(es). ✧
                <br />
                <span className="text-gold/70">Pode realizar novamente quando sentir o chamado.</span>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
