import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X, Sparkles } from 'lucide-react';
import { RitualState, ElementoRitual, ELEMENTOS_SUGERIDOS, EMPTY_ELEMENTO } from './constants';

interface Props {
  state: RitualState;
  onChange: (field: keyof RitualState, value: any) => void;
  onAddElemento: () => void;
  onRemoveElemento: (index: number) => void;
  onUpdateElemento: (index: number, field: keyof ElementoRitual, value: string) => void;
}

export function TelaConstrucao({ state, onChange, onAddElemento, onRemoveElemento, onUpdateElemento }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Construção do Ritual</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Monte seu ritual com elementos simbólicos significativos.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Elementos do ritual</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {ELEMENTOS_SUGERIDOS.map(el => (
              <button
                key={el}
                className="text-xs px-2 py-1 rounded-full border border-border/30 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => {
                  if (!state.elementos.find(e => e.nome === el)) {
                    onAddElemento();
                    setTimeout(() => onUpdateElemento(state.elementos.length, 'nome', el), 0);
                  }
                }}
              >
                {el}
              </button>
            ))}
          </div>
          {state.elementos.map((el, i) => (
            <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/30 space-y-2">
              <div className="flex items-center justify-between">
                <Input placeholder="Elemento" value={el.nome} onChange={e => onUpdateElemento(i, 'nome', e.target.value)} className="flex-1" />
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => onRemoveElemento(i)}><X className="h-3 w-3" /></Button>
              </div>
              <Input placeholder="Significado pessoal deste elemento" value={el.significado} onChange={e => onUpdateElemento(i, 'significado', e.target.value)} />
            </div>
          ))}
          <Button variant="outline" className="w-full border-dashed" onClick={onAddElemento}><Plus className="h-4 w-4 mr-1" /> Adicionar Elemento</Button>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Intenção do ritual</label>
          <Textarea placeholder="Qual é a intenção central deste ritual?" value={state.intencao} onChange={e => onChange('intencao', e.target.value)} className="min-h-[60px]" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Compromisso</label>
          <Textarea placeholder="Que compromisso você faz consigo mesma a partir daqui?" value={state.compromisso} onChange={e => onChange('compromisso', e.target.value)} className="min-h-[60px]" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Data do ritual</label>
          <Input type="date" value={state.dataRitual} onChange={e => onChange('dataRitual', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}
