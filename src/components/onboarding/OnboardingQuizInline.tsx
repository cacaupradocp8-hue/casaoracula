import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface Pergunta {
  id: string;
  pergunta: string;
  tema: string;
  tags: string[] | null;
}

interface OnboardingQuizInlineProps {
  onComplete: () => void;
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

export function OnboardingQuizInline({ onComplete }: OnboardingQuizInlineProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Pergunta | null>(null);
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  const fetchPerguntas = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('oraculo_perguntas')
        .select('id, pergunta, tema, tags')
        .eq('status', 'ativo')
        .eq('nivel_intensidade', 1)
        .limit(20);

      if (fetchError || !data || data.length === 0) {
        console.log('Using fallback questions');
        setPerguntas(FALLBACK_QUESTIONS);
        const random = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
        setCurrentQuestion(random);
      } else {
        setPerguntas(data);
        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentQuestion(random);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setPerguntas(FALLBACK_QUESTIONS);
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
    }, 1500);
  }, [onComplete]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Consultando o oráculo...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">O oráculo se revela por ciclos. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showComplete ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
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
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-3">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-xs text-gold">Quiz Oracular</span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-background/50 rounded-xl p-6 mb-4 border border-gold/10">
            <p className="text-lg md:text-xl font-display text-foreground text-center leading-relaxed">
              "{currentQuestion.pergunta}"
            </p>
            
            {currentQuestion.tema && (
              <p className="text-xs text-muted-foreground text-center mt-3 uppercase tracking-wider">
                {currentQuestion.tema}
              </p>
            )}
          </div>

          {/* Reflection */}
          <div className="mb-4">
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Se quiser, escreva algo que essa pergunta evocou... (opcional)"
              className="min-h-[80px] bg-background/50 border-border/50 resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Este espaço é apenas seu. Nada será salvo.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={sortearNova}
              className="flex-1"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sortear outra
            </Button>
            
            <Button
              variant="gold"
              onClick={handleComplete}
              className="flex-1"
              size="sm"
            >
              Guardar reflexão
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
