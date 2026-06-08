import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface EstacaoProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  onBack: () => void;
}

export const EstacaoProgressHeader: React.FC<EstacaoProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  progressPercentage,
  onBack
}) => {
  return (
    <div className="mb-12 space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar</span>
        </button>
        
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
    </div>
  );
};
