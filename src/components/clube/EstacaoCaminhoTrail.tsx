import React from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Eye, 
  Sword, 
  Sparkles, 
  Radar, 
  Flower2, 
  Target, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const steps = [
  { label: 'Áudios', icon: Headphones },
  { label: 'Caso', icon: Eye },
  { label: 'Desafio', icon: Sword },
  { label: 'Revelação', icon: Sparkles },
  { label: 'Ferramenta', icon: Radar },
  { label: 'Jardim Psique', icon: Flower2 },
  { label: 'Jardim Ofício', icon: Flower2 },
  { label: 'Missão', icon: Target },
  { label: 'Fechamento', icon: CheckCircle2 }
];

export function EstacaoCaminhoTrail() {
  return (
    <div className="relative w-full overflow-x-auto pb-12 no-scrollbar">
      <div className="flex items-center justify-between min-w-[900px] px-8 py-4">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-4 group cursor-default"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gold/10 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
                <div className="relative w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-gold/40 group-hover:bg-gold/5 transition-all duration-300 shadow-inner">
                  <step.icon className="w-7 h-7 text-white/20 group-hover:text-gold/80 transition-colors duration-300" />
                </div>
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 font-bold group-hover:text-gold/70 transition-colors duration-300 whitespace-nowrap">
                {step.label}
              </span>
            </motion.div>
            
            {i < steps.length - 1 && (
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-[40px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent self-center" />
                <ChevronRight className="w-4 h-4 text-white/5" />
                <div className="w-full max-w-[40px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent self-center" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
