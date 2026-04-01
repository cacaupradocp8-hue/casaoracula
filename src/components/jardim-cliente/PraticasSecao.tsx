import { Badge } from '@/components/ui/badge';
import type { Pratica } from '@/hooks/useClienteJardimCompleto';

interface Props {
  praticas: Pratica[];
}

export function PraticasSecao({ praticas }: Props) {
  const pendentes = praticas.filter((p) => p.status !== 'concluida');
  const concluidas = praticas.filter((p) => p.status === 'concluida');

  if (praticas.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-2xl mb-3 block">🌱</span>
        <p className="text-xs text-muted-foreground/50">
          Nenhuma prática sugerida ainda.
        </p>
        <p className="text-[10px] text-muted-foreground/30 mt-1">
          Sua terapeuta poderá enviar práticas durante ou após a sessão.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendentes.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
            Em andamento
          </p>
          {pendentes.map((p) => (
            <div key={p.id} className="rounded-xl p-4 border border-emerald-500/15 bg-emerald-500/5 space-y-2">
              <div className="flex items-center gap-2">
                <span>🌱</span>
                <span className="text-sm font-medium text-foreground/80 flex-1">{p.titulo}</span>
                <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400">
                  {p.status === 'proposta' ? 'Nova' : 'Em andamento'}
                </Badge>
              </div>
              {p.descricao && (
                <p className="text-xs text-muted-foreground/60 leading-relaxed pl-6">{p.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {concluidas.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 text-center">
            Concluídas
          </p>
          {concluidas.map((p) => (
            <div key={p.id} className="rounded-xl p-3 border border-border/10 bg-card/30 opacity-70">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-xs text-foreground/60">{p.titulo}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
