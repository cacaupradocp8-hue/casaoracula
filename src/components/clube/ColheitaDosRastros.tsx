import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  useColheitaConfig,
  useColheitaRegistro,
  useSubmitColheita,
} from '@/hooks/useColheitaRastros';

interface Props {
  estacaoId: string;
  rotaId?: string | null;
  estacaoNome: string;
  onComplete?: () => void;
}

export function ColheitaDosRastros({ estacaoId, rotaId, estacaoNome, onComplete }: Props) {
  const { data: config, isLoading } = useColheitaConfig(estacaoId);
  const { data: registroAnterior } = useColheitaRegistro(estacaoId);
  const submit = useSubmitColheita();

  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [valor, setValor] = useState('');
  const [recolhido, setRecolhido] = useState(false);

  if (isLoading || !config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Leaf className="w-8 h-8 text-gold/40 animate-pulse" />
      </div>
    );
  }

  if (!config.ativo) {
    return null;
  }

  const perguntas = [...(config.perguntas || [])].sort((a, b) => a.ordem - b.ordem);
  const atual = perguntas[step];
  const isLast = step === perguntas.length - 1;
  const jaRecolheu = !!registroAnterior?.concluido && !recolhido;

  const handleAvancar = () => {
    const v = valor.trim();
    if (atual.obrigatoria && !v) {
      toast.error('Esta pergunta pede uma palavra.');
      return;
    }
    const novas = { ...respostas, [atual.id]: v };
    setRespostas(novas);
    setValor('');
    if (!isLast) {
      setStep(step + 1);
    } else {
      finalizar(novas);
    }
  };

  const finalizar = async (resp: Record<string, string>) => {
    try {
      await submit.mutateAsync({
        estacaoId,
        rotaId,
        estacaoNome,
        respostas: resp,
        perguntas,
        salvarJardim: config.salvar_jardim_oficio,
      });
      setRecolhido(true);
      toast.success('Rastro recolhido. A Casa guardou.');
      setTimeout(() => onComplete?.(), 1800);
    } catch (e: any) {
      toast.error('Não foi possível guardar o rastro. ' + (e.message || ''));
    }
  };

  if (recolhido || jaRecolheu) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center">
            <Check className="w-7 h-7 text-gold" />
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Rastro Recolhido</h3>
          <p className="text-white/60 font-serif italic">
            A Casa recebeu seus rastros desta estação.
          </p>
          {onComplete && (
            <Button variant="ghost" onClick={onComplete} className="text-white/60">
              Seguir <ArrowRight className="ml-2 w-3 h-3" />
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-10">
        {/* Abertura — visível na primeira pergunta */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center mb-2">
              <Leaf className="w-7 h-7 text-gold/50 animate-pulse" />
            </div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">
              {config.titulo}
            </h2>
            <p className="text-white/60 font-serif italic whitespace-pre-line leading-relaxed text-sm">
              {config.texto_abertura}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={atual.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed text-center">
              "{atual.texto}"
            </p>

            <textarea
              autoFocus
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Escreva aquilo que pede escuta..."
              className="w-full bg-transparent border-b border-white/10 py-4 text-lg font-serif italic focus:outline-none focus:border-gold/50 transition-colors resize-none h-28"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAvancar();
                }
              }}
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-white/30 font-black tracking-widest uppercase">
                {step + 1} / {perguntas.length}
              </span>

              {isLast ? (
                <Button
                  variant="gold"
                  size="lg"
                  disabled={submit.isPending}
                  onClick={handleAvancar}
                  className="uppercase tracking-[0.25em] text-xs font-black shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Recolher Rastro
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleAvancar}
                  className="text-gold/80 hover:text-gold uppercase tracking-[0.2em] text-[10px] font-black group"
                >
                  Próximo rastro
                  <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
