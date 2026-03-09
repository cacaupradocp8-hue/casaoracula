import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Porta, GRUPOS } from './constants';
import { Loader2, Save, RotateCcw, DoorOpen, DoorClosed, Lock } from 'lucide-react';

interface GrupoStat {
  nome: string;
  cor: string;
  abertas: number;
  fechadas: number;
  trancadas: number;
}

interface Props {
  portas: Porta[];
  stats: {
    abertas: number;
    fechadas: number;
    trancadas: number;
    maisAcessivel: GrupoStat | undefined;
    menosAcessivel: GrupoStat | undefined;
    byGrupo: GrupoStat[];
  };
  saving: boolean;
  onSave: () => void;
  onPrev: () => void;
  onReset: () => void;
}

function pct(n: number) {
  return Math.round((n / 39) * 100);
}

export function TelaSintese({ portas, stats, saving, onSave, onPrev, onReset }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Síntese do Labirinto</h3>
        <p className="text-sm text-muted-foreground">Visão completa do repertório emocional</p>
      </div>

      {/* Visual labyrinth grid */}
      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-3">
            {GRUPOS.map(g => {
              const gPortas = portas.filter(p => p.grupo === g.nome);
              return (
                <div key={g.nome} className="space-y-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.cor }} />
                    <span className="text-[11px] font-medium text-foreground">{g.nome}</span>
                  </div>
                  <div className="flex gap-1">
                    {gPortas.map(p => {
                      const Icon = p.estado === 'aberta' ? DoorOpen : p.estado === 'trancada' ? Lock : DoorClosed;
                      const color = p.estado === 'aberta' ? 'text-green-400 bg-green-400/10 border-green-400/30'
                        : p.estado === 'trancada' ? 'text-red-400 bg-red-400/10 border-red-400/30'
                        : 'text-muted-foreground/50 bg-muted/10 border-muted/20';
                      return (
                        <div
                          key={p.emocao}
                          title={`${p.emocao}: ${p.estado || 'não mapeada'}`}
                          className={`flex-1 flex flex-col items-center py-1.5 rounded-md border text-center ${color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[8px] mt-0.5 leading-tight line-clamp-1">{p.emocao}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/10 bg-card/80">
        <CardContent className="pt-4 space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><span className="text-green-400 font-bold text-lg">{stats.abertas}</span><br /><span className="text-[10px] text-muted-foreground">{pct(stats.abertas)}% abertas</span></div>
            <div><span className="text-muted-foreground font-bold text-lg">{stats.fechadas}</span><br /><span className="text-[10px] text-muted-foreground">{pct(stats.fechadas)}% fechadas</span></div>
            <div><span className="text-red-400 font-bold text-lg">{stats.trancadas}</span><br /><span className="text-[10px] text-muted-foreground">{pct(stats.trancadas)}% trancadas</span></div>
          </div>

          {stats.maisAcessivel && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-400/5 border border-green-400/10">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stats.maisAcessivel.cor }} />
              <span className="text-xs text-foreground">
                <strong>Mais acessível:</strong> {stats.maisAcessivel.nome} ({stats.maisAcessivel.abertas} abertas)
              </span>
            </div>
          )}

          {stats.menosAcessivel && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-400/5 border border-red-400/10">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stats.menosAcessivel.cor }} />
              <span className="text-xs text-foreground">
                <strong>Menos acessível:</strong> {stats.menosAcessivel.nome} ({stats.menosAcessivel.abertas} abertas)
              </span>
            </div>
          )}

          {stats.menosAcessivel && (
            <p className="text-xs text-primary italic text-center">
              Recomendação: Explorar o grupo "{stats.menosAcessivel.nome}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> Salvar mapeamento</>}
        </Button>
      </div>
      <Button variant="ghost" onClick={onReset} className="w-full text-muted-foreground text-xs">
        <RotateCcw className="w-3 h-3 mr-1" /> Novo mapeamento
      </Button>
    </div>
  );
}
