import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ConselhoState } from './constants';
import { Lightbulb } from 'lucide-react';

interface Props {
  state: ConselhoState;
  onChange: (field: keyof ConselhoState, value: string) => void;
}

export function TelaSabedoria({ state, onChange }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Sabedoria do Conselho</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Após o diálogo, que sabedoria emerge quando todas as partes são ouvidas?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Sabedoria integrada</label>
          <Textarea
            placeholder="Que compreensão surge quando todas as vozes são consideradas?"
            value={state.sabedoriaIntegrada}
            onChange={e => onChange('sabedoriaIntegrada', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Decisão do conselho</label>
          <Textarea
            placeholder="Se o conselho pudesse tomar uma decisão unânime, qual seria?"
            value={state.decisaoConselho}
            onChange={e => onChange('decisaoConselho', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Reflexão final</label>
          <Textarea
            placeholder="O que você aprendeu ao dar voz a todas as suas partes?"
            value={state.reflexaoFinal}
            onChange={e => onChange('reflexaoFinal', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
