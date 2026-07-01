import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AprofundamentoStepProps {
  onContinue: (resposta: 'sim' | 'talvez') => void;
}

type Resposta = 'sim' | 'talvez';

const microDevolutivas: Record<Resposta, string> = {
  sim: 'Isso revela que sua escuta tende a confiar bastante na primeira impressão. Na Casa Orácula aprenderemos quando aprofundá-la e quando permitir que ela seja ampliada.',
  talvez: 'Isso revela abertura para sustentar novas possibilidades antes de concluir uma leitura. Na Casa Orácula aprendemos que ampliar uma percepção não significa abandonar a anterior.',
};

export const AprofundamentoStep: React.FC<AprofundamentoStepProps> = ({ onContinue }) => {
  const [resposta, setResposta] = useState<Resposta | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="flex flex-col items-center space-y-12 py-12 px-6 max-w-3xl mx-auto w-full"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="text-center font-serif italic text-primary/70 text-base md:text-lg leading-relaxed"
      >
        A sua primeira leitura foi importante.
        <br />
        Agora permita que a Casa lhe faça outra pergunta.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.9 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl md:text-3xl font-display text-primary leading-tight">
          Toda história admite mais de uma leitura.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.4 }}
        className="space-y-5 text-foreground/80 font-serif text-base md:text-lg leading-relaxed max-w-2xl text-center"
      >
        <p>Até aqui você respondeu apenas com aquilo que sua escuta percebeu primeiro.</p>
        <p>É exatamente assim que começamos a observar uma história.</p>
        <p>Mas, na prática clínica, raramente permanecemos apenas na primeira impressão.</p>
        <p className="text-primary/85">
          À medida que conhecemos melhor uma pessoa, novas informações começam a aparecer.
          <br />
          Elas não anulam a primeira leitura — ampliam aquilo que conseguimos perceber.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 2.2 }}
        className="w-full max-w-2xl pt-4 space-y-6"
      >
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />

        <h3 className="text-center text-xs uppercase tracking-[0.3em] text-primary/60">Reflexão</h3>

        <p className="text-center font-serif text-lg md:text-xl text-foreground/90 leading-relaxed">
          Imagine que, ao longo do acompanhamento, você descobrisse novos elementos sobre Marina.
          <br />
          <span className="text-primary/90">Sua primeira leitura permaneceria exatamente igual?</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {([
            { id: 'sim' as Resposta, titulo: 'Sim.', sub: 'Minha leitura continuaria praticamente a mesma.' },
            { id: 'talvez' as Resposta, titulo: 'Talvez.', sub: 'Acho que começaria a observar outras possibilidades.' },
          ]).map((opt) => {
            const active = resposta === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setResposta(opt.id)}
                className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-500 ${
                  active
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-primary/10 bg-card/40 hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                <span className="font-display text-primary text-lg">{opt.titulo}</span>
                <span className="text-sm text-foreground/70 mt-1">{opt.sub}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {resposta && (
            <motion.div
              key={resposta}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-6 space-y-6"
            >
              <p className="font-serif italic text-base md:text-lg text-foreground/85 leading-relaxed text-center max-w-xl mx-auto">
                {microDevolutivas[resposta]}
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => onContinue(resposta)}
                  className="px-8 py-3 rounded-full bg-primary/90 text-primary-foreground text-sm uppercase tracking-[0.2em] font-display hover:bg-primary transition-all"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
