import { CORES_SIMBOLICAS, TERRITORIOS, SIMBOLOS } from './constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, Share2 } from 'lucide-react';

interface Props {
  cor: string;
  atmosfera: string[];
  territorios: string[];
  recursos: string;
  conflitos: string;
  simbolo: string;
  pontoPartida: string;
  indiceEquilibrio: number;
  saving: boolean;
  onSave: () => void;
  onBack: () => void;
}

export function TelaVisualizacao({
  cor, atmosfera, territorios, recursos, conflitos, simbolo,
  pontoPartida, indiceEquilibrio, saving, onSave, onBack,
}: Props) {
  const corObj = CORES_SIMBOLICAS.find(c => c.nome === cor);
  const simboloObj = SIMBOLOS.find(s => s.nome === simbolo);
  const terrObjs = TERRITORIOS.filter(t => territorios.includes(t.key));
  const pontoObj = TERRITORIOS.find(t => t.key === pontoPartida);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-display text-foreground">Sua Cartografia Psíquica</h3>
        <p className="text-xs text-muted-foreground italic">Mapa simbólico do seu estado interior</p>
      </div>

      {/* Visual Map */}
      <Card className="border-border/20 overflow-hidden">
        <div
          className="relative p-6 min-h-[320px] flex flex-col items-center justify-center"
          style={{ background: `radial-gradient(ellipse at center, ${corObj?.hex || '#0B1B2B'}22 0%, transparent 70%)` }}
        >
          {/* Atmosphere badges */}
          <div className="absolute top-3 left-0 right-0 flex flex-wrap justify-center gap-1.5 px-3">
            {atmosfera.map(a => (
              <span key={a} className="text-[9px] px-2 py-0.5 rounded-full bg-card/60 border border-border/20 text-muted-foreground">
                {a}
              </span>
            ))}
          </div>

          {/* Center symbol */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <span className="text-4xl">{simboloObj?.icon || '✨'}</span>
            <span className="text-[10px] text-primary font-medium">{simbolo}</span>
          </div>

          {/* Territories around */}
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {terrObjs.map(t => (
              <div
                key={t.key}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                  t.key === pontoPartida
                    ? 'bg-primary/15 border-primary/40 text-primary font-medium'
                    : 'bg-card/50 border-border/30 text-foreground/80'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.nome}</span>
              </div>
            ))}
          </div>

          {/* Equilibrium index */}
          <div className="absolute bottom-3 right-3 flex flex-col items-center">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.91" fill="transparent"
                  stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeDasharray={`${indiceEquilibrio} ${100 - indiceEquilibrio}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                {indiceEquilibrio}
              </span>
            </div>
            <span className="text-[8px] text-muted-foreground mt-0.5">equilíbrio</span>
          </div>

          {/* Cor indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full border border-border/30" style={{ backgroundColor: corObj?.hex }} />
            <span className="text-[9px] text-muted-foreground">{cor}</span>
          </div>
        </div>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        {recursos && (
          <Card className="border-border/20 bg-card/60 col-span-2">
            <CardContent className="p-3">
              <p className="text-[10px] text-accent uppercase tracking-wider mb-1">Recursos</p>
              <p className="text-xs text-foreground/80 whitespace-pre-line">{recursos}</p>
            </CardContent>
          </Card>
        )}
        {conflitos && (
          <Card className="border-destructive/20 bg-card/60 col-span-2">
            <CardContent className="p-3">
              <p className="text-[10px] text-destructive uppercase tracking-wider mb-1">Tensões</p>
              <p className="text-xs text-foreground/80 whitespace-pre-line">{conflitos}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {pontoObj && (
        <p className="text-xs text-center text-muted-foreground">
          Ponto de partida: <span className="text-primary font-medium">{pontoObj.icon} {pontoObj.nome}</span>
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onSave} disabled={saving} variant="gold" className="flex-1">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar cartografia</>}
        </Button>
      </div>
    </div>
  );
}
