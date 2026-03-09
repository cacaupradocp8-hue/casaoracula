
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Relacionamento } from './constants';
import { Eye } from 'lucide-react';

interface Props {
  relacionamentos: Relacionamento[];
  onUpdate: (index: number, field: keyof Relacionamento, value: string) => void;
}

export function TelaProjecoes({ relacionamentos, onUpdate }: Props) {
  return (
    <Card className="border-border/30 bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Reconhecendo Projeções</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Ao olhar para o que admira e o que te irrita, o que isso diz sobre você mesma?
          Que parte sua está sendo projetada nesse vínculo?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {relacionamentos.map((r, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/30 space-y-2">
            <p className="text-sm font-medium text-foreground">{r.nome || `Pessoa ${i + 1}`}</p>
            {r.admiracao && <p className="text-xs text-muted-foreground">☀️ Admira: {r.admiracao.slice(0, 80)}...</p>}
            {r.irritacao && <p className="text-xs text-muted-foreground">🌑 Irrita: {r.irritacao.slice(0, 80)}...</p>}
            <Textarea
              placeholder="Que parte sua está sendo projetada nesse vínculo?"
              value={r.projecao}
              onChange={e => onUpdate(i, 'projecao', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
