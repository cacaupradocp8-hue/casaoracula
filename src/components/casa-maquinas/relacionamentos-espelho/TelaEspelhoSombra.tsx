
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Relacionamento } from './constants';
import { Moon } from 'lucide-react';

interface Props {
  relacionamentos: Relacionamento[];
  onUpdate: (index: number, field: keyof Relacionamento, value: string) => void;
}

export function TelaEspelhoSombra({ relacionamentos, onUpdate }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-lg">Espelho de Sombra</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          O que te irrita ou incomoda em cada pessoa? Essas qualidades podem ser sombras suas não integradas.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {relacionamentos.map((r, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm font-medium text-foreground">{r.nome || `Pessoa ${i + 1}`}</label>
            <Textarea
              placeholder="O que te irrita ou incomoda nessa pessoa?"
              value={r.irritacao}
              onChange={e => onUpdate(i, 'irritacao', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
