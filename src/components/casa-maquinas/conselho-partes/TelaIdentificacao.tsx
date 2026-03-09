import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { ParteInterna, TIPOS_PARTE, CORES_PARTE, EMPTY_PARTE } from './constants';

interface Props {
  partes: ParteInterna[];
  onUpdate: (index: number, field: keyof ParteInterna, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function TelaIdentificacao({ partes, onUpdate, onAdd, onRemove }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Identifique suas partes internas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Que vozes, personagens ou energias você reconhece dentro de si? (até 8 partes)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {partes.map((p, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3" style={{ borderLeftColor: p.cor, borderLeftWidth: 3 }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Parte {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(i)}><X className="h-3 w-3" /></Button>
            </div>
            <Input placeholder="Nome desta parte (ex: A Protetora, A Criança Ferida)" value={p.nome} onChange={e => onUpdate(i, 'nome', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Select value={p.tipo} onValueChange={v => onUpdate(i, 'tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>{TIPOS_PARTE.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={p.cor} onValueChange={v => onUpdate(i, 'cor', v)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.cor }} />
                    <span className="text-sm">Cor</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {CORES_PARTE.map(c => (
                    <SelectItem key={c} value={c}>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />{c}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {partes.length < 8 && (
          <Button variant="outline" className="w-full border-dashed" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Parte
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
