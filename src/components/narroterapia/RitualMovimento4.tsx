import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RitualMovimento4Props {
  onSelar: () => Promise<void>;
}

export default function RitualMovimento4({ onSelar }: RitualMovimento4Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selado, setSelado] = useState(false);

  // Executar selamento automaticamente ao montar
  useEffect(() => {
    const executarSelamento = async () => {
      try {
        await onSelar();
        setSelado(true);
      } catch (error) {
        console.error('Erro ao selar autorização:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Pequeno delay para a transição visual
    const timer = setTimeout(executarSelamento, 1500);
    return () => clearTimeout(timer);
  }, [onSelar]);

  const handleAcessarBiblioteca = () => {
    navigate('/narroterapia');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="p-6 rounded-full bg-gold/10">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
            <p className="text-muted-foreground text-sm">
              Selando autorização...
            </p>
          </motion.div>
        )}

        {/* Conteúdo após selamento */}
        {selado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            {/* Título sutil */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12"
            >
              Movimento IV — Selamento
            </motion.p>

            {/* Ícone de selo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring' }}
              className="mb-10"
            >
              <div className="inline-flex p-6 rounded-full bg-gold/20 border border-gold/40">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
            </motion.div>

            {/* Mensagem final */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="space-y-6 mb-12"
            >
              <p className="text-xl font-display text-foreground/90 leading-relaxed">
                Você agora guarda uma tecnologia simbólica.
              </p>
              
              <div className="text-foreground/70 leading-relaxed">
                <p>Use com silêncio.</p>
                <p>Use com limite.</p>
              </div>
            </motion.div>

            {/* Selo textual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="mb-10"
            >
              <div className="inline-block px-6 py-3 bg-gold/10 border border-gold/30 rounded-lg">
                <p className="text-xs uppercase tracking-widest text-gold">
                  Facilitadora Autorizada
                </p>
                <p className="text-xs text-gold/70 mt-1">
                  Narroterapia Oracular™
                </p>
              </div>
            </motion.div>

            {/* Botão final */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              <Button
                variant="mystical"
                size="lg"
                onClick={handleAcessarBiblioteca}
                className="px-10"
              >
                <span className="mr-2">🜁</span>
                Acessar Biblioteca
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
