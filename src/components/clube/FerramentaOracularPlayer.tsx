import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Info,
  Circle,
  Dot,
  Compass,
  Sparkles,
  Eye,
  MapPin
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
}

interface FerramentaData {
  enabled: boolean;
  tool_id: string;
  titulo: string;
  kicker?: string;
  questoes: Question[];
  tipo_resultado: 'intensidade' | 'arquetipo' | 'rastro';
  resultados?: any[];
}

interface FerramentaOracularPlayerProps {
  data: FerramentaData;
  onComplete?: (respostas: any) => void;
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
      toast.success("O rastro foi capturado.");
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
                "h-20 text-lg rounded-3xl border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all font-serif italic",
                respostas[currentQuestion.id] === true && "bg-gold/20 border-gold/50 text-gold"
              )}
              onClick={() => handleAnswer(true)}
            >
              Sim, reconheço este rastro
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-20 text-lg rounded-3xl border-white/10 hover:bg-white/5 transition-all font-serif italic",
                respostas[currentQuestion.id] === false && "bg-white/5 border-white/20"
              )}
              onClick={() => handleAnswer(false)}
            >
              Ainda não é visível em mim
            </Button>
          </div>
        );
      case 'escala_1_5':
        return (
          <div className="space-y-8 mt-12">
            <div className="flex justify-between items-center px-4">
              {[1, 2, 3, 4, 5].map((val) => (
                <div key={val} className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => handleAnswer(val)}
                    className={cn(
                      "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all",
                      respostas[currentQuestion.id] === val 
                        ? "bg-gold border-gold text-midnight shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        : "border-white/10 text-white/40 hover:border-gold/30"
                    )}
                  >
                    <span className="font-display text-xl">{val}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2">
              <span className="text-[10px] uppercase tracking-widest text-white/20">Silêncio</span>
              <span className="text-[10px] uppercase tracking-widest text-white/20">Presença Radical</span>
            </div>
          </div>
        );
      case 'texto':
        return (
          <div className="mt-8 space-y-4">
            <textarea
              className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-white placeholder:text-white/20 focus:border-gold/40 outline-none min-h-[180px] font-serif italic text-lg leading-relaxed"
              placeholder="Deixe sua alma falar sobre este rastro..."
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  // Don't auto-advance on blur for textareas
                }
              }}
            />
            <Button 
              className="w-full h-16 rounded-2xl bg-gold hover:bg-gold/90 text-midnight font-bold text-lg shadow-glow"
              onClick={() => {
                const val = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                if (val?.trim()) handleAnswer(val);
                else toast.error("Por favor, registre sua percepção.");
              }}
            >
              Confirmar Registro Simbólico
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-b from-white/[0.05] to-transparent border border-gold/20 p-12 md:p-20 rounded-[3.5rem] text-center backdrop-blur-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        
        <div className="w-24 h-24 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-10 relative">
          <div className="absolute inset-0 rounded-full bg-gold/5 animate-ping" />
          <Sparkles className="w-10 h-10 text-gold shadow-glow" />
        </div>
        
        <h3 className="font-display text-4xl text-white mb-6">Rastro registrado</h3>
        <p className="text-white/60 font-serif italic text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Seu rastro foi acolhido.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="gold" 
            className="rounded-full h-14 px-10 shadow-glow"
            onClick={() => setIsFinished(false)}
          >
            Revisar Percepções
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full h-14 px-10 border-white/10 text-white/40 hover:text-white"
            onClick={() => {
                // Scroll back to where the user was or continue
                document.getElementById('jardim-psique')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Continuar Travessia
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 opacity-5">
           <Compass className="w-64 h-64 text-gold rotate-12" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative bg-[#0F0D15] border border-white/5 p-10 md:p-16 rounded-[3rem] backdrop-blur-md overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Radar className="w-48 h-48 text-gold animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-gold/70" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-bold block mb-1">
                {"Camada do Método"}
              </span>
              <h3 className="font-display text-3xl text-white">{data.titulo}</h3>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-mono text-white/30 block mb-1 uppercase tracking-tighter">Etapa</span>
            <span className="text-2xl font-display text-gold/80">{currentStep + 1}<span className="text-white/20 text-sm ml-1">/ {data.questoes.length}</span></span>
          </div>
        </header>

        <div className="relative mb-20">
            <Progress value={progress} className="h-1 bg-white/5" />
            <div className="absolute -top-1 left-0 h-3 w-1 bg-gold shadow-glow" style={{ left: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-[320px]"
          >
            <div className="flex gap-6 items-start mb-10">
              <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center shrink-0 mt-1">
                <MapPin className="w-5 h-5 text-gold/40" />
              </div>
              <h4 className="font-serif text-3xl md:text-4xl text-white/95 leading-snug">
                {currentQuestion.texto}
              </h4>
            </div>

            {renderInput()}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-16 flex items-center justify-between pt-10 border-t border-white/5">
          <Button
            variant="ghost"
            className="text-white/30 hover:text-white transition-colors h-12 px-6 rounded-xl hover:bg-white/5"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          
          <div className="flex gap-2">
            {data.questoes.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1 h-1 rounded-full transition-all duration-500",
                  i === currentStep ? "bg-gold scale-[2] shadow-glow" : (i < currentStep ? "bg-gold/40" : "bg-white/10")
                )} 
              />
            ))}
          </div>

          <Button
            variant="ghost"
            className="text-white/30 hover:text-white transition-colors h-12 px-6 rounded-xl hover:bg-white/5 invisible"
            disabled
          >
            Pular <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
