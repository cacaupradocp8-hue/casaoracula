// ============================================
// SELEÇÃO DE CARTA/PORTA — LABIRINTO PRÁTICO
// Grid de cartas com efeito flip (verso → frente)
// ============================================

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

// Verso (igual para todas)
import cartaVerso from "@/assets/portas/carta-verso.png";

// Frentes individuais
import porta01 from "@/assets/portas/porta-01-o-chamado.png";
import porta02 from "@/assets/portas/porta-02-a-ruptura.png";
import porta03 from "@/assets/portas/porta-03-a-descida.png";
import porta04 from "@/assets/portas/porta-04-o-labirinto.png";
import porta05 from "@/assets/portas/porta-05-o-osso.png";
import porta06 from "@/assets/portas/porta-06-a-memoria.png";
import porta07 from "@/assets/portas/porta-07-a-ferida.png";
import porta08 from "@/assets/portas/porta-08-a-defesa.png";
import porta09 from "@/assets/portas/porta-09-o-espelho.png";
import porta10 from "@/assets/portas/porta-10-a-escolha.png";
import porta11 from "@/assets/portas/porta-11-a-integracao.png";
import porta12 from "@/assets/portas/porta-12-a-voz.png";
import porta13 from "@/assets/portas/porta-13-o-retorno.png";
import porta14 from "@/assets/portas/porta-14-a-guardia.png";

const PORTA_IMAGES: Record<number, string> = {
  1: porta01,
  2: porta02,
  3: porta03,
  4: porta04,
  5: porta05,
  6: porta06,
  7: porta07,
  8: porta08,
  9: porta09,
  10: porta10,
  11: porta11,
  12: porta12,
  13: porta13,
  14: porta14,
};

interface PortaSelecaoProps {
  portas: LabirintoFase[];
  onSelect: (portaId: string) => void;
}

export function PortaSelecao({ portas, onSelect }: PortaSelecaoProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const portasUnicas = portas.reduce((acc, porta) => {
    if (!acc.find(p => p.nome === porta.nome)) {
      acc.push(porta);
    }
    return acc;
  }, [] as LabirintoFase[]);

  const handleCardClick = (porta: LabirintoFase) => {
    if (flippedCards.has(porta.id)) {
      // Already flipped → navigate
      onSelect(porta.id);
    } else {
      // First click → flip
      setFlippedCards(prev => new Set(prev).add(porta.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-gold">
          Escolha uma Porta da Jornada
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Toque em uma carta para revelá-la. Toque novamente para atravessar.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {portasUnicas.map((porta) => {
          const isFlipped = flippedCards.has(porta.id);
          const frontImage = PORTA_IMAGES[porta.ordem] || porta01;

          return (
            <button
              key={porta.id}
              onClick={() => handleCardClick(porta)}
              className="group focus:outline-none"
              style={{ perspective: "800px" }}
            >
              <div
                className="relative w-[140px] h-[210px] sm:w-[160px] sm:h-[240px] transition-transform duration-700 ease-in-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* VERSO (back of card — visible initially) */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-lg shadow-black/30 group-hover:shadow-gold/20 transition-shadow duration-300"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={cartaVerso}
                    alt="Carta do Labirinto"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* FRENTE (front of card — visible after flip) */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-lg shadow-black/30"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <img
                    src={frontImage}
                    alt={porta.nome}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Name overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                    <p className="text-xs font-display text-gold text-center leading-tight">
                      {porta.nome}
                    </p>
                  </div>
                  {/* Hint to enter */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-gold/80 bg-black/60 px-1.5 py-0.5 rounded">
                      Atravessar →
                    </span>
                  </div>
                </div>
              </div>

              {/* Card number below */}
              <p className="text-[10px] text-muted-foreground/60 text-center mt-2 font-mono">
                {porta.ordem}
              </p>
            </button>
          );
        })}
      </div>

      {portasUnicas.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Nenhuma porta configurada ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
