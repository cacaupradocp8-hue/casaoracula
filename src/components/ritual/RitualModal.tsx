import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReflexaoField {
  label: string;
  required?: boolean;
  minLength?: number;
}

interface RitualModalProps {
  isOpen: boolean;
  tipo: 'abertura' | 'transicao' | 'consagracao';
  textoRitual: string;
  perguntaCompromisso?: string;
  camposReflexao?: ReflexaoField[];
  microcopy?: string;
  onComplete: (respostas: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function RitualModal({
  isOpen,
  tipo,
  textoRitual,
  perguntaCompromisso,
  camposReflexao = [],
  microcopy,
  onComplete,
  isSubmitting = false,
}: RitualModalProps) {
  const [step, setStep] = useState<'leitura' | 'reflexao' | 'compromisso'>('leitura');
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const hasReflexao = camposReflexao.length > 0;
  const hasCompromisso = !!perguntaCompromisso;

  const handleNext = () => {
    if (step === 'leitura') {
      if (hasReflexao) {
        setStep('reflexao');
      } else if (hasCompromisso) {
        setStep('compromisso');
      } else {
        onComplete(respostas);
      }
    } else if (step === 'reflexao') {
      if (hasCompromisso) {
        setStep('compromisso');
      } else {
        onComplete(respostas);
      }
    } else {
      onComplete(respostas);
    }
  };

  const canProceed = () => {
    if (step === 'reflexao') {
      return camposReflexao.every((field) => {
        const value = respostas[field.label] || '';
        if (field.required && !value.trim()) return false;
        if (field.minLength && value.length < field.minLength) return false;
        return true;
      });
    }
    return true;
  };

  const getTipoIcon = () => {
    switch (tipo) {
      case 'abertura':
        return '🌙';
      case 'transicao':
        return '🌊';
      case 'consagracao':
        return '🔥';
      default:
        return '✦';
    }
  };

  const getTipoTitle = () => {
    switch (tipo) {
      case 'abertura':
        return 'Ritual de Abertura';
      case 'transicao':
        return 'Ritual de Transição';
      case 'consagracao':
        return 'Ritual de Consagração';
      default:
        return 'Ritual de Passagem';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">{getTipoIcon()}</span>
            <h2 className="font-display text-xl text-gold">{getTipoTitle()}</h2>
          </div>

          {/* Content based on step */}
          <div className="space-y-8">
            {step === 'leitura' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-line">
                  {textoRitual}
                </p>
                {microcopy && (
                  <p className="text-foreground/40 text-sm italic">{microcopy}</p>
                )}
              </motion.div>
            )}

            {step === 'reflexao' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {camposReflexao.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-foreground/70 text-sm">
                      {field.label}
                      {field.required && <span className="text-gold ml-1">*</span>}
                    </label>
                    <Textarea
                      value={respostas[field.label] || ''}
                      onChange={(e) =>
                        setRespostas((prev) => ({
                          ...prev,
                          [field.label]: e.target.value,
                        }))
                      }
                      placeholder="Escreva sua reflexão..."
                      className="min-h-[100px] bg-background/50 border-border/50 focus:border-gold/50"
                    />
                    {field.minLength && (
                      <p className="text-foreground/30 text-xs">
                        Mínimo de {field.minLength} caracteres
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {step === 'compromisso' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <p className="text-foreground/80 text-lg">{perguntaCompromisso}</p>
                <p className="text-foreground/40 text-sm italic">
                  Ao continuar, você assume esse compromisso.
                </p>
              </motion.div>
            )}
          </div>

          {/* Action */}
          <div className="mt-10 text-center">
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              variant="ghost"
              className="text-gold hover:text-gold/80 hover:bg-gold/5 px-8"
            >
              {isSubmitting
                ? 'Registrando...'
                : step === 'compromisso' || (!hasReflexao && !hasCompromisso && step === 'leitura') || (step === 'reflexao' && !hasCompromisso)
                ? 'Atravessar'
                : 'Continuar'}
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                step === 'leitura' ? 'bg-gold' : 'bg-gold/30'
              }`}
            />
            {hasReflexao && (
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === 'reflexao' ? 'bg-gold' : 'bg-gold/30'
                }`}
              />
            )}
            {hasCompromisso && (
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === 'compromisso' ? 'bg-gold' : 'bg-gold/30'
                }`}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
