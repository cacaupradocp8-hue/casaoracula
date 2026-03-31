import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Compass, TrendingUp } from 'lucide-react';
import { CasoSimulado } from './types';

interface Props {
  caso: CasoSimulado;
  hipotese: string;
  vetor: string;
  onHipoteseChange: (v: string) => void;
  onVetorChange: (v: string) => void;
  onNext: () => void;
}

export function BlocoDirecao({ caso, hipotese, vetor, onHipoteseChange, onVetorChange, onNext }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Formule sua hipótese simbólica e o vetor de crescimento.
      </p>

      <Card className="border-border/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hipótese simbólica</p>
          </div>
          {caso.nivel === 'guiado' && (
            <p className="text-xs text-primary/60 italic">
              O que está se movendo no campo desta cliente? Qual padrão você identifica?
            </p>
          )}
          <Textarea
            value={hipotese}
            onChange={e => onHipoteseChange(e.target.value)}
            placeholder="Escreva sua hipótese simbólica..."
            className="min-h-[80px] bg-background border-border text-foreground placeholder:text-muted-foreground/40"
          />
        </CardContent>
      </Card>

      <Card className="border-border/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vetor de crescimento</p>
          </div>
          {caso.nivel === 'guiado' && (
            <p className="text-xs text-primary/60 italic">
              Para onde esta cliente pode se mover? O que seria o próximo passo simbólico?
            </p>
          )}
          <Textarea
            value={vetor}
            onChange={e => onVetorChange(e.target.value)}
            placeholder="Qual direção de crescimento você percebe?"
            className="min-h-[60px] bg-background border-border text-foreground placeholder:text-muted-foreground/40"
          />
        </CardContent>
      </Card>

      <Button onClick={onNext} disabled={!hipotese.trim()} className="w-full">
        Avançar <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
