import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Feather } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MilkyWayBackground } from './MilkyWayBackground';
import { stampRitualLastAccess } from '@/hooks/useRitualState';
import { motion, AnimatePresence } from 'framer-motion';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.5 },
};

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'initial' | 'listening' | 'closing'>('initial');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'ritual_saida_audio_url')
        .maybeSingle();
      if (data?.value) setAudioUrl(data.value);
    };
    fetchAudioUrl();
  }, []);

  const handlePlay = async () => {
    setPhase('listening');
    const audio = audioRef.current;
    if (!audio) { setPhase('closing'); return; }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setPhase('closing');
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPhase('closing');
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setIsPlaying(false);
    setPhase('closing');
  };

  const handleFinalClose = () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setIsPlaying(false);
    setPhase('initial');
    stampRitualLastAccess();
    onConfirmExit();
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.currentTime = 0; }
      setIsPlaying(false);
      setPhase('initial');
      onClose();
    }
  };

  const hasAudio = !!audioUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-full w-full h-[100vh] max-h-[100vh] p-0 border-none rounded-none bg-[#0F2A33] [&>button]:hidden overflow-hidden">
        {hasAudio && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="none"
            onEnded={handleAudioEnded}
          />
        )}

        <MilkyWayBackground />

        {/* Two-block layout: top = visual, bottom = text */}
        <div className="relative flex flex-col h-full" style={{ zIndex: 10 }}>
          {/* Top block: mandala area */}
          <div className="flex-none h-[50vh]" />

          {/* Bottom block: text + buttons */}
          <div className="flex-1 flex flex-col items-center justify-start px-6 text-center gap-6 pb-8">
            
            <AnimatePresence mode="wait">
              {phase === 'initial' && (
                <motion.div
                  key="initial"
                  {...fadeUp}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Decorative divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/30" />
                    <Feather className="w-4 h-4 text-gold/40" />
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/30" />
                  </div>

                  <div className="space-y-4 max-w-[420px]">
                    <h2 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">
                      Antes de partir…
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      Respire fundo. O que foi vivido hoje permanece em você.
                    </p>
                    <p className="text-muted-foreground/60 text-xs leading-relaxed italic">
                      Não há pressa. Apenas um instante de pausa.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    {hasAudio ? (
                      <Button onClick={handlePlay} variant="gold" size="lg" className="gap-2 shadow-lg shadow-gold/20">
                        <Play className="w-4 h-4" />
                        Ouvir agora
                      </Button>
                    ) : (
                      <Button onClick={handleFinalClose} variant="gold" size="lg" className="shadow-lg shadow-gold/20">
                        Fechar Jardim
                      </Button>
                    )}
                    {hasAudio && (
                      <Button onClick={handleSkip} variant="ghost" size="sm" className="text-muted-foreground/50 hover:text-foreground text-xs">
                        Pular ritual
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}

              {phase === 'listening' && (
                <motion.div
                  key="listening"
                  {...fadeUp}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Listening indicator */}
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [1, 1.8, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-0.5 h-4 bg-gold/60 rounded-full"
                      />
                    ))}
                  </div>

                  <div className="space-y-3 max-w-[380px]">
                    <p className="text-foreground/80 text-sm leading-relaxed font-display">
                      Escute com o corpo.
                    </p>
                    <p className="text-muted-foreground/50 text-xs italic">
                      Deixe o som envolver o que precisa ser encerrado.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <Button onClick={togglePause} variant="mystical" size="lg" className="gap-2">
                      {isPlaying ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Continuar</>}
                    </Button>
                    <Button onClick={handleSkip} variant="ghost" size="sm" className="text-muted-foreground/50 hover:text-foreground text-xs">
                      Pular ritual
                    </Button>
                  </div>
                </motion.div>
              )}

              {phase === 'closing' && (
                <motion.div
                  key="closing"
                  {...fadeUp}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/20" />
                    <span className="text-gold/40 text-lg">✧</span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/20" />
                  </div>

                  <div className="space-y-3 max-w-[380px]">
                    <p className="text-foreground/70 text-sm font-display italic">
                      O Jardim estará aqui quando quiser voltar.
                    </p>
                  </div>

                  <Button onClick={handleFinalClose} variant="gold" size="lg" className="shadow-lg shadow-gold/20">
                    Fechar Jardim
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
