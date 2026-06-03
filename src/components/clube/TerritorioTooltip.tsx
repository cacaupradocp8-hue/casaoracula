import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CIDADELA_TERRITORIOS } from '@/types/cidadela-territorios';

interface Props {
  territorioId: string;
  children: React.ReactNode;
}

export function TerritorioTooltip({ territorioId, children }: Props) {
  const t = CIDADELA_TERRITORIOS.find(item => item.id === territorioId);
  if (!t) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-midnight border-gold/20 p-4 max-w-xs space-y-2">
          <p className="font-display text-gold text-sm">{t.nome}</p>
          <p className="text-white/70 text-xs italic">"{t.microcopy}"</p>
          <div className="pt-2 border-t border-white/5">
             <p className="text-[10px] text-white/40 uppercase tracking-widest">{t.funcao_simbolica}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
