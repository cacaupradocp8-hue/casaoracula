import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

export interface ImpactoCidadela {
  distrito: string;
  tipo_impacto: 'ativacao' | 'estabilizacao';
  intensidade: 1 | 2 | 3;
  condicao?: string;
}

const DISTRITOS = [
  'Torres', 'Portas', 'Praças', 'Labirinto',
  'Jardim', 'Templo', 'Muralhas', 'Catacumbas',
];

interface Props {
  value: ImpactoCidadela[];
  onChange: (v: ImpactoCidadela[]) => void;
}

export function ImpactoCidadelaForm({ value, onChange }: Props) {
  const list = Array.isArray(value) ? value : [];

  const update = (idx: number, patch: Partial<ImpactoCidadela>) => {
    const next = [...list];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const add = () => {
    onChange([...list, { distrito: 'Torres', tipo_impacto: 'ativacao', intensidade: 1 }]);
  };

  const remove = (idx: number) => {
    onChange(list.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Impacto na CidaDELA
        </Label>
        <Button size="sm" variant="ghost" onClick={add} type="button" className="h-7 text-xs gap-1">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </div>

      {list.length === 0 && (
        <p className="text-xs text-muted-foreground italic px-3 py-2 border border-dashed rounded-md">
          Nenhum impacto. Este passo não altera o mapa simbólico.
        </p>
      )}

      {list.map((imp, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-end p-2 border border-border/50 rounded-md">
          <div className="space-y-1">
            <Label className="text-[10px]">Distrito</Label>
            <Select value={imp.distrito} onValueChange={v => update(idx, { distrito: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DISTRITOS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Tipo</Label>
            <Select value={imp.tipo_impacto} onValueChange={(v: any) => update(idx, { tipo_impacto: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativacao">Ativação</SelectItem>
                <SelectItem value="estabilizacao">Estabilização</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Intensidade</Label>
            <Input
              type="number"
              min={1}
              max={3}
              className="h-8 text-xs"
              value={imp.intensidade}
              onChange={e => update(idx, { intensidade: Math.min(3, Math.max(1, parseInt(e.target.value) || 1)) as 1 | 2 | 3 })}
            />
          </div>
          <Button size="icon" variant="ghost" onClick={() => remove(idx)} type="button" className="h-8 w-8">
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
