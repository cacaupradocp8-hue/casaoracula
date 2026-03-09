import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ARQUETIPOS } from './constants';

interface Props {
  selecionados: string[];
  descricoes: Record<string, string>;
  atividades: Record<string, number>;
  situacoes: Record<string, string>;
  onDescricao: (nome: string, val: string) => void;
  onAtividade: (nome: string, val: number) => void;
  onSituacao: (nome: string, val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasCaracterizacao({
  selecionados, descricoes, atividades, situacoes,
  onDescricao, onAtividade, onSituacao, onNext, onPrev,
}: Props) {
  const [idx, setIdx] = useState(0);
  const nome = selecionados[idx];
  const arq = ARQUETIPOS.find(a => a.nome === nome);
  if (!arq) return null;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Caracterização</h3>
        <p className="text-sm text-muted-foreground">
          Arquétipo {idx + 1} de {selecionados.length}
        </p>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: arq.cor + '20' }}
            >
              {arq.icone}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{arq.nome}</div>
              <div className="text-[10px] text-muted-foreground">{arq.keywords}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Como esse arquétipo se manifesta em você?</label>
            <Textarea
              value={descricoes[nome] || ''}
              onChange={e => onDescricao(nome, e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[80px]"
              placeholder="Descreva a manifestação..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Quão ativo é esse arquétipo?</label>
              <span className="text-sm font-bold text-primary">{atividades[nome] || 5}/10</span>
            </div>
            <Slider
              value={[atividades[nome] || 5]}
              onValueChange={([v]) => onAtividade(nome, v)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Dormindo</span>
              <span>Muito ativo</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Em que situações ele aparece?</label>
            <Textarea
              value={situacoes[nome] || ''}
              onChange={e => onSituacao(nome, e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[60px]"
              placeholder="Descreva as situações..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {idx > 0 ? (
          <Button variant="outline" onClick={() => setIdx(idx - 1)} className="flex-1">
            ← {selecionados[idx - 1]}
          </Button>
        ) : (
          <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        )}
        {idx < selecionados.length - 1 ? (
          <Button onClick={() => setIdx(idx + 1)} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
            {selecionados[idx + 1]} →
          </Button>
        ) : (
          <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
            Dinâmica
          </Button>
        )}
      </div>
    </div>
  );
}
