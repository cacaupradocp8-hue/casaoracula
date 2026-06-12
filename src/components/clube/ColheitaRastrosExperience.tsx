import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, Sparkles, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';

export function ColheitaRastrosExperience({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setSteps] = useState<string[]>([]);

  const questions = [
    {
      id: 'rastro_1',
      text: "Ao caminhar pela primeira estação, o que você percebeu que estava 'soterrado' em sua própria escuta?",
      placeholder: "Um silêncio, uma pressa, um julgamento..."
    },
    {
      id: 'rastro_2',
      text: "Qual símbolo ou imagem da Clareira do Chamado mais reverberou em seu corpo hoje?",
      placeholder: "A loba, o rastro, o uivo, a terra..."
    },
    {
      id: 'rastro_3',
      text: "Se você pudesse levar apenas uma semente dessa experiência para a sua prática, qual seria ela?",
      placeholder: "Uma nova pergunta, uma pausa, um olhar..."
    }
  ];

  const handleNext = (answer: string) => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <ElectricWaves />
      </div>

      <div className="relative z-10 max-w-xl w-full space-y-12">
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
                <Leaf className="w-8 h-8 text-gold/40 animate-pulse" />
              </div>
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Colheita de Rastros</h2>
              <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed">
                "{questions[step].text}"
              </p>
            </div>

            <div className="space-y-8">
              <textarea
                autoFocus
                placeholder={questions[step].placeholder}
                className="w-full bg-transparent border-b border-white/10 py-4 text-lg font-serif italic focus:outline-none focus:border-gold/50 transition-colors resize-none h-32"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNext((e.target as HTMLTextAreaElement).value);
                    (e.target as HTMLTextAreaElement).value = '';
                  }
                }}
              />

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">
                  {step + 1} / {questions.length}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    handleNext(textarea?.value || '');
                    if (textarea) textarea.value = '';
                  }}
                  className="text-gold uppercase tracking-[0.2em] text-[10px] font-black group"
                >
                  Colher rastro
                  <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
