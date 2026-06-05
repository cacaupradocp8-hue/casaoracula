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
    <div className="relative w-full overflow-x-auto pb-8 no-scrollbar">
      <div className="flex items-center justify-between min-w-[800px] px-4">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-gold/30 group-hover:bg-gold/5 transition-all">
                <step.icon className="w-6 h-6 text-white/40 group-hover:text-gold/60 transition-colors" />
              </div>
              <span className="text-[10px] tracking-widest uppercase text-white/30 font-medium group-hover:text-white/60 transition-colors">
                {step.label}
              </span>
            </motion.div>
            
            {i < steps.length - 1 && (
              <div className="flex-1 flex justify-center">
                <ChevronRight className="w-4 h-4 text-white/10" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
