import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sun, Moon as MoonIcon, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabirintoArquetipo } from "@/hooks/useLabirintoHeroina";
import { useRegistrarArquetipo } from "@/hooks/useHeroinaArquetipoRegistro";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Import images
import imgSelvagem from "@/assets/labirinto/arquetipo-01-selvagem.jpg";
import imgSabia from "@/assets/labirinto/arquetipo-02-sabia.jpg";
import imgAmante from "@/assets/labirinto/arquetipo-03-amante.jpg";
import imgMae from "@/assets/labirinto/arquetipo-04-mae.jpg";
import imgGuerreira from "@/assets/labirinto/arquetipo-05-guerreira.jpg";
import imgCurandeira from "@/assets/labirinto/arquetipo-06-curandeira.jpg";
import imgVisionaria from "@/assets/labirinto/arquetipo-07-visionaria.jpg";
import imgCriadora from "@/assets/labirinto/arquetipo-08-criadora.jpg";
import imgAncia from "@/assets/labirinto/arquetipo-09-ancia.jpg";
import imgDonzela from "@/assets/labirinto/arquetipo-10-donzela.jpg";
import imgSacerdotisa from "@/assets/labirinto/arquetipo-11-sacerdotisa.jpg";
import imgRainha from "@/assets/labirinto/arquetipo-12-rainha.jpg";
import imgTecela from "@/assets/labirinto/arquetipo-13-tecela.jpg";
import imgSombria from "@/assets/labirinto/arquetipo-14-sombria.jpg";

const arquetipoImages: Record<number, string> = {
  1: imgSelvagem,
  2: imgSabia,
  3: imgAmante,
  4: imgMae,
  5: imgGuerreira,
  6: imgCurandeira,
  7: imgVisionaria,
  8: imgCriadora,
  9: imgAncia,
  10: imgDonzela,
  11: imgSacerdotisa,
  12: imgRainha,
  13: imgTecela,
  14: imgSombria,
};

interface ArquetipoCardProps {
  arquetipo: LabirintoArquetipo;
}

export function ArquetipoCard({ arquetipo }: ArquetipoCardProps) {
  const { user } = useAuth();
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [polaridadePercebida, setPolaridadePercebida] = useState("");
  const registrarArquetipo = useRegistrarArquetipo();

  const imageSrc = arquetipo.imagem_url || arquetipoImages[arquetipo.ordem] || arquetipoImages[1];

  const handleRegistrar = async () => {
    if (!user) {
      toast.error("Você precisa estar logada para registrar seu padrão.");
      return;
    }

    try {
      await registrarArquetipo.mutateAsync({
        arquetipo_id: arquetipo.id,
        polaridade_percebida: polaridadePercebida || undefined,
      });
      toast.success("Padrão registrado no seu Mapa Pessoal.");
      setShowRegistroModal(false);
      setPolaridadePercebida("");
    } catch (error) {
      toast.error("Erro ao registrar padrão.");
    }
  };

  return (
    <>
      <Card className="border-gold/20 bg-card/80 overflow-hidden hover:border-gold/40 transition-all group">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={imageSrc}
              alt={arquetipo.nome}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            {/* Archetype Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-gold/70 font-medium">
                  {arquetipo.territorio}
                </span>
                <h3 className="font-display text-2xl text-foreground mt-1">
                  {arquetipo.nome}
                </h3>
              </div>
            </div>
          </div>

          {/* Polarity Section */}
          <div className="divide-y divide-gold/10">
            {/* Light */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-4 h-4 text-gold" />
                <span className="text-xs font-medium uppercase tracking-widest text-gold">
                  Luz
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {arquetipo.descricao_luz || "—"}
              </p>
            </div>

            {/* Shadow */}
            <div className="p-5 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <MoonIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Sombra
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {arquetipo.descricao_sombra || "—"}
              </p>
            </div>

            {/* Reflection Question */}
            <div className="p-5 border-t border-gold/10">
              <p className="text-sm italic text-center text-muted-foreground">
                "Como esse arquétipo atua em mim hoje?"
              </p>
            </div>

            {/* Register Button */}
            <div className="p-4">
              <Button
                onClick={() => setShowRegistroModal(true)}
                variant="outline"
                className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 gap-2"
              >
                <BookMarked className="w-4 h-4" />
                Registrar meu padrão
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Modal */}
      <Dialog open={showRegistroModal} onOpenChange={setShowRegistroModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-center">
              Registrar Padrão — {arquetipo.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Como você percebe este arquétipo atuando em você hoje?
            </p>
            <Textarea
              placeholder="Descreva sua percepção livremente..."
              value={polaridadePercebida}
              onChange={(e) => setPolaridadePercebida(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground text-center italic">
              Não há resposta certa. Este é um registro íntimo para seu Mapa Pessoal.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowRegistroModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRegistrar}
              disabled={registrarArquetipo.isPending}
              className="bg-gold hover:bg-gold/90 text-gold-foreground"
            >
              {registrarArquetipo.isPending ? "Registrando..." : "Confirmar Registro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
