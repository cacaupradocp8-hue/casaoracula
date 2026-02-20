// ============================================
// SELEÇÃO DE MODO — LABIRINTO DA HEROÍNA INTERNA®
// Pessoal (autodescoberta) ou Profissional (suporte clínico)
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export type LabirintoModo = "pessoal" | "profissional";

interface ModoSelectorProps {
  onSelect: (modo: LabirintoModo) => void;
}

export function ModoSelector({ onSelect }: ModoSelectorProps) {
  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/50 text-xs tracking-[0.3em] uppercase">Intenção</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <h3 className="font-display text-2xl text-gold">
          Como deseja atravessar o Labirinto?
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Escolha o modo que melhor corresponde à sua intenção neste momento.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Modo Pessoal */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => onSelect("pessoal")}
          className="text-left group"
        >
          <Card className="h-full border-gold/20 bg-gradient-to-b from-card/80 to-card/40 hover:border-gold/50 transition-all duration-500 cursor-pointer group-hover:shadow-xl group-hover:shadow-gold/10 relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30 rounded-br-lg" />
            
            <CardContent className="p-10 flex flex-col items-center text-center space-y-5 relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-500">
                  <Heart className="w-9 h-9 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                {/* Pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-gold/20"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-xl text-foreground group-hover:text-gold transition-colors duration-300">
                  Modo Pessoal
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Para sua jornada de autodescoberta. Registro pessoal e PDF ritual simplificado.
                </p>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              <p className="text-xs text-gold/60 group-hover:text-gold transition-colors">
                Entrar como viajante →
              </p>
            </CardContent>
          </Card>
        </motion.button>

        {/* Modo Profissional */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          onClick={() => onSelect("profissional")}
          className="text-left group"
        >
          <Card className="h-full border-gold/20 bg-gradient-to-b from-card/80 to-card/40 hover:border-gold/50 transition-all duration-500 cursor-pointer group-hover:shadow-xl group-hover:shadow-gold/10 relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30 rounded-br-lg" />

            <CardContent className="p-10 flex flex-col items-center text-center space-y-5 relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-500">
                  <Stethoscope className="w-9 h-9 text-gold group-hover:scale-110 transition-transform duration-500" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full border border-gold/20"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-xl text-foreground group-hover:text-gold transition-colors duration-300">
                  Modo Profissional
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Para terapeutas e facilitadoras. Ficha clínica, observações e guia da terapeuta.
                </p>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              <p className="text-xs text-gold/60 group-hover:text-gold transition-colors">
                Entrar como terapeuta →
              </p>
            </CardContent>
          </Card>
        </motion.button>
      </div>
    </div>
  );
}
