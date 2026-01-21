import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ArrowLeft, Check, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface Pergunta {
  id: string;
  pergunta: string;
  tema: string;
  tags: string[] | null;
}

interface OnboardingQuizProps {
  onComplete: () => void;
  onBack: () => void;
}

// Fallback questions in case database fails or returns empty
const FALLBACK_QUESTIONS: Pergunta[] = [
  {
    id: 'fallback-1',
    pergunta: 'O que você procura ao entrar nesta Casa?',
    tema: 'Entrada',
    tags: ['início', 'intenção'],
  },
  {
    id: 'fallback-2',
    pergunta: 'Qual parte de você pede acolhimento agora?',
    tema: 'Acolhimento',
    tags: ['cuidado', 'presença'],
  },
  {
    id: 'fallback-3',
    pergunta: 'Se sua alma pudesse falar, o que ela diria neste momento?',
    tema: 'Escuta',
    tags: ['alma', 'voz interior'],
  },
  {
    id: 'fallback-4',
    pergunta: 'Que ciclo você sente que está encerrando?',
    tema: 'Ciclos',
    tags: ['transição', 'encerramento'],
  },
  {
    id: 'fallback-5',
    pergunta: 'O que você está disposta a deixar para trás para avançar?',
    tema: 'Travessia',
    tags: ['desapego', 'transformação'],
  },
];

export function OnboardingQuiz({ onComplete, onBack }: OnboardingQuizProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Pergunta | null>(null);
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showComplete, setShowComplete] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const fetchPerguntas = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch level 1 questions (gentlest)
      const { data, error: fetchError } = await supabase
        .from('oraculo_perguntas')
        .select('id, pergunta, tema, tags')
        .eq('status', 'ativo')
        .eq('nivel_intensidade', 1)
        .limit(20);

      if (fetchError) {
        console.error('Error fetching questions:', fetchError);
        // Use fallback questions
        setPerguntas(FALLBACK_QUESTIONS);
        setUsedFallback(true);
        const random = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
        setCurrentQuestion(random);
      } else if (!data || data.length === 0) {
        // No questions in database, use fallback
        console.log('No questions found, using fallback');
        setPerguntas(FALLBACK_QUESTIONS);
        setUsedFallback(true);
        const random = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
        setCurrentQuestion(random);
      } else {
        setPerguntas(data);
        setUsedFallback(false);
        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentQuestion(random);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      // Use fallback questions on any error
      setPerguntas(FALLBACK_QUESTIONS);
      setUsedFallback(true);
      const random = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      setCurrentQuestion(random);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerguntas();
  }, [fetchPerguntas]);

  const sortearNova = useCallback(() => {
    if (perguntas.length === 0) return;
    
    // Pick different question if possible
    const available = perguntas.filter(p => p.id !== currentQuestion?.id);
    const pool = available.length > 0 ? available : perguntas;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(random);
    setReflection('');
  }, [perguntas, currentQuestion?.id]);

  const handleComplete = useCallback(() => {
    setShowComplete(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [onComplete]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Consultando o oráculo...</p>
        </div>
      </div>
    );
  }

  // No questions available (shouldn't happen with fallback, but just in case)
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-gold/60" />
          </div>
          <div>
            <p className="text-lg font-display text-foreground mb-2">
              O oráculo se revela por ciclos.
            </p>
            <p className="text-muted-foreground text-sm">
              Retorne à Sala da Visitante para continuar sua exploração.
            </p>
          </div>
          <Button variant="gold" onClick={onBack} className="w-full max-w-xs">
            <Home className="w-4 h-4 mr-2" />
            Ir para a Sala da Visitante
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-background to-background" />
      
      {/* Back button */}
      <div className="relative z-10 p-6">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Sala
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {showComplete ? (
            <motion.div
              key="complete"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <p className="text-lg font-display text-gold">
                A pergunta foi plantada.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm text-gold">Quiz Oracular</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uma pergunta simbólica para você contemplar
                </p>
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-8 mb-6 border border-gold/20"
              >
                <p className="text-xl md:text-2xl font-display text-foreground text-center leading-relaxed">
                  "{currentQuestion.pergunta}"
                </p>
                
                {currentQuestion.tema && (
                  <p className="text-xs text-muted-foreground text-center mt-4 uppercase tracking-wider">
                    {currentQuestion.tema}
                  </p>
                )}
              </motion.div>

              {/* Reflection (optional) */}
              <div className="mb-6">
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Se quiser, escreva algo que essa pergunta evocou... (opcional)"
                  className="min-h-[100px] bg-background/50 border-border/50 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Este espaço é apenas seu. Nada será salvo.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={sortearNova}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sortear outra
                </Button>
                
                <Button
                  variant="gold"
                  onClick={handleComplete}
                  className="flex-1"
                >
                  Guardar essa reflexão
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
