import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ARQUETIPOS } from './constants';

interface Props {
  selecionados: string[];
  atividades: Record<string, number>;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasVisualizacao({ selecionados, atividades, onNext, onPrev }: Props) {
  const cx = 200;
  const cy = 200;
  const radius = 140;

  const nodes = ARQUETIPOS.map((a, i) => {
    const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const active = selecionados.includes(a.nome);
    const activity = atividades[a.nome] || 0;
    const size = active ? 12 + activity * 2.5 : 10;
    return { ...a, x, y, active, activity, size };
  });

  // Draw connections between active nodes
  const activeNodes = nodes.filter(n => n.active);
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < activeNodes.length; i++) {
    for (let j = i + 1; j < activeNodes.length; j++) {
      connections.push({
        x1: activeNodes[i].x,
        y1: activeNodes[i].y,
        x2: activeNodes[j].x,
        y2: activeNodes[j].y,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Visualização do Atlas</h3>
        <p className="text-sm text-muted-foreground">Mapa circular dos arquétipos</p>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full max-w-[360px]">
            {/* Center circle */}
            <circle cx={cx} cy={cy} r={30} fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.2)" strokeWidth={1} />
            <text x={cx} y={cy + 3} textAnchor="middle" className="fill-primary text-[8px] font-medium">PSIQUE</text>

            {/* Orbit ring */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="hsl(var(--border) / 0.15)" strokeWidth={1} strokeDasharray="4 4" />

            {/* Connections */}
            {connections.map((c, i) => (
              <line
                key={i}
                x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                stroke="hsl(var(--primary) / 0.12)"
                strokeWidth={0.8}
              />
            ))}

            {/* Nodes */}
            {nodes.map(n => (
              <g key={n.nome}>
                <circle
                  cx={n.x} cy={n.y} r={n.size}
                  fill={n.active ? n.cor + '30' : 'hsl(var(--muted) / 0.2)'}
                  stroke={n.active ? n.cor : 'hsl(var(--border) / 0.2)'}
                  strokeWidth={n.active ? 2 : 1}
                />
                <text x={n.x} y={n.y + 1} textAnchor="middle" className="text-[11px]">
                  {n.icone}
                </text>
                <text
                  x={n.x}
                  y={n.y + n.size + 12}
                  textAnchor="middle"
                  className={`text-[7px] ${n.active ? 'fill-foreground font-medium' : 'fill-muted-foreground/50'}`}
                >
                  {n.nome}
                </text>
                {n.active && (
                  <text
                    x={n.x}
                    y={n.y + n.size + 20}
                    textAnchor="middle"
                    className="fill-primary text-[6px]"
                  >
                    {n.activity}/10
                  </text>
                )}
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          Síntese Final
        </Button>
      </div>
    </div>
  );
}
