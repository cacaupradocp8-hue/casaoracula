import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MapPin, Check, Loader2 } from "lucide-react";
import { useRegistrarCenario } from "@/hooks/useHeroinaCenarioRegistro";
import { toast } from "sonner";
import type { LabirintoMetafora } from "@/hooks/useLabirintoHeroina";

// Importar imagens dos cenários
import cenario01 from "@/assets/labirinto/cenario-01-espelho-partido.jpg";
import cenario02 from "@/assets/labirinto/cenario-02-floresta-cega.jpg";
import cenario03 from "@/assets/labirinto/cenario-03-poco-encantado.jpg";
import cenario04 from "@/assets/labirinto/cenario-04-porta-sem-macaneta.jpg";
import cenario05 from "@/assets/labirinto/cenario-05-fio-ancestral.jpg";
import cenario06 from "@/assets/labirinto/cenario-06-torre-vazia.jpg";
import cenario07 from "@/assets/labirinto/cenario-07-rio-subterraneo.jpg";

const CENARIO_IMAGES: Record<number, string> = {
  1: cenario01,
  2: cenario02,
  3: cenario03,
  4: cenario04,
  5: cenario05,
  6: cenario06,
  7: cenario07,
};

interface MetaforaCardProps {
  metafora: LabirintoMetafora;
}

export function MetaforaCard({ metafora }: MetaforaCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anotacao, setAnotacao] = useState("");
  const [registrado, setRegistrado] = useState(false);
  
  const registrarMutation = useRegistrarCenario();
  
  const imageUrl = metafora.imagem_url || CENARIO_IMAGES[metafora.ordem];

  const handleRegistrar = async () => {
    try {
      await registrarMutation.mutateAsync({
        metafora_id: metafora.id,
        anotacao_livre: anotacao || undefined,
      });
      setRegistrado(true);
      toast.success("Cenário registrado no seu Mapa Pessoal");
      setTimeout(() => {
        setIsOpen(false);
        setRegistrado(false);
        setAnotacao("");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao registrar cenário");
    }
  };

  return (
    <>
      {/* Card do Cenário - Estilo Contemplativo */}
      <Card 
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "border-gold/20 hover:border-gold/50 transition-all duration-500",
          "bg-gradient-to-b from-card to-card/80"
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Imagem Atmosférica */}
        <div className="aspect-square relative overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={metafora.nome}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          
          {/* Overlay Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Nome do Cenário */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-lg text-white leading-tight">
              {metafora.nome}
            </h3>
          </div>
        </div>
        
        {/* Texto Evocativo */}
        <CardContent className="p-4">
          {metafora.texto_evocativo && (
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{metafora.texto_evocativo}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal de Contemplação */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg border-gold/30 bg-card/95 backdrop-blur">
          <DialogHeader className="text-center">
            <DialogTitle className="font-display text-2xl text-gold">
              {metafora.nome}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Contemple este cenário simbólico
            </DialogDescription>
          </DialogHeader>

          {/* Imagem no Modal */}
          <div className="aspect-video relative overflow-hidden rounded-lg">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={metafora.nome}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Texto Atmosférico */}
          {metafora.texto_evocativo && (
            <div className="text-center py-4 border-y border-gold/10">
              <p className="text-muted-foreground italic leading-relaxed">
                "{metafora.texto_evocativo}"
              </p>
            </div>
          )}

          {/* Pergunta-Oráculo */}
          {metafora.pergunta_reflexao && (
            <div className="bg-gold/5 rounded-lg p-4 text-center">
              <p className="text-gold font-medium">
                {metafora.pergunta_reflexao}
              </p>
            </div>
          )}

          {/* Espaço de Anotação Livre */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Espaço para suas percepções (opcional):
            </label>
            <Textarea
              value={anotacao}
              onChange={(e) => setAnotacao(e.target.value)}
              placeholder="O que este cenário desperta em você?"
              className="min-h-[80px] border-gold/20 bg-background/50 resize-none"
              disabled={registrado}
            />
          </div>

          {/* Botão de Registro */}
          <Button
            onClick={handleRegistrar}
            disabled={registrarMutation.isPending || registrado}
            className={cn(
              "w-full gap-2",
              registrado 
                ? "bg-emerald-600 hover:bg-emerald-600 text-white" 
                : "bg-gold hover:bg-gold/90 text-gold-foreground"
            )}
          >
            {registrarMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : registrado ? (
              <>
                <Check className="w-4 h-4" />
                Registrado no Mapa Pessoal
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Registrar este cenário
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
