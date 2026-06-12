import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Info, Sparkles, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JardimInput } from '@/components/clube/JardimInput';

interface JardimStepProps {
  type: 'psique' | 'oficio';
  estacaoId: string;
  rotaId: string;
  pergunta: string;
  subperguntas?: string[];
  estacaoNome: string;
  onNext: () => void;
}

export const EstacaoStepJardim: React.FC<JardimStepProps> = ({
  type,
  estacaoId,
  rotaId,
  pergunta,
  subperguntas,
  estacaoNome,
  onNext
}) => {
  const isPsique = type === 'psique';

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      <div className="text-center space-y-8">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 transition-all duration-700 shadow-2xl relative group",
          isPsique 
            ? "bg-gold/10 border-gold/30 text-gold shadow-gold/10" 
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10"
        )}>
          <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-current" />
          {isPsique ? <Flower2 className="w-10 h-10" /> : <Sparkles className="w-10 h-10" />}
        </div>
        
        <div className="space-y-4">
          <span className={cn(
            "text-[10px] uppercase tracking-[0.5em] font-black px-4 py-1 rounded-full border border-current/20 bg-current/5",
            isPsique ? "text-gold" : "text-emerald-400"
          )}>
            Rastro de Integração — Jardim {isPsique ? 'da Psique' : 'do Ofício'}
          </span>
          <h2 className="text-3xl xs:text-4xl md:text-8xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase">
            <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
              {isPsique ? 'Integração Pessoal' : 'Integração do Ofício'}
            </span>
          </h2>
        </div>

        <p className="text-white/40 text-lg max-w-2xl mx-auto font-serif italic leading-relaxed">
          {isPsique 
            ? '“Onde a percepção interna ganha terra e silêncio.”' 
            : '“Onde a prática se torna cartografia e cuidado.”'}
        </p>
      </div>

      <Card className="bg-white/[0.02] border-white/5 p-10 rounded-[40px] space-y-8 relative overflow-hidden">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed">
              {estacaoId === 'clareira-do-chamado' ? (
                isPsique 
                  ? "Qual foi o primeiro sinal de vida que reconheci em mim hoje?" 
                  : "Como diferenciar um desejo autêntico de uma reação ao desconforto?"
              ) : pergunta}
            </h3>
            
            {subperguntas && subperguntas.length > 0 && (
              <div className="space-y-3 pt-2">
                {subperguntas.map((sub, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/40 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/30 mt-2 shrink-0 group-hover:bg-gold/60 transition-colors" />
                    <p className="font-serif italic text-base leading-relaxed">{sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <JardimInput 
              type={type}
              pergunta={pergunta}
              estacaoId={estacaoId}
              pontoId={`estacao:${estacaoId}:${type}`}
              sourceTitle={`${estacaoNome} - ${isPsique ? 'Psique' : 'Ofício'}`}
            />
          </div>
        </div>

        <div className="flex justify-center pt-8 border-t border-white/5">
          <Button
            onClick={onNext}
            variant="ghost"
            className="text-white/40 hover:text-white hover:bg-white/5 rounded-full px-8"
          >
            Próximo Passo <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-400/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
          Seu registro será guardado permanentemente em seu Jardim {isPsique ? 'da Psique' : 'do Ofício'}, 
          permitindo que você acompanhe o amadurecimento desta percepção ao longo de toda a rota.
        </p>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
