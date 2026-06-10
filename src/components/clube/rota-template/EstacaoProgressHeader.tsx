import React, { useState } from 'react';
import { ChevronLeft, List, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EstacaoProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  onBack: () => void;
  steps: { id: string, title: string }[];
  onJumpToStep: (step: number) => void;
}

export const EstacaoProgressHeader: React.FC<EstacaoProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  progressPercentage,
  onBack,
  steps,
  onJumpToStep
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mb-12 space-y-4 relative z-[100]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {currentStep > 0 && (
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold hover:text-gold transition-colors"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar</span>
            </button>
          )}

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all px-3 py-1 rounded-full border",
              isMenuOpen ? "bg-gold text-midnight border-gold" : "text-white/40 border-white/10 hover:border-gold/30 hover:text-gold"
            )}
          >
            <List className="w-3 h-3" />
            <span>Etapas</span>
          </button>
        </div>
        
        <div className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
          Rastro {currentStep + 1} de {totalSteps}
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-white/[0.03]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-gradient-to-r from-gold/40 via-gold to-gold/40 relative"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_infinite_linear]" />
          <div className="absolute inset-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 left-0 w-full max-w-sm bg-[#0A0A0B]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/50"
          >
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-[10px] text-gold/60 uppercase tracking-widest font-black mb-4 px-2">Mapa da Estação</h4>
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      onJumpToStep(idx);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                      isCurrent ? "bg-gold/10 border border-gold/20" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                        isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        isCurrent ? "bg-gold/20 border-gold/40 text-gold" :
                        "bg-white/5 border-white/10 text-white/20"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : 
                         isCurrent ? <Clock className="w-3 h-3" /> :
                         <Circle className="w-2 h-2" />}
                      </div>
                      <span className={cn(
                        "text-xs font-serif italic transition-colors",
                        isCurrent ? "text-white" : "text-white/40 group-hover:text-white/60"
                      )}>
                        {step.title}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[8px] uppercase tracking-widest font-black text-gold animate-pulse">Agora</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

