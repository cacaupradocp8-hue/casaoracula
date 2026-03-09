import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ComplexosState } from './constants';
import { GitBranch } from 'lucide-react';

interface Props {
  state: ComplexosState;
  onChange: (field: keyof ComplexosState, value: string) => void;
}

export function TelaPadroes({ state, onChange }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Padrões e Conexões</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Olhando para os complexos mapeados, que padrões você percebe entre eles?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Gatilhos gerais</label>
          <Textarea
            placeholder="Que tipos de situação ativam seus complexos com mais frequência?"
            value={state.gatilhosGerais}
            onChange={e => onChange('gatilhosGerais', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Padrão central</label>
          <Input
            placeholder="Se tivesse que resumir o ciclo em uma frase..."
            value={state.padraoCentral}
            onChange={e => onChange('padraoCentral', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Reflexão sobre origens</label>
          <Textarea
            placeholder="Há um tema de fundo que conecta todos os complexos?"
            value={state.reflexaoOrigem}
            onChange={e => onChange('reflexaoOrigem', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Reflexão final</label>
          <Textarea
            placeholder="O que esse mapeamento revela sobre como você funciona emocionalmente?"
            value={state.reflexaoFinal}
            onChange={e => onChange('reflexaoFinal', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
