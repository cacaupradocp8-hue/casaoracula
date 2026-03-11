import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RitualMovimento3Props {
  onIniciarPausa: () => Promise<void>;
  onComplete: () => Promise<void>;
  pausaJaIniciada: boolean;
}

const PAUSA_DURACAO_MS = 6000; // 6 segundos (meio do range 5-7s)

export default function RitualMovimento3({ 
  onIniciarPausa, 
  onComplete, 
  pausaJaIniciada 
}: RitualMovimento3Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pausaIniciada, setPausaIniciada] = useState(pausaJaIniciada);
  const [mostrarBotao, setMostrarBotao] = useState(pausaJaIniciada);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Iniciar pausa automaticamente ao montar
  useEffect(() => {
    if (!pausaIniciada) {
      const iniciar = async () => {
        try {
          await onIniciarPausa();
          setPausaIniciada(true);
        } catch (error) {
          console.error('Erro ao iniciar pausa:', error);
        }
      };
      iniciar();
    }
  }, []);

  // Timer para mostrar botão após pausa
  useEffect(() => {
    if (pausaIniciada && !mostrarBotao) {
      timerRef.current = setTimeout(() => {
        setMostrarBotao(true);
      }, PAUSA_DURACAO_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pausaIniciada, mostrarBotao]);

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
      transition={{ duration: 2 }}
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
          Movimento III — Autorização Simbólica
        </motion.p>

        {/* Texto canônico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 2 }}
          className="space-y-8 mb-16"
        >
          <h2 className="text-2xl font-display text-foreground mb-8">
            Rito de Autorização
          </h2>
          
          <p className="text-foreground/90 leading-relaxed">
            A Casa Orácula reconhece sua travessia.
          </p>
          
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>A partir deste momento:</p>
            
            <p>
              Você não narra para explicar.
              <br />
              Você não narra para curar.
              <br />
              Você não narra para conduzir.
            </p>
            
            <p className="text-gold font-display text-lg">
              Você narra para sustentar.
            </p>
            
            <p className="text-foreground/60 mt-8">
              O sentido não é seu.
              <br />
              O tempo não é seu.
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 2 }}
            className="text-gold font-display text-xl mt-12"
          >
            A Porta está aberta.
          </motion.p>
        </motion.div>

        {/* Botão - aparece após a pausa */}
        <AnimatePresence>
          {mostrarBotao && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
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
                Receber Autorização
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de espera (sutil) */}
        {pausaIniciada && !mostrarBotao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
