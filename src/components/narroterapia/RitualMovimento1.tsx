import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RitualMovimento1Props {
  onComplete: () => Promise<void>;
}

export default function RitualMovimento1({ onComplete }: RitualMovimento1Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Título sutil */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12"
        >
          Movimento I — Preparação
        </motion.p>

        {/* Texto canônico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="space-y-6 mb-16"
        >
          <p className="text-lg font-display text-foreground/90 italic leading-relaxed">
            Antes de narrar, você precisa saber:
          </p>
          
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              Você não está aqui para conduzir histórias.
              <br />
              Você está aqui para sustentar campos.
            </p>
            
            <p>
              A Narroterapia Oracular™ não responde.
              <br />
              Ela abre espaço.
            </p>
            
            <p>
              Se você busca efeito, não prossiga.
              <br />
              Se você aceita o silêncio, continue.
            </p>
          </div>
        </motion.div>

        {/* Botão */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <Button
            variant="mystical"
            size="lg"
            onClick={handleComplete}
            disabled={isLoading}
            className="px-10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <span className="mr-2">🜂</span>
            )}
            Estou Presente
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
