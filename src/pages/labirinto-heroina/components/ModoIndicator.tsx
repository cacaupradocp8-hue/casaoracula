// ============================================
// INDICADOR DE MODO ATIVO — LABIRINTO DA HEROÍNA INTERNA®
// Mostra o modo atual e permite alternar
// ============================================

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Stethoscope, ArrowLeftRight } from "lucide-react";
import type { LabirintoModo } from "./ModoSelector";

interface ModoIndicatorProps {
  modo: LabirintoModo;
  onSwitch: () => void;
}

export function ModoIndicator({ modo, onSwitch }: ModoIndicatorProps) {
  const isPessoal = modo === "pessoal";

  return (
    <div className="flex items-center justify-between">
      <Badge 
        variant="outline" 
        className="gap-2 px-3 py-1.5 border-gold/30 text-gold bg-gold/5"
      >
        {isPessoal ? (
          <Heart className="w-3.5 h-3.5" />
        ) : (
          <Stethoscope className="w-3.5 h-3.5" />
        )}
        {isPessoal ? "Modo Pessoal" : "Modo Profissional"}
      </Badge>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSwitch}
        className="gap-2 text-xs text-muted-foreground hover:text-gold"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Alternar modo
      </Button>
    </div>
  );
}
