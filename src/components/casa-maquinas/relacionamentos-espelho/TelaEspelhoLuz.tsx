
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Relacionamento } from './constants';
import { Sun } from 'lucide-react';

interface Props {
  relacionamentos: Relacionamento[];
  onUpdate: (index: number, field: keyof Relacionamento, value: string) => void;
}

export function TelaEspelhoLuz({ relacionamentos, onUpdate }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <CardTitle className="text-lg">Espelho de Luz</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          O que você admira em cada pessoa? Essas qualidades são potenciais seus que você reconhece no outro.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {relacionamentos.map((r, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm font-medium text-foreground">{r.nome || `Pessoa ${i + 1}`}</label>
            <Textarea
              placeholder="Que qualidades você admira nessa pessoa?"
              value={r.admiracao}
              onChange={e => onUpdate(i, 'admiracao', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
