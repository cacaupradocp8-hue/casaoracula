import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Complexo, EMOCOES_COMPLEXO, FREQUENCIAS, EMPTY_COMPLEXO } from './constants';

interface Props {
  complexos: Complexo[];
  onUpdate: (index: number, field: keyof Complexo, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function TelaRegistro({ complexos, onUpdate, onAdd, onRemove }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Identifique seus complexos</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pense em reações emocionais intensas que se repetem — momentos em que "algo toma conta" de você.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {complexos.map((c, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Complexo {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(i)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input placeholder="Nomeie este complexo (ex: Complexo de Abandono)" value={c.nome} onChange={e => onUpdate(i, 'nome', e.target.value)} />
            <Textarea placeholder="O que dispara esse padrão? (gatilho)" value={c.gatilho} onChange={e => onUpdate(i, 'gatilho', e.target.value)} className="min-h-[60px]" />
            <Textarea placeholder="Qual é a reação automática?" value={c.reacaoAutomatica} onChange={e => onUpdate(i, 'reacaoAutomatica', e.target.value)} className="min-h-[60px]" />
            <div className="grid grid-cols-2 gap-2">
              <Select value={c.emocaoCentral} onValueChange={v => onUpdate(i, 'emocaoCentral', v)}>
                <SelectTrigger><SelectValue placeholder="Emoção central" /></SelectTrigger>
                <SelectContent>{EMOCOES_COMPLEXO.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={c.frequencia} onValueChange={v => onUpdate(i, 'frequencia', v)}>
                <SelectTrigger><SelectValue placeholder="Frequência" /></SelectTrigger>
                <SelectContent>{FREQUENCIAS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Intensidade</span><span>{c.intensidade}/10</span>
              </div>
              <Slider value={[c.intensidade]} onValueChange={([v]) => onUpdate(i, 'intensidade', v)} min={1} max={10} step={1} />
            </div>
          </div>
        ))}
        {complexos.length < 8 && (
          <Button variant="outline" className="w-full border-dashed" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Complexo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
