// ============================================
// MANDALA VISUAL — MODO PESSOAL
// Visualização circular das 14 portas
// ============================================

import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

interface MapaMandalaProps {
  fasesAtravessadas: LabirintoFase[];
  todasFases: LabirintoFase[];
  registros?: Record<string, string>;
}

export function MapaMandala({ fasesAtravessadas, todasFases, registros }: MapaMandalaProps) {
  const total = todasFases.length;
  const radius = 130;
  const center = 160;

  return (
    <div className="space-y-6">
      {/* Mandala circular */}
      <div className="flex justify-center">
        <svg width="320" height="320" viewBox="0 0 320 320" className="drop-shadow-lg">
          {/* Outer ring */}
          <circle cx={center} cy={center} r={radius + 10} fill="none" stroke="hsl(var(--gold) / 0.15)" strokeWidth="1" />
          <circle cx={center} cy={center} r={radius - 30} fill="none" stroke="hsl(var(--gold) / 0.1)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Center symbol */}
          <text x={center} y={center + 6} textAnchor="middle" className="text-2xl" fill="hsl(var(--gold))">
            ✧
          </text>

          {/* Porta nodes */}
          {todasFases.map((fase, i) => {
            const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            const atravessada = fasesAtravessadas.some(f => f.id === fase.id);

            return (
              <g key={fase.id}>
                {/* Line to center */}
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={atravessada ? "hsl(var(--gold) / 0.3)" : "hsl(var(--gold) / 0.08)"}
                  strokeWidth="1"
                />
                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill={atravessada ? "hsl(var(--gold) / 0.2)" : "hsl(var(--muted) / 0.3)"}
                  stroke={atravessada ? "hsl(var(--gold))" : "hsl(var(--muted-foreground) / 0.2)"}
                  strokeWidth={atravessada ? 2 : 1}
                />
                {/* Icon/number */}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill={atravessada ? "hsl(var(--gold))" : "hsl(var(--muted-foreground) / 0.4)"}
                >
                  {fase.icone || (i + 1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {todasFases.map((fase) => {
          const atravessada = fasesAtravessadas.some(f => f.id === fase.id);
          return (
            <div
              key={fase.id}
              className={`flex items-center gap-2 py-1.5 px-2 rounded ${
                atravessada ? "text-foreground" : "text-muted-foreground/40"
              }`}
            >
              <span className="text-base">{fase.icone || "○"}</span>
              <span className="text-xs">{fase.nome}</span>
              {atravessada && <span className="text-gold text-xs ml-auto">✓</span>}
            </div>
          );
        })}
      </div>

      {/* Personal notes summary */}
      {registros && Object.keys(registros).length > 0 && (
        <div className="border-t border-gold/10 pt-4">
          <p className="text-xs text-muted-foreground mb-2">Seus registros desta travessia</p>
          {Object.entries(registros).filter(([, v]) => v.trim()).map(([key, value]) => (
            <p key={key} className="text-xs text-foreground/70 mb-1">• {value}</p>
          ))}
        </div>
      )}
    </div>
  );
}
