import { PlayerOracular } from "@/components/audio/PlayerOracular";
import { cn } from "@/lib/utils";

interface PortaAudioPlayerProps {
  audioUrl: string;
  audioTitulo?: string | null;
  className?: string;
}

export function PortaAudioPlayer({ audioUrl, audioTitulo, className }: PortaAudioPlayerProps) {
  return (
    <PlayerOracular
      audioUrl={audioUrl}
      titulo={audioTitulo || undefined}
      className={cn(className)}
      hideInsight={false}
    />
  );
}
