import { AudioOracular } from "@/components/audio/AudioOracular";
import { cn } from "@/lib/utils";

interface PortaAudioPlayerProps {
  audioUrl: string;
  audioTitulo?: string | null;
  className?: string;
}

export function PortaAudioPlayer({ audioUrl, audioTitulo, className }: PortaAudioPlayerProps) {
  return (
    <AudioOracular
      audioUrl={audioUrl}
      titulo={audioTitulo || undefined}
      className={cn(className)}
      hideInsight={false}
    />
  );
}
