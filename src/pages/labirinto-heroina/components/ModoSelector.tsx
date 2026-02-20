// ============================================
// SELEÇÃO DE MODO — LABIRINTO DA HEROÍNA INTERNA®
// Pessoal (autodescoberta) ou Profissional (suporte clínico)
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope } from "lucide-react";

export type LabirintoModo = "pessoal" | "profissional";

interface ModoSelectorProps {
  onSelect: (modo: LabirintoModo) => void;
}

export function ModoSelector({ onSelect }: ModoSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h3 className="font-display text-xl text-gold">
          Como deseja atravessar o Labirinto?
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Escolha o modo que melhor corresponde à sua intenção neste momento.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Modo Pessoal */}
        <button
          onClick={() => onSelect("pessoal")}
          className="text-left group"
        >
          <Card className="h-full border-gold/20 bg-card/50 hover:bg-card/80 hover:border-gold/40 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-gold/5">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h4 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                  Modo Pessoal
                </h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Para sua jornada de autodescoberta. Registro pessoal e PDF ritual simplificado.
                </p>
              </div>
              <p className="text-xs text-gold/50 opacity-0 group-hover:opacity-100 transition-opacity">
                Entrar como viajante →
              </p>
            </CardContent>
          </Card>
        </button>

        {/* Modo Profissional */}
        <button
          onClick={() => onSelect("profissional")}
          className="text-left group"
        >
          <Card className="h-full border-gold/20 bg-card/50 hover:bg-card/80 hover:border-gold/40 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-gold/5">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Stethoscope className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h4 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                  Modo Profissional
                </h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Para terapeutas e facilitadoras. Ficha clínica, observações e guia da terapeuta.
                </p>
              </div>
              <p className="text-xs text-gold/50 opacity-0 group-hover:opacity-100 transition-opacity">
                Entrar como terapeuta →
              </p>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}
