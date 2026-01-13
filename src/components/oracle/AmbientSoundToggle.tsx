import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AmbientSoundToggleProps {
  className?: string;
  variant?: 'ghost' | 'outline';
}

// Ambient sound frequencies for a calming atmosphere
const AMBIENT_FREQUENCIES = [
  { freq: 174, gain: 0.08 },
  { freq: 285, gain: 0.06 },
  { freq: 396, gain: 0.04 },
];

export function AmbientSoundToggle({ className, variant = 'ghost' }: AmbientSoundToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const initializeAudio = () => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    gainNodeRef.current = masterGain;

    // Create oscillators for ambient drone
    AMBIENT_FREQUENCIES.forEach(({ freq, gain }) => {
      const oscillator = audioContext.createOscillator();
      const oscGain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      oscGain.gain.value = gain;

      oscillator.connect(oscGain);
      oscGain.connect(masterGain);
      oscillator.start();

      oscillatorsRef.current.push(oscillator);
    });

    setIsInitialized(true);
  };

  const toggleSound = () => {
    if (!isInitialized) {
      initializeAudio();
    }

    if (!gainNodeRef.current || !audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const targetGain = isPlaying ? 0 : 0.3;
    gainNodeRef.current.gain.linearRampToValueAtTime(
      targetGain,
      audioContextRef.current.currentTime + 0.5
    );

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleSound}
      className={cn(
        'relative transition-all duration-300',
        isPlaying && 'text-primary',
        className
      )}
      title={isPlaying ? 'Desativar som ambiente' : 'Ativar som ambiente'}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-breathe" />
      ) : (
        <VolumeX className="w-4 h-4 opacity-60" />
      )}
      {isPlaying && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-breathe" />
      )}
    </Button>
  );
}
