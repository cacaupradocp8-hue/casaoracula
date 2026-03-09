import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, MessageCircle } from 'lucide-react';
import { ParteInterna, Dialogo } from './constants';

interface Props {
  partes: ParteInterna[];
  dialogos: Dialogo[];
  temaConselho: string;
  onAddDialogo: () => void;
  onRemoveDialogo: (index: number) => void;
  onUpdateDialogo: (index: number, field: keyof Dialogo, value: string) => void;
  onChangeTema: (value: string) => void;
}

export function TelaDialogo({ partes, dialogos, temaConselho, onAddDialogo, onRemoveDialogo, onUpdateDialogo, onChangeTema }: Props) {
  const nomes = partes.map(p => p.nome).filter(Boolean);

  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Diálogo entre Partes</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Defina o tema do conselho e facilite o diálogo entre as partes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Tema do Conselho</label>
          <Input placeholder="Sobre o que as partes precisam dialogar?" value={temaConselho} onChange={e => onChangeTema(e.target.value)} />
        </div>

        {dialogos.map((d, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Fala {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveDialogo(i)}><X className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={d.deParte} onValueChange={v => onUpdateDialogo(i, 'deParte', v)}>
                <SelectTrigger><SelectValue placeholder="Quem fala" /></SelectTrigger>
                <SelectContent>{nomes.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={d.paraParte} onValueChange={v => onUpdateDialogo(i, 'paraParte', v)}>
                <SelectTrigger><SelectValue placeholder="Para quem" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__todos__">Todo o Conselho</SelectItem>
                  {nomes.filter(n => n !== d.deParte).map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="O que essa parte diz..." value={d.mensagem} onChange={e => onUpdateDialogo(i, 'mensagem', e.target.value)} className="min-h-[50px]" />
          </div>
        ))}

        <Button variant="outline" className="w-full border-dashed" onClick={onAddDialogo}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Fala
        </Button>
      </CardContent>
    </Card>
  );
}
