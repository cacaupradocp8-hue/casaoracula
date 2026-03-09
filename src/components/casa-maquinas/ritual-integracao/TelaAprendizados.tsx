import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Aprendizado, AREAS_APRENDIZADO, EMPTY_APRENDIZADO } from './constants';

interface Props {
  aprendizados: Aprendizado[];
  onUpdate: (index: number, field: keyof Aprendizado, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function TelaAprendizados({ aprendizados, onUpdate, onAdd, onRemove }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">O que você aprendeu?</CardTitle>
        <p className="text-sm text-muted-foreground">Identifique os aprendizados que marcaram esta fase da jornada.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {aprendizados.map((a, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Aprendizado {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(i)}><X className="h-3 w-3" /></Button>
            </div>
            <Select value={a.area} onValueChange={v => onUpdate(i, 'area', v)}>
              <SelectTrigger><SelectValue placeholder="Área de aprendizado" /></SelectTrigger>
              <SelectContent>{AREAS_APRENDIZADO.map(ar => <SelectItem key={ar} value={ar}>{ar}</SelectItem>)}</SelectContent>
            </Select>
            <Textarea placeholder="Descreva o aprendizado..." value={a.descricao} onChange={e => onUpdate(i, 'descricao', e.target.value)} className="min-h-[60px]" />
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Importância</span><span>{a.importancia}/10</span></div>
              <Slider value={[a.importancia]} onValueChange={([v]) => onUpdate(i, 'importancia', v)} min={1} max={10} step={1} />
            </div>
          </div>
        ))}
        {aprendizados.length < 10 && (
          <Button variant="outline" className="w-full border-dashed" onClick={onAdd}><Plus className="h-4 w-4 mr-1" /> Adicionar Aprendizado</Button>
        )}
      </CardContent>
    </Card>
  );
}
