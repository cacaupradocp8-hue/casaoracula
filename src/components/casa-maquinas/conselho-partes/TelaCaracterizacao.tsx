import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ParteInterna } from './constants';
import { Mic } from 'lucide-react';

interface Props {
  partes: ParteInterna[];
  onUpdate: (index: number, field: keyof ParteInterna, value: string) => void;
}

export function TelaCaracterizacao({ partes, onUpdate }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Dê voz a cada parte</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Para cada parte, explore sua voz, seus desejos e seus medos.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {partes.map((p, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3" style={{ borderLeftColor: p.cor, borderLeftWidth: 3 }}>
            <p className="text-sm font-medium text-foreground">{p.nome || `Parte ${i + 1}`} <span className="text-xs text-muted-foreground">({p.tipo})</span></p>
            <Textarea placeholder="O que essa parte costuma dizer? Qual é sua voz?" value={p.voz} onChange={e => onUpdate(i, 'voz', e.target.value)} className="min-h-[60px]" />
            <Textarea placeholder="O que essa parte deseja profundamente?" value={p.desejo} onChange={e => onUpdate(i, 'desejo', e.target.value)} className="min-h-[50px]" />
            <Textarea placeholder="Do que essa parte tem medo?" value={p.medo} onChange={e => onUpdate(i, 'medo', e.target.value)} className="min-h-[50px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
