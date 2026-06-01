import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Info,
  Circle,
  Dot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Question {
  id: string;
  texto: string;
  tipo_resposta: 'sim_nao' | 'escala_1_5' | 'texto';
  simbolo_atlas?: string;
}

interface FerramentaData {
  tipo: 'radar' | 'escala' | 'mapa' | 'trilha' | 'inventario';
  titulo: string;
  kicker?: string;
  questoes: Question[];
  tipo_resultado: 'intensidade' | 'arquetipo' | 'rastro';
  resultados?: any[];
}

interface FerramentaOracularPlayerProps {
  data: FerramentaOracularPlayerPropsData;
  onComplete?: (respostas: any) => void;
}

// Interface intermediária para lidar com o JSONB do Supabase
interface FerramentaOracularPlayerPropsData {
  tipo: string;
  titulo: string;
  kicker?: string;
  questoes: any[];
  tipo_resultado: string;
  resultados?: any[];
}

export function FerramentaOracularPlayer({ data, onComplete }: FerramentaOracularPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!data || !data.questoes || data.questoes.length === 0) return null;

  const currentQuestion = data.questoes[currentStep];
  const progress = ((currentStep + 1) / data.questoes.length) * 100;

  const handleAnswer = (val: any) => {
    setRespostas(prev => ({ ...prev, [currentQuestion.id]: val }));
    
    if (currentStep < data.questoes.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setIsFinished(true);
      onComplete?.(respostas);
      toast.success("Rastreamento concluído com sucesso.");
    }
  };

  const renderInput = () => {
    switch (currentQuestion.tipo_resposta) {
      case 'sim_nao':
        return (
          <div className="flex flex-col gap-4 mt-8">
            <Button 
              variant="outline" 
              className={cn(
                "h-16 text-lg rounded-2xl border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all",
                respostas[currentQuestion.id] === true && "bg-gold/20 border-gold/50"
              )}
              onClick={() => handleAnswer(true)}
            >
              Sim, reconheço este rastro
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-16 text-lg rounded-2xl border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all",
                respostas[currentQuestion.id] === false && "bg-red-500/10 border-red-500/30"
              )}
              onClick={() => handleAnswer(false)}
            >
              Não, ainda não é visível
            </Button>
          </div>
        );
      case 'escala_1_5':
        return (
          <div className="flex justify-between items-center mt-12 px-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={cn(
                  "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                  respostas[currentQuestion.id] === val 
                    ? "bg-gold border-gold text-midnight shadow-glow" 
                    : "border-white/10 text-white/40 hover:border-gold/40"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        );
      case 'texto':
        return (
          <div className="mt-8">
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:border-gold/50 outline-none min-h-[150px]"
              placeholder="Registre aqui sua percepção..."
              onBlur={(e) => handleAnswer(e.target.value)}
            />
            <Button 
              className="mt-4 w-full rounded-xl bg-gold text-midnight"
              onClick={() => {
                const val = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                if (val) handleAnswer(val);
              }}
            >
              Confirmar Registro
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/[0.03] border border-gold/20 p-10 md:p-16 rounded-[3rem] text-center backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-gold shadow-glow" />
        </div>
        <h3 className="font-display text-3xl text-white mb-4">Rastreamento Integrado</h3>
        <p className="text-white/60 font-serif italic text-lg max-w-lg mx-auto mb-8">
          Seus dados foram capturados e estão sendo processados pela Natureza Instintiva. 
          Este rastro agora faz parte do seu Atlas.
        </p>
        <Button 
          variant="outline" 
          className="rounded-full px-8 border-gold/30 text-gold hover:bg-gold/10"
          onClick={() => setIsFinished(false)}
        >
          Revisar Respostas
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Radar className="w-32 h-32 text-gold rotate-12" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold/60 font-bold block mb-1">
              {data.kicker || "Instrumento de Rastreamento"}
            </span>
            <h3 className="font-display text-2xl text-white">{data.titulo}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-white/30 block mb-1">Passo</span>
            <span className="text-lg font-display text-gold">{currentStep + 1} / {data.questoes.length}</span>
          </div>
        </div>

        <Progress value={progress} className="h-1 bg-white/5 mb-16" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[300px]"
          >
            <div className="flex gap-4 items-start mb-6">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-1">
                <Info className="w-4 h-4 text-gold/60" />
              </div>
              <h4 className="font-serif text-2xl md:text-3xl text-white/90 leading-tight">
                {currentQuestion.texto}
              </h4>
            </div>

            {renderInput()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
          <Button
            variant="ghost"
            className="text-white/40 hover:text-white"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          
          <div className="flex gap-1">
            {data.questoes.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentStep ? "bg-gold w-4" : "bg-white/10"
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
