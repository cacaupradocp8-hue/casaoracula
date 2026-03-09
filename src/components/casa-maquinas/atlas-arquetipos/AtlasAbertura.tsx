import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, History } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  onStart: () => void;
  history: any[];
  onLoadMapping: (m: any) => void;
}

export function AtlasAbertura({ onStart, history, onLoadMapping }: Props) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-card/80 text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Atlas de Arquétipos</h2>
          <p className="text-primary text-sm font-medium">Quais forças arquetípicas vivem em você?</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Os arquétipos são padrões universais de energia e sabedoria. Cada pessoa tem um conjunto
            único de arquétipos ativos. Mapear permite compreender as forças profundas que moldam a vida.
          </p>
          <Button onClick={onStart} className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground">
            Explorar arquétipos
          </Button>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-border/30 bg-card/60">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
              <History className="w-3.5 h-3.5" /> Atlas anteriores
            </div>
            {history.map((m: any) => (
              <button
                key={m.id}
                onClick={() => onLoadMapping(m)}
                className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(m.created_at), 'dd/MM/yyyy HH:mm')}
                  </span>
                  <div className="flex gap-1.5 text-[10px]">
                    <span className="text-primary">{(m.arquetipos_selecionados || []).length} arquétipos</span>
                    {m.arquetipo_dominante && (
                      <span className="text-muted-foreground">· {m.arquetipo_dominante}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
