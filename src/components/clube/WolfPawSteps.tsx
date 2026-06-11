import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PawStep {
  id: number;
  x: number;
  y: number;
  rotation: number;
  side: 'left' | 'right';
  delay: number;
}

function WolfPawSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 70"
      fill="currentColor"
      className={className}
    >
      {/* Almofada principal */}
      <ellipse cx="30" cy="45" rx="14" ry="18" />
      {/* Dedos */}
      <ellipse cx="14" cy="22" rx="5" ry="12" transform="rotate(-15 14 22)" />
      <ellipse cx="26" cy="16" rx="5" ry="14" />
      <ellipse cx="38" cy="18" rx="5" ry="13" transform="rotate(10 38 18)" />
      <ellipse cx="48" cy="26" rx="4.5" ry="11" transform="rotate(25 48 26)" />
      {/* Unhas sutil */}
      <path d="M11 12 L13 8 L15 13" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M24 6 L26 2 L28 7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M36 8 L38 4 L40 9" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M46 16 L48 12 L50 17" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

export function WolfPawSteps() {
  const [steps, setSteps] = useState<PawStep[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Inicia após um breve delay para a página carregar
    const startTimer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;

    // Gera uma trilha de pegadas que atravessa a tela
    const pawSteps: PawStep[] = [];
    const stepCount = 24;
    
    for (let i = 0; i < stepCount; i++) {
      const progress = i / stepCount;
      // Caminho sinuoso de baixo para cima, da esquerda para a direita
      const baseX = 5 + progress * 85; // 5% a 90% da largura
      const baseY = 75 - progress * 55 + Math.sin(progress * Math.PI * 3) * 8;
      
      pawSteps.push({
        id: i,
        x: baseX + (i % 2 === 0 ? -2 : 2), // left/right offset
        y: baseY,
        rotation: -25 + Math.sin(progress * Math.PI * 2) * 15,
        side: i % 2 === 0 ? 'left' : 'right',
        delay: i * 0.35,
      });
    }

    setSteps(pawSteps);
  }, [started]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.15, 0.12, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                delay: step.delay,
                duration: 4,
                times: [0, 0.15, 0.6, 1],
                ease: "easeInOut",
              },
              scale: {
                delay: step.delay,
                duration: 0.8,
                ease: "easeOut",
              },
            }}
            className="absolute"
            style={{
              left: `${step.x}%`,
              top: `${step.y}%`,
            }}
          >
            <motion.div
              animate={{ rotate: step.rotation }}
              transition={{ delay: step.delay, duration: 0.5 }}
            >
              <WolfPawSVG 
                className={`w-8 h-10 md:w-12 md:h-14 ${
                  step.side === 'left' 
                    ? 'text-gold/[0.08]' 
                    : 'text-gold/[0.06]'
                }`}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function WolfPawStepsLoop() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return <WolfPawSteps key={key} />;
}
