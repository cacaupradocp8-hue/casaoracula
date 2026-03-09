import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Complexo } from './constants';
import { Clock } from 'lucide-react';

interface Props {
  complexos: Complexo[];
  onUpdate: (index: number, field: keyof Complexo, value: string) => void;
}

export function TelaOrigem({ complexos, onUpdate }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Origem dos Complexos</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Complexos geralmente se formam na infância. Que experiências podem ter dado origem a cada um?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {complexos.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">{c.nome || `Complexo ${i + 1}`}</label>
              {c.emocaoCentral && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.emocaoCentral}</span>}
            </div>
            <Textarea
              placeholder="Que experiências da sua história podem ter formado esse padrão?"
              value={c.origem}
              onChange={e => onUpdate(i, 'origem', e.target.value)}
              className="min-h-[70px]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
