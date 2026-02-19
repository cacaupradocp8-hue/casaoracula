import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface AulaCompleteBlockProps {
  isCompleted: boolean;
  isMarking: boolean;
  onMark: () => void;
}

export function AulaCompleteBlock({ isCompleted, isMarking, onMark }: AulaCompleteBlockProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border/30 px-4 py-3">
      <Button
        variant={isCompleted ? 'outline' : 'gold'}
        size="lg"
        onClick={onMark}
        disabled={isCompleted || isMarking}
        className="w-full gap-2"
      >
        {isMarking ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCompleted ? (
          <Check className="w-4 h-4" />
        ) : null}
        {isCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
      </Button>
    </div>
  );
}
