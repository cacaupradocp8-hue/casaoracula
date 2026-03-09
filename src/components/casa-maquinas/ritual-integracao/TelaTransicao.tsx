import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RitualState } from './constants';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  state: RitualState;
  onChange: (field: keyof RitualState, value: string) => void;
}

export function TelaTransicao({ state, onChange }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Transição</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Marque o que fica para trás e o que segue adiante.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">O que eu deixo para trás</label>
          <Textarea placeholder="Crenças, padrões, hábitos que não servem mais..." value={state.oQueDeixo} onChange={e => onChange('oQueDeixo', e.target.value)} className="min-h-[80px]" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">O que eu levo comigo</label>
          <Textarea placeholder="Forças, aprendizados, qualidades que desejo cultivar..." value={state.oQueLevo} onChange={e => onChange('oQueLevo', e.target.value)} className="min-h-[80px]" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Símbolo de transição</label>
          <Input placeholder="Se essa passagem fosse um símbolo, qual seria?" value={state.simboloTransicao} onChange={e => onChange('simboloTransicao', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}
