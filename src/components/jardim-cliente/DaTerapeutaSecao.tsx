import { Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrientacaoCard } from '@/components/jardim/OrientacaoCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { JardimEntry, Pratica, SessaoCompartilhada } from '@/hooks/useClienteJardimCompleto';
import type { Orientacao } from '@/hooks/useOrientacoes';

interface Props {
  orientacoes: Orientacao[];
  entriesTerapeuta: JardimEntry[];
  praticas: Pratica[];
  sessoesCompartilhadas: SessaoCompartilhada[];
  onCompletarOrientacao: (id: string, resposta?: string) => Promise<boolean>;
  onResponderOrientacao: (id: string, resposta: string) => Promise<boolean>;
  onMarcarVistaOrientacao: (id: string) => void;
}

export function DaTerapeutaSecao({
  orientacoes,
  entriesTerapeuta,
  praticas,
  sessoesCompartilhadas,
  onCompletarOrientacao,
  onResponderOrientacao,
  onMarcarVistaOrientacao,
}: Props) {
  const pendentes = orientacoes.filter((o) => o.status !== 'completed');
  const concluidas = orientacoes.filter((o) => o.status === 'completed');
  const temAlgo = pendentes.length > 0 || entriesTerapeuta.length > 0 || praticas.length > 0 || sessoesCompartilhadas.length > 0;

  if (!temAlgo && concluidas.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="w-6 h-6 text-emerald-500/30 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground/50">
          Nenhuma orientação da terapeuta por enquanto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Orientações pendentes */}
      {pendentes.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/50 text-center">
            Orientações para você
          </p>
          {pendentes.map((o) => (
            <OrientacaoCard
              key={o.id}
              orientacao={o}
              onComplete={onCompletarOrientacao}
              onRespond={onResponderOrientacao}
              onView={onMarcarVistaOrientacao}
            />
          ))}
        </div>
      )}

      {/* Entries da terapeuta */}
      {entriesTerapeuta.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
            Mensagens
          </p>
          {entriesTerapeuta.map((e) => (
            <div key={e.id} className="rounded-xl p-4 border border-emerald-500/15 bg-emerald-950/10">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400">
                  <Leaf className="w-3 h-3 mr-1" />
                  Da terapeuta
                </Badge>
                <span className="text-[10px] text-muted-foreground/40">
                  {format(new Date(e.created_at), "dd MMM", { locale: ptBR })}
                </span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{e.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Práticas */}
      {praticas.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
            Práticas sugeridas
          </p>
          {praticas.map((p) => (
            <div key={p.id} className="rounded-xl p-4 border border-border/20 bg-card/50">
              <div className="flex items-center gap-2 mb-1.5">
                <span>{p.status === 'concluida' ? '✅' : '🌱'}</span>
                <span className="text-xs font-medium text-foreground/80">{p.titulo}</span>
                <Badge variant="outline" className="text-[9px] ml-auto">
                  {p.status === 'proposta' ? 'Nova' : p.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                </Badge>
              </div>
              {p.descricao && (
                <p className="text-xs text-muted-foreground/60 ml-6 leading-relaxed">{p.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sessões compartilhadas */}
      {sessoesCompartilhadas.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center">
            Sessões registradas
          </p>
          {sessoesCompartilhadas.map((s) => (
            <div key={s.id} className="rounded-xl p-3 border border-border/15 bg-card/30 flex items-center gap-3">
              <span className="text-sm">💜</span>
              <div>
                <p className="text-xs text-foreground/70">Sessão registrada</p>
                <p className="text-[10px] text-muted-foreground/40">
                  {s.session_date
                    ? format(new Date(s.session_date), "dd 'de' MMMM · HH:mm", { locale: ptBR })
                    : format(new Date(s.created_at), "dd MMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Concluídas */}
      {concluidas.length > 0 && (
        <details className="group">
          <summary className="text-[10px] text-muted-foreground/40 cursor-pointer text-center hover:text-muted-foreground/60 transition-colors">
            {concluidas.length} orientação(ões) concluída(s)
          </summary>
          <div className="space-y-3 mt-3">
            {concluidas.map((o) => (
              <OrientacaoCard
                key={o.id}
                orientacao={o}
                onComplete={onCompletarOrientacao}
                onRespond={onResponderOrientacao}
                onView={onMarcarVistaOrientacao}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
