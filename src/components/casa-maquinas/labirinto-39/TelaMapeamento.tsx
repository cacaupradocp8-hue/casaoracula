import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Porta, GrupoEmocional, EstadoPorta } from './constants';
import { DoorOpen, DoorClosed, Lock } from 'lucide-react';
import { useState } from 'react';

interface Props {
  portas: Porta[];
  grupos: GrupoEmocional[];
  stats: { mapped: number };
  onSetEstado: (emocao: string, estado: EstadoPorta) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ESTADO_OPTS: { value: EstadoPorta; label: string; icon: typeof DoorOpen; cls: string }[] = [
  { value: 'aberta', label: 'Aberta', icon: DoorOpen, cls: 'text-green-400 border-green-400/40 bg-green-400/10' },
  { value: 'fechada', label: 'Fechada', icon: DoorClosed, cls: 'text-muted-foreground border-muted/40 bg-muted/10' },
  { value: 'trancada', label: 'Trancada', icon: Lock, cls: 'text-red-400 border-red-400/40 bg-red-400/10' },
];

export function TelaMapeamento({ portas, grupos, stats, onSetEstado, onNext, onPrev }: Props) {
  const [grupoAtivo, setGrupoAtivo] = useState(0);
  const grupo = grupos[grupoAtivo];
  const grupoPortas = portas.filter(p => p.grupo === grupo.nome);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Mapeamento Interativo</h3>
        <p className="text-xs text-muted-foreground">
          {stats.mapped} de 39 portas mapeadas
        </p>
        <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(stats.mapped / 39) * 100}%` }}
          />
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-1 justify-center">
        {grupos.map((g, i) => {
          const done = portas.filter(p => p.grupo === g.nome && p.estado !== null).length;
          return (
            <button
              key={g.nome}
              onClick={() => setGrupoAtivo(i)}
              className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                i === grupoAtivo
                  ? 'border-primary bg-primary/15 text-primary font-semibold'
                  : done === 5
                  ? 'border-green-400/30 bg-green-400/5 text-green-400'
                  : 'border-border/20 text-muted-foreground hover:border-border/40'
              }`}
            >
              {g.nome} {done > 0 && <span className="opacity-60">({done}/5)</span>}
            </button>
          );
        })}
      </div>

      {/* Current group doors */}
      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: grupo.cor }} />
            <span className="text-sm font-semibold text-foreground">{grupo.nome}</span>
          </div>

          {grupoPortas.map(porta => (
            <div key={porta.emocao} className="flex items-center justify-between gap-2 py-2 border-b border-border/10 last:border-0">
              <span className="text-sm text-foreground font-medium">{porta.emocao}</span>
              <div className="flex gap-1">
                {ESTADO_OPTS.map(opt => {
                  const Icon = opt.icon;
                  const active = porta.estado === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onSetEstado(porta.emocao, active ? null : opt.value)}
                      className={`p-1.5 rounded-md border text-[10px] flex items-center gap-1 transition-all ${
                        active ? opt.cls + ' font-semibold' : 'border-transparent text-muted-foreground/40 hover:text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation between groups */}
      <div className="flex gap-2">
        {grupoAtivo > 0 ? (
          <Button variant="outline" onClick={() => setGrupoAtivo(grupoAtivo - 1)} className="flex-1">
            ← {grupos[grupoAtivo - 1].nome}
          </Button>
        ) : (
          <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        )}
        {grupoAtivo < grupos.length - 1 ? (
          <Button onClick={() => setGrupoAtivo(grupoAtivo + 1)} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
            {grupos[grupoAtivo + 1].nome} →
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={stats.mapped < 39}
            className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {stats.mapped < 39 ? `Faltam ${39 - stats.mapped}` : 'Explorar Resultados'}
          </Button>
        )}
      </div>
    </div>
  );
}
