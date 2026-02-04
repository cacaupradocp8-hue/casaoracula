import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Import phase images
import fase1Img from "@/assets/labirinto/fase-1-chamado-silenciado.jpg";
import fase2Img from "@/assets/labirinto/fase-2-descida.jpg";
import fase3Img from "@/assets/labirinto/fase-3-fragmentacao.jpg";
import fase4Img from "@/assets/labirinto/fase-4-morte-simbolica.jpg";
import fase5Img from "@/assets/labirinto/fase-5-travessia.jpg";
import fase6Img from "@/assets/labirinto/fase-6-reintegracao.jpg";
import fase7Img from "@/assets/labirinto/fase-7-retorno-sabedoria.jpg";

// Map ordem to local images as fallback
const FASE_IMAGES: Record<number, string> = {
  1: fase1Img,
  2: fase2Img,
  3: fase3Img,
  4: fase4Img,
  5: fase5Img,
  6: fase6Img,
  7: fase7Img,
};

interface FaseCardProps {
  fase: {
    id: string;
    ordem: number;
    nome: string;
    subtitulo?: string | null;
    descricao?: string | null;
    texto_simbolico?: string | null;
    imagem_url?: string | null;
    icone?: string | null;
  };
  isActive: boolean;
  isRegistering: boolean;
  onRegister: (faseId: string) => void;
}

export function FaseCard({ fase, isActive, isRegistering, onRegister }: FaseCardProps) {
  // Use uploaded image if available, otherwise use local fallback
  const imageUrl = fase.imagem_url || FASE_IMAGES[fase.ordem] || fase1Img;
  
  return (
    <Card 
      className={cn(
        "group overflow-hidden border-2 transition-all duration-300",
        "hover:shadow-xl hover:shadow-gold/10",
        isActive 
          ? "border-gold ring-2 ring-gold/30" 
          : "border-gold/20 hover:border-gold/50"
      )}
    >
      {/* Card Image - Tarot Style */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={fase.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-gold text-gold-foreground text-xs font-semibold rounded-full">
              Fase Atual
            </span>
          </div>
        )}
        
        {/* Phase number */}
        <div className="absolute top-3 left-3">
          <span className="w-8 h-8 flex items-center justify-center bg-black/60 border border-gold/50 rounded-full text-gold text-sm font-bold">
            {fase.ordem}
          </span>
        </div>
        
        {/* Phase name at bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="font-display text-xl text-gold drop-shadow-lg">
            {fase.nome}
          </h3>
          {fase.subtitulo && (
            <p className="text-sm text-gold/80 italic mt-1">
              {fase.subtitulo}
            </p>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <CardContent className="p-4 space-y-4 bg-card">
        {/* Symbolic Text */}
        <div className="min-h-[4rem]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {fase.texto_simbolico || fase.descricao || "Texto simbólico em breve..."}
          </p>
        </div>
        
        {/* Register Button */}
        <Button
          onClick={() => onRegister(fase.id)}
          disabled={isRegistering || isActive}
          className={cn(
            "w-full gap-2",
            isActive 
              ? "bg-gold/20 text-gold border border-gold/30" 
              : "bg-gold hover:bg-gold/90 text-gold-foreground"
          )}
          variant={isActive ? "outline" : "default"}
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Registrando...
            </>
          ) : isActive ? (
            "Você está nesta fase"
          ) : (
            "Registrar minha fase"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
