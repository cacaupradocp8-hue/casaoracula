import { cn } from '@/lib/utils';

interface SoundWaveVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export function SoundWaveVisualizer({ isPlaying, className }: SoundWaveVisualizerProps) {
  const bars = 24;

  return (
    <div className={cn("flex items-center justify-center gap-[2px] h-12", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = `${(i * 0.12).toFixed(2)}s`;
        const baseHeight = Math.sin((i / bars) * Math.PI) * 100;

        return (
          <div
            key={i}
            className={cn(
              "w-[2px] rounded-full transition-all duration-300",
              isPlaying
                ? "bg-gradient-to-t from-gold/40 via-gold to-gold-light"
                : "bg-gold/20"
            )}
            style={{
              height: isPlaying ? `${Math.max(baseHeight, 15)}%` : '15%',
              animation: isPlaying
                ? `sound-wave 1.2s ease-in-out ${delay} infinite`
                : 'none',
              transformOrigin: 'center',
            }}
          />
        );
      })}
    </div>
  );
}
