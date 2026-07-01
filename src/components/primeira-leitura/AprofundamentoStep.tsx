import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AprofundamentoStepProps {
  onContinue: (resposta: 'sim' | 'talvez') => void;
}

type Resposta = 'sim' | 'talvez';
type Scene = 1 | 2 | 3 | 4 | 5;

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const AprofundamentoStep: React.FC<AprofundamentoStepProps> = ({ onContinue }) => {
  const [scene, setScene] = useState<Scene>(1);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [showEchoButton, setShowEchoButton] = useState(false);

  // Scene 1 → 2
  useEffect(() => {
    if (scene !== 1) return;
    const t = setTimeout(() => setScene(2), 7500);
    return () => clearTimeout(t);
  }, [scene]);

  // Scene 2 → 3 (total ~ 12s: A 4.5s + B 4x1.2s + last 2s + pausa)
  useEffect(() => {
    if (scene !== 2) return;
    const t = setTimeout(() => setScene(3), 13500);
    return () => clearTimeout(t);
  }, [scene]);

  // Scene 3 → 4 (3 frases * 2.2s + 3.5s de permanência)
  useEffect(() => {
    if (scene !== 3) return;
    const t = setTimeout(() => setScene(4), 10500);
    return () => clearTimeout(t);
  }, [scene]);

  // Scene 5: mostrar botão depois de 2.5s
  useEffect(() => {
    if (scene !== 5) return;
    setShowEchoButton(false);
    const t = setTimeout(() => setShowEchoButton(true), 2500);
    return () => clearTimeout(t);
  }, [scene]);

  const handleChoice = (r: Resposta) => {
    setResposta(r);
    setScene(5);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-6 py-16 text-center">
      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.div key="s1" {...fade} transition={{ duration: 1.6 }} className="space-y-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="font-serif italic text-primary/80 text-lg md:text-xl leading-relaxed"
            >
              A sua primeira leitura foi importante.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 3.5 }}
              className="font-serif italic text-primary/70 text-lg md:text-xl leading-relaxed"
            >
              Agora deixe a Casa fazer apenas uma pergunta.
            </motion.p>
          </motion.div>
        )}

        {scene === 2 && (
          <motion.div key="s2" {...fade} transition={{ duration: 1.6 }} className="space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6 }}
              className="font-serif text-foreground/85 text-base md:text-lg leading-loose space-y-3"
            >
              <p>Imagine que alguns meses se passaram.</p>
              <p>Você continua encontrando Marina.</p>
              <p>A cada encontro, outras partes da história começam a aparecer.</p>
            </motion.div>

            <div className="space-y-4">
              {['Silêncios.', 'Contradições.', 'Pequenos gestos.', 'Proteções.'].map((w, i) => (
                <motion.p
                  key={w}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 4.5 + i * 1.2 }}
                  className="font-serif italic text-primary/75 text-lg md:text-xl"
                >
                  {w}
                </motion.p>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 4.5 + 4 * 1.2 + 0.5 }}
              className="font-serif text-foreground/75 text-base md:text-lg leading-relaxed pt-4"
            >
              Aquilo que, no primeiro encontro, ainda não podia ser visto.
            </motion.p>
          </motion.div>
        )}

        {scene === 3 && (
          <motion.div key="s3" {...fade} transition={{ duration: 1.6 }} className="space-y-10">
            {['A mesma mulher.', 'A mesma história.', 'Mas será a mesma leitura?'].map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: i * 2.2 }}
                className={
                  i === 2
                    ? 'font-display text-primary text-2xl md:text-3xl leading-snug'
                    : 'font-serif text-foreground/85 text-xl md:text-2xl leading-snug'
                }
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}

        {scene === 4 && (
          <motion.div key="s4" {...fade} transition={{ duration: 1.4 }} className="space-y-10 w-full">
            <h2 className="font-display text-primary text-xl md:text-2xl">O que sua escuta faria?</h2>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleChoice('sim')}
                className="p-6 rounded-2xl border border-primary/15 bg-card/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 text-left font-serif text-foreground/85 text-base md:text-lg leading-relaxed"
              >
                Minha leitura permaneceria praticamente igual.
              </button>
              <button
                onClick={() => handleChoice('talvez')}
                className="p-6 rounded-2xl border border-primary/15 bg-card/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 text-left font-serif text-foreground/85 text-base md:text-lg leading-relaxed"
              >
                Eu começaria a procurar novas possibilidades.
              </button>
            </div>
          </motion.div>
        )}

        {scene === 5 && resposta && (
          <motion.div key="s5" {...fade} transition={{ duration: 1.8 }} className="space-y-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8 }}
              className="font-serif italic text-foreground/85 text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
            >
              {resposta === 'sim'
                ? 'Sustentar uma primeira impressão também faz parte da escuta. A Casa apenas convida você a descobrir quando ela pode crescer.'
                : 'Uma boa escuta nem sempre muda de direção. Às vezes ela apenas ganha profundidade.'}
            </motion.p>

            <AnimatePresence>
              {showEchoButton && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => onContinue(resposta)}
                    className="text-primary/80 hover:text-primary text-xs uppercase tracking-[0.3em] font-display transition-all"
                  >
                    Continuar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
