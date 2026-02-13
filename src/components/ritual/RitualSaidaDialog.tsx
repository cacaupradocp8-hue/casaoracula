import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MilkyWayBackground } from './MilkyWayBackground';
import { stampRitualLastAccess } from '@/hooks/useRitualState';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

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

        {/* Two-block layout: top = visual 60%, bottom = text 40% */}
        <div className="relative flex flex-col h-full" style={{ zIndex: 4 }}>
          {/* Top block: visual space 60vh */}
          <div className="flex-none h-[60vh]" />

          {/* Bottom block: text + buttons */}
          <div className="flex-1 flex flex-col items-center justify-start px-6 text-center gap-5 pb-8">
            

            <div className="space-y-3 max-w-[420px]">
              <h2 className="text-2xl font-display text-foreground">
                Antes de partir…
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Respire fundo. O que foi vivido hoje permanece em você.
                <br />
                Não há pressa. Apenas um instante de pausa.
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
