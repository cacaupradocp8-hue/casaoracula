import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { TrainingCase } from './types';

interface Props {
  caso: TrainingCase;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function BlocoLeitura({ caso, value, onChange, onNext }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Escute a fala, observe os sinais. Registre sua leitura do campo.
      </p>

      {/* Perguntas guiadas */}
      {caso.nivel === 'guiado' && (
        <Card className="border-primary/15 bg-primary/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">O que está acontecendo com esta cliente?</p>
            </div>
            <div className="flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">Isso parece o quê no campo simbólico?</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="O que você percebe nesta cliente? O que está acontecendo no campo?"
        className="min-h-[120px] bg-background border-border text-foreground placeholder:text-muted-foreground/40"
      />

      <Button onClick={onNext} disabled={!value.trim()} className="w-full">
        Avançar <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
