import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Headphones, 
  Star, 
  FlaskConical, 
  Flower2, 
  MessageSquare, 
  Zap,
  Check,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'recommended';

export interface TravessiaStep {
  id: string;
  label: string;
  icon: any;
  status: StepStatus;
  description?: string;
}

interface ClubeTravessiaProgressProps {
  steps: TravessiaStep[];
  className?: string;
  isHidden?: boolean;
}

export function ClubeTravessiaProgress({ steps, className, isHidden = false }: ClubeTravessiaProgressProps) {
  if (isHidden) return null;

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className={cn("w-full space-y-6 bg-midnight/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-gold/80 text-[10px] tracking-[0.3em] uppercase font-bold mb-1">
            Progresso da Travessia
          </h3>
          <p className="font-display text-xl text-white/90">
            Sua jornada simbólica
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">
            {completedCount} de {steps.length} etapas concluídas
          </span>
          <Progress value={progressPercentage} className="w-full md:w-48 h-1.5 bg-white/5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'in_progress' || step.status === 'recommended';
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative group flex flex-col p-4 rounded-2xl border transition-all duration-500",
                isCompleted 
                  ? "bg-gold/5 border-gold/20" 
                  : isCurrent
                    ? "bg-gold/10 border-gold/40 ring-2 ring-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-105 z-10"
                    : "bg-white/[0.02] border-white/5 opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isCompleted ? "bg-gold/20 text-gold" : isCurrent ? "bg-gold/10 text-gold/80" : "bg-white/5 text-white/30"
                )}>
                  <step.icon className="w-4 h-4" />
                </div>
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                    <Check className="w-3 h-3 text-midnight" strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse shadow-[0_0_15px_rgba(212,175,55,1)]" />
                ) : null}
              </div>
              
              <div className="space-y-1">
                <h4 className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.2em]",
                  isCompleted ? "text-gold/80" : isCurrent ? "text-gold/60" : "text-white/20"
                )}>
                  Passo 0{index + 1}
                </h4>
                <p className={cn(
                  "font-display text-sm leading-tight",
                  isCompleted || isCurrent ? "text-white/90" : "text-white/40"
                )}>
                  {step.label}
                </p>
              </div>

              {isCurrent && (
                <div className="absolute inset-0 bg-gold/[0.02] rounded-2xl pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
