
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Relacionamento, TIPOS_RELACIONAMENTO, QUALIDADES_RELACAO } from './constants';

interface Props {
  relacionamentos: Relacionamento[];
  onUpdate: (index: number, field: keyof Relacionamento, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function TelaIdentificacao({ relacionamentos, onUpdate, onAdd, onRemove }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Identifique seus relacionamentos significativos</CardTitle>
        <p className="text-sm text-muted-foreground">Pense nas pessoas que mais impactam sua vida emocional (até 7)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {relacionamentos.map((r, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Pessoa {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(i)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input
              placeholder="Nome ou iniciais"
              value={r.nome}
              onChange={e => onUpdate(i, 'nome', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={r.tipo} onValueChange={v => onUpdate(i, 'tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Tipo de vínculo" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_RELACIONAMENTO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={r.qualidade} onValueChange={v => onUpdate(i, 'qualidade', v)}>
                <SelectTrigger><SelectValue placeholder="Qualidade" /></SelectTrigger>
                <SelectContent>
                  {QUALIDADES_RELACAO.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {relacionamentos.length < 7 && (
          <Button variant="outline" className="w-full border-dashed" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Pessoa
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
