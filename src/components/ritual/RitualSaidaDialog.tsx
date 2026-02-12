import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Moon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MilkyWayBackground } from './MilkyWayBackground';
import { useRitualState, stampRitualLastAccess } from '@/hooks/useRitualState';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const ritualState = useRitualState();
  const [phase, setPhase] = useState<'initial' | 'listening' | 'closing'>('initial');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch audio URL from app_settings
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
      <DialogContent className="max-w-full w-full h-full max-h-full p-0 border-none rounded-none bg-transparent [&>button]:hidden">
        {hasAudio && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="none"
            onEnded={handleAudioEnded}
          />
        )}

        <MilkyWayBackground state={ritualState} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center gap-8">
          <Moon className="w-10 h-10 text-gold/70" />

          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl font-display text-foreground">
              Antes de partir…
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Respire fundo. O que foi vivido hoje permanece em você.
              <br />
              Não há pressa — apenas um instante de pausa.
            </p>
          </div>

          {phase === 'initial' && (
            <div className="flex flex-col items-center gap-4">
              {hasAudio ? (
                <Button onClick={handlePlay} variant="gold" size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Ouvir agora
                </Button>
              ) : (
                <Button onClick={handleFinalClose} variant="gold" size="lg">
                  Fechar Jardim
                </Button>
              )}
              {hasAudio && (
                <Button onClick={handleSkip} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Pular ritual
                </Button>
              )}
            </div>
          )}

          {phase === 'listening' && (
            <div className="flex flex-col items-center gap-4">
              <Button onClick={togglePause} variant="mystical" size="lg" className="gap-2">
                {isPlaying ? <><Pause className="w-4 h-4" />Pausar</> : <><Play className="w-4 h-4" />Continuar</>}
              </Button>
              <Button onClick={handleSkip} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Pular ritual
              </Button>
            </div>
          )}

          {phase === 'closing' && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground italic">
                O Jardim estará aqui quando quiser voltar.
              </p>
              <Button onClick={handleFinalClose} variant="gold" size="lg">
                Fechar Jardim
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
