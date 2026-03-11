import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Volume2 } from 'lucide-react';
import { RitualSimbolico } from '@/hooks/useBig5PortaMapping';

interface RitualSymbolicScreenProps {
  ritual: RitualSimbolico | null;
  portaAssociada: string | null;
  onComplete: () => void;
  saving?: boolean;
}

export function RitualSymbolicScreen({
  ritual,
  portaAssociada,
  onComplete,
  saving = false,
}: RitualSymbolicScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const duration = ritual?.duracao_segundos || 60;

  useEffect(() => {
    setTimeRemaining(duration);
    setTimerStarted(false);
    setTimerCompleted(false);
  }, [ritual, duration]);

  useEffect(() => {
    if (timerStarted && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerCompleted(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
  };

  if (!ritual) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="glass border-gold/20">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum ritual disponível para esta combinação.
            </p>
            <Button onClick={onComplete} className="mt-6">
              Continuar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="glass border-gold/20">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-xl text-gold">
            {ritual.nome}
          </CardTitle>
          {portaAssociada && (
            <CardDescription className="text-gold/70">
              {portaAssociada}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Material necessário */}
          {ritual.material && (
            <div className="p-4 rounded-lg bg-card/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Material necessário:</p>
              <p className="font-medium">{ritual.material}</p>
            </div>
          )}

          {/* Instrução */}
          <div className="py-4">
            <p className="text-center text-foreground leading-relaxed">
              {ritual.instrucao}
            </p>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center gap-4">
            {!timerStarted ? (
              <Button
                onClick={handleStartTimer}
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10"
              >
                Iniciar Tempo ({formatTime(duration)})
              </Button>
            ) : (
              <div className="text-center">
                <div className={`text-4xl font-display tabular-nums ${
                  timerCompleted ? 'text-green-500' : 'text-gold'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
                {ritual.silencio_obrigatorio && !timerCompleted && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground text-sm">
                    <Volume2 className="w-4 h-4" />
                    <span>Silêncio</span>
                  </div>
                )}
                {timerCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 mt-2 text-green-500"
                  >
                    <Check className="w-5 h-5" />
                    <span>Tempo concluído</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Frase única */}
          {ritual.frase_unica && timerCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg bg-gold/5 border border-gold/20 text-center"
            >
              <p className="font-display text-lg text-gold italic">
                "{ritual.frase_unica}"
              </p>
            </motion.div>
          )}

          {/* Aviso */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Ritual não resolve. Ritual organiza o campo.
            </p>
          </div>

          {/* Botão concluir */}
          <Button
            onClick={onComplete}
            disabled={!timerCompleted || saving}
            className="w-full"
            size="lg"
          >
            {saving ? (
              'Salvando...'
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Ritual concluído
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
