// ============================================
// GUARDIÃ DO JARDIM — COMPONENTE DE IA CONTIDA
// ============================================
// Esta IA NÃO interpreta, NÃO orienta, NÃO aprofunda.
// Ela apenas sustenta o campo com frases pré-definidas.
//
// REGRAS ABSOLUTAS:
// - Nunca substitui a terapeuta
// - Nunca responde perguntas
// - Nunca estimula catarse
// - Nunca "conversa" livremente
// - Fala pouco. E quando fala, organiza o espaço.

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  GUARDIA_FRASES, 
  isPrazoProximo, 
  isJardimExpirado,
  type GuardiaMomento 
} from './guardia-jardim-frases';
import type { JardimHeroinaStatus } from '@/types/jardim-heroina-novo';

interface GuardiaJardimProps {
  status: JardimHeroinaStatus;
  prazoDate?: string | null;
  isEscritaLonga?: boolean;
  className?: string;
}

/**
 * Guardiã do Jardim
 * 
 * Componente de IA simbólica que exibe mensagens contextuais
 * baseadas no estado do Jardim. Não há interatividade ou
 * personalização — apenas frases fixas que sustentam o campo.
 */
export function GuardiaJardim({ 
  status, 
  prazoDate, 
  isEscritaLonga = false,
  className 
}: GuardiaJardimProps) {
  
  // Determina qual frase exibir baseado no contexto
  const momento = useMemo((): GuardiaMomento => {
    // Jardim fechado tem prioridade máxima
    if (status === 'closed') {
      return 'jardim_fechado';
    }
    
    // Jardim inativo não mostra nada (retorna entrada como fallback)
    if (status === 'inactive') {
      return 'entrada';
    }
    
    // Verifica se prazo expirou
    if (isJardimExpirado(prazoDate)) {
      return 'fechamento';
    }
    
    // Verifica se prazo está próximo
    if (isPrazoProximo(prazoDate)) {
      return 'prazo_proximo';
    }
    
    // Verifica escrita longa
    if (isEscritaLonga) {
      return 'escrita_longa';
    }
    
    // Default: entrada
    return 'entrada';
  }, [status, prazoDate, isEscritaLonga]);
  
  // Não exibe nada se jardim inativo
  if (status === 'inactive') {
    return null;
  }
  
  const frase = GUARDIA_FRASES[momento];
  
  return (
    <Card 
      className={cn(
        "border-gold/20 bg-gradient-to-r from-gold/5 via-transparent to-transparent",
        status === 'closed' && "opacity-70",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Ícone da Guardiã */}
          <span className="text-lg flex-shrink-0" aria-hidden="true">
            {frase.icone}
          </span>
          
          {/* Mensagem */}
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            {frase.texto}
          </p>
        </div>
        
        {/* Assinatura sutil — nunca altere */}
        <div className="mt-3 pt-2 border-t border-gold/10 text-right">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            Guardiã do Jardim
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Hook para detectar escrita longa em campos
 */
export function useGuardiaEscritaLonga(
  textos: (string | null | undefined)[],
  limites: number[]
): boolean {
  return useMemo(() => {
    return textos.some((texto, index) => {
      if (!texto) return false;
      const limite = limites[index];
      if (!limite) return false;
      return texto.length > limite * 0.85; // 85% do limite
    });
  }, [textos, limites]);
}
