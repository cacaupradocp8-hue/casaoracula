
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EspelhoState } from './constants';
import { Repeat } from 'lucide-react';

interface Props {
  state: EspelhoState;
  onChange: (field: keyof EspelhoState, value: string) => void;
}

export function TelaPadroes({ state, onChange }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Padrões Relacionais</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Olhando para todos os seus relacionamentos mapeados, que padrões se repetem?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Padrões recorrentes</label>
          <Textarea
            placeholder="Que dinâmicas se repetem nos seus vínculos? (ex: sempre cuido do outro, atraio pessoas indisponíveis...)"
            value={state.padroes}
            onChange={e => onChange('padroes', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Padrão central</label>
          <Input
            placeholder="Se tivesse que resumir em uma frase, qual é o padrão?"
            value={state.padraoCentral}
            onChange={e => onChange('padraoCentral', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Reflexão final</label>
          <Textarea
            placeholder="O que esse mapeamento revela sobre o que você busca nos vínculos?"
            value={state.reflexaoFinal}
            onChange={e => onChange('reflexaoFinal', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
