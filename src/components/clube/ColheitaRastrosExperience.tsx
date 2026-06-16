import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';

export function ColheitaRastrosExperience({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [value, setValue] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      id: 'rastro_1',
      text: "Ao caminhar pela primeira estação, o que você percebeu que estava 'soterrado' em sua própria escuta?",
      placeholder: "Escreva livremente — ou inspire-se nas sugestões abaixo.",
      sugestoes: [
        "Um silêncio que eu costumava preencher com pressa.",
        "O julgamento sutil que antecede a escuta.",
        "A vontade de resolver antes de compreender.",
        "Uma parte de mim que ainda funciona no automático.",
      ],
    },
    {
      id: 'rastro_2',
      text: "Qual símbolo ou imagem da Clareira do Chamado mais reverberou em seu corpo hoje?",
      placeholder: "Descreva a imagem — ou escolha um ponto de partida.",
      sugestoes: [
        "A loba que recolhe os ossos.",
        "O uivo que reconhece o que estava esquecido.",
        "A terra fria antes da vida retornar.",
        "O rastro que só aparece quando se caminha devagar.",
      ],
    },
    {
      id: 'rastro_3',
      text: "Se você pudesse levar apenas uma semente dessa experiência para a sua prática, qual seria ela?",
      placeholder: "Uma frase curta basta — ou escolha uma direção.",
      sugestoes: [
        "Sustentar o silêncio um pouco mais antes de intervir.",
        "Trocar a pergunta 'o que fazer?' por 'o que escuto?'.",
        "Honrar o tempo simbólico da cliente.",
        "Não traduzir o símbolo cedo demais.",
      ],
    },
  ];

  const current = questions[step];

  const handleNext = () => {
    const next = [...answers, value];
    setAnswers(next);
    setValue('');
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <ElectricWaves />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-6">
                <Leaf className="w-8 h-8 text-gold/50 animate-pulse" />
              </div>
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">
                Colheita de Rastros
              </h2>
              <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed">
                "{current.text}"
              </p>
            </div>

            <div className="space-y-6">
              <textarea
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={current.placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-base md:text-lg font-serif italic focus:outline-none focus:border-gold/60 focus:bg-white/[0.05] transition-all resize-none h-36 placeholder:text-white/30"
              />

              {/* Sugestões de resposta */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold/70 font-bold">
                  <Sparkles className="w-3 h-3" />
                  Sugestões para começar
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.sugestoes.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setValue(s)}
                      className="text-left text-xs md:text-sm text-white/75 bg-white/[0.04] hover:bg-gold/10 hover:text-white hover:border-gold/40 border border-white/10 rounded-full px-4 py-2 transition-all font-cormorant italic"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 italic">
                  As sugestões são pontos de partida — sinta-se livre para editar ou escrever do zero.
                </p>
              </div>

              {/* Botão principal — bem visível */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!value.trim()}
                  className="w-full md:w-auto rounded-full bg-gold text-[#020617] font-black px-12 h-14 hover:bg-gold/90 shadow-[0_10px_40px_rgba(212,175,55,0.4)] active:scale-95 transition-all text-xs tracking-[0.25em] uppercase group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step < questions.length - 1 ? 'Colher rastro' : 'Concluir colheita'}
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <span className="text-[10px] text-white/40 font-black tracking-[0.3em] uppercase">
                  Rastro {step + 1} de {questions.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
