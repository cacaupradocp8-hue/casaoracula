import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Compass, AlertTriangle, Shield, Clock, Eye, EyeOff, Ban, CheckCircle2, Milestone } from 'lucide-react';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { CartografiaProfile } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  leitura: LeituraCampo;
  profile: CartografiaProfile | null;
  /** Compact mode for use inside session */
  compact?: boolean;
}

const RISCO_COLORS: Record<string, string> = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

const RISCO_BG: Record<string, string> = {
  baixo: 'bg-emerald-500/5',
  moderado: 'bg-amber-500/5',
  elevado: 'bg-red-500/5',
};

export function CabineDecisaoClinica({ leitura, profile, compact = false }: Props) {
  const [showBase, setShowBase] = useState(false);
  const pj = profile?.profile_json;

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className={compact ? 'p-3 space-y-3' : 'p-5 space-y-4'}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold">
            Tomada de Decisão Clínica
          </p>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[9px] px-2 border-primary/20 text-primary/60">
              {leitura.estagio === 'inicio' ? 'Início' : leitura.estagio === 'meio' ? 'Meio' : 'Fechamento'}
            </Badge>
            <Badge variant="outline" className={`text-[9px] px-2 ${RISCO_COLORS[leitura.risco]}`}>
              Risco {leitura.risco}
            </Badge>
          </div>
        </div>

        {/* 🧠 ESTADO DO CAMPO — destaque máximo */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-primary/50 uppercase tracking-wider">Estado do Campo</p>
            <h3 className={`font-display font-semibold text-foreground ${compact ? 'text-sm' : 'text-base'}`}>
              {leitura.mensagem_estado}
            </h3>
          </div>
        </div>

        {/* 🧭 DIREÇÃO DE CONDUÇÃO */}
        <div className={`p-3 rounded-lg ${RISCO_BG[leitura.risco]} border border-primary/10`}>
          <div className="flex items-start gap-2">
            <Compass className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Direção de Condução</p>
              <p className="text-sm text-foreground/90 font-medium">{leitura.mensagem_direcao}</p>
            </div>
          </div>
        </div>

        {/* ⏱ RITMO DA SESSÃO */}
        {pj?.ritmo_ideal && (
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-primary/50 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] text-primary/50 uppercase tracking-wider">Ritmo da Sessão</p>
              <p className="text-xs text-foreground/80">{pj.ritmo_ideal}</p>
            </div>
          </div>
        )}

        {/* EVITAR / PRIORIZAR */}
        {(pj?.o_que_evitar || pj?.o_que_priorizar) && (
          <div className="grid grid-cols-2 gap-3">
            {pj?.o_que_evitar && (
              <div className="p-2.5 rounded-md bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-1 mb-1">
                  <Ban className="w-3 h-3 text-destructive/60" />
                  <p className="text-[9px] text-destructive/60 uppercase font-medium">Evitar</p>
                </div>
                <p className="text-[11px] text-foreground/80">{pj.o_que_evitar}</p>
              </div>
            )}
            {pj?.o_que_priorizar && (
              <div className="p-2.5 rounded-md bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-primary/60" />
                  <p className="text-[9px] text-primary/60 uppercase font-medium">Priorizar</p>
                </div>
                <p className="text-[11px] text-foreground/80">{pj.o_que_priorizar}</p>
              </div>
            )}
          </div>
        )}

        {/* Mensagem de permanência */}
        {leitura.mensagem_permanencia && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300/80 italic">{leitura.mensagem_permanencia}</p>
            </div>
          </div>
        )}

        {/* Alerta de segurança */}
        {leitura.alerta_seguranca && (
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300/80">{leitura.alerta_seguranca}</p>
            </div>
          </div>
        )}

        {/* Botão opcional para ver base da leitura */}
        {pj && !compact && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] text-muted-foreground/50 gap-1 w-full"
              onClick={() => setShowBase(!showBase)}
            >
              {showBase ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showBase ? 'Ocultar base da leitura' : 'Ver base da leitura'}
            </Button>
            {showBase && (
              <div className="p-3 rounded-lg bg-muted/10 border border-border/10 space-y-1.5">
                {pj.padrao_dominante && (
                  <p className="text-[10px] text-muted-foreground/40"><span className="font-medium">Padrão:</span> {pj.padrao_dominante}</p>
                )}
                {pj.estrategia_defesa && (
                  <p className="text-[10px] text-muted-foreground/40"><span className="font-medium">Defesa:</span> {pj.estrategia_defesa}</p>
                )}
                {pj.tensao_central && (
                  <p className="text-[10px] text-muted-foreground/40"><span className="font-medium">Tensão:</span> {pj.tensao_central}</p>
                )}
                {pj.direcao_inicial && (
                  <p className="text-[10px] text-muted-foreground/40"><span className="font-medium">Direção inicial:</span> {pj.direcao_inicial}</p>
                )}
                <p className="text-[9px] text-muted-foreground/30 italic">
                  Contexto: {profile?.contexto} · Atualizado em {profile ? new Date(profile.updated_at).toLocaleDateString('pt-BR') : ''}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
