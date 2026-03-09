import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ARQUETIPOS, AtlasState } from './constants';
import { Loader2, Save, RotateCcw } from 'lucide-react';

interface GrupoStat {
  nome: string;
  val: number;
}

interface Props {
  state: AtlasState;
  stats: {
    dominante: GrupoStat | undefined;
    menosAtivo: GrupoStat | undefined;
    media: number;
    naoSelecionados: string[];
    atividades: GrupoStat[];
  };
  saving: boolean;
  onSave: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export function AtlasSintese({ state, stats, saving, onSave, onPrev, onReset }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Síntese do Atlas</h3>
        <p className="text-sm text-muted-foreground">Resumo do padrão arquetípico</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/20 bg-primary/5">
          <CardContent className="pt-3 pb-2 text-center">
            <div className="text-2xl font-bold text-primary">{state.selecionados.length}</div>
            <div className="text-[10px] text-muted-foreground">Identificados</div>
          </CardContent>
        </Card>
        <Card className="border-border/20 bg-card/60">
          <CardContent className="pt-3 pb-2 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.media.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">Atividade média</div>
          </CardContent>
        </Card>
        <Card className="border-border/20 bg-card/60">
          <CardContent className="pt-3 pb-2 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.naoSelecionados.length}</div>
            <div className="text-[10px] text-muted-foreground">Dormentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity ranking */}
      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">Ranking de atividade</div>
          {stats.atividades.map((a, i) => {
            const arq = ARQUETIPOS.find(ar => ar.nome === a.nome);
            return (
              <div key={a.nome} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                <span className="text-sm">{arq?.icone}</span>
                <span className="text-xs font-medium text-foreground flex-1">{a.nome}</span>
                <div className="w-20 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${a.val * 10}%`, backgroundColor: arq?.cor || 'hsl(var(--primary))' }}
                  />
                </div>
                <span className="text-xs text-primary font-semibold w-8 text-right">{a.val}/10</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Key insights */}
      <Card className="border-primary/10 bg-card/80">
        <CardContent className="pt-4 space-y-3 text-sm">
          {stats.dominante && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-base">{ARQUETIPOS.find(a => a.nome === stats.dominante!.nome)?.icone}</span>
              <span className="text-xs text-foreground">
                <strong>Mais ativo:</strong> {stats.dominante.nome} ({stats.dominante.val}/10)
              </span>
            </div>
          )}

          {stats.menosAtivo && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/10">
              <span className="text-base">{ARQUETIPOS.find(a => a.nome === stats.menosAtivo!.nome)?.icone}</span>
              <span className="text-xs text-foreground">
                <strong>Menos ativo:</strong> {stats.menosAtivo.nome} ({stats.menosAtivo.val}/10)
              </span>
            </div>
          )}

          {state.arquetipoDormindo && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/10">
              <span className="text-base">{ARQUETIPOS.find(a => a.nome === state.arquetipoDormindo)?.icone}</span>
              <span className="text-xs text-foreground">
                <strong>Dormindo:</strong> {state.arquetipoDormindo}
              </span>
            </div>
          )}

          {state.arquetipoDormindo && (
            <p className="text-xs text-primary italic text-center">
              Recomendação: Despertar "{state.arquetipoDormindo}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center italic">
        Leitura simbólica do campo psíquico. Não substitui julgamento clínico.
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> Salvar atlas</>}
        </Button>
      </div>
      <Button variant="ghost" onClick={onReset} className="w-full text-muted-foreground text-xs">
        <RotateCcw className="w-3 h-3 mr-1" /> Novo mapeamento
      </Button>
    </div>
  );
}
