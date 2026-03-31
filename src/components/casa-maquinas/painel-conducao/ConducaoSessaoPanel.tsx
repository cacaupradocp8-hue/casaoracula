import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Lightbulb, FileText, Brain } from 'lucide-react';

interface SessionInsight {
  text: string;
  timestamp: string;
}

interface Props {
  usedTools: { id: string; nome: string }[];
  insights: SessionInsight[];
  onAddInsight: (text: string) => void;
  onRemoveInsight: (index: number) => void;
  sessionNotes: string;
  onSessionNotesChange: (v: string) => void;
  hipoteseSimbolica: string;
  onHipoteseSimbolica: (v: string) => void;
  proximoPasso: string;
  onProximoPassoChange: (v: string) => void;
}

export function ConducaoSessaoPanel({
  usedTools,
  insights,
  onAddInsight,
  onRemoveInsight,
  sessionNotes,
  onSessionNotesChange,
  hipoteseSimbólica,
  onHipoteseSimbolica Change,
  proximoPasso,
  onProximoPassoChange,
}: Props) {
  const [newInsight, setNewInsight] = useState('');

  const handleAdd = () => {
    if (!newInsight.trim()) return;
    onAddInsight(newInsight.trim());
    setNewInsight('');
  };

  return (
    <div className="space-y-4">
      {/* Ferramentas utilizadas */}
      {usedTools.length > 0 && (
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-medium">Ferramentas utilizadas</p>
          <div className="flex flex-wrap gap-1">
            {usedTools.map(t => (
              <Badge key={t.id} variant="secondary" className="text-[10px]">{t.nome}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Insights emergentes */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-primary/50" />
            <p className="text-xs font-medium text-foreground">Insights emergentes</p>
          </div>
          {insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/20 border border-border/10">
              <p className="text-xs text-foreground/80 flex-1">{ins.text}</p>
              <button onClick={() => onRemoveInsight(i)} className="text-muted-foreground/40 hover:text-destructive shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newInsight}
              onChange={e => setNewInsight(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 text-xs bg-background/60 border border-border/30 rounded px-2 py-1.5 text-foreground placeholder:text-muted-foreground/40"
              placeholder="Registrar insight..."
            />
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleAdd} disabled={!newInsight.trim()}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hipótese simbólica — OBRIGATÓRIO */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-primary/60" />
            <p className="text-xs font-medium text-foreground">Hipótese simbólica da sessão</p>
          </div>
          <Textarea
            value={hipoteseSimbólica}
            onChange={e => onHipoteseSimbolica Change(e.target.value)}
            className="text-xs bg-background/60 border-border/30 min-h-[70px]"
            placeholder="Qual a hipótese simbólica que emergiu nesta sessão? Este campo consolida o raciocínio clínico..."
          />
        </CardContent>
      </Card>

      {/* Notas da sessão */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-foreground/50" />
            <p className="text-xs font-medium text-foreground">Notas da sessão</p>
          </div>
          <Textarea
            value={sessionNotes}
            onChange={e => onSessionNotesChange(e.target.value)}
            className="text-xs bg-background/60 border-border/30 min-h-[60px]"
            placeholder="Anotações privadas da sessão..."
          />
        </CardContent>
      </Card>

      {/* Próximo passo */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-3 space-y-2">
          <p className="text-xs font-medium text-foreground">Próximo passo</p>
          <Textarea
            value={proximoPasso}
            onChange={e => onProximoPassoChange(e.target.value)}
            className="text-xs bg-background/60 border-border/30 min-h-[50px]"
            placeholder="Sugestão para a próxima sessão ou orientação para o Jardim..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
