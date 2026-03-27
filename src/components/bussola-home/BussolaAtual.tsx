import { motion } from 'framer-motion';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

interface Props {
  leituraMomento: string | null;
  distritoDominante: DistritoResumo | null;
  distritoTensao: DistritoResumo | null;
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao';
  temCartografia: boolean;
  welcomeName: string;
}

const NIVEL_BADGE: Record<string, { label: string; style: string }> = {
  inicio: { label: 'Início', style: 'bg-primary/10 text-primary/70 border-primary/15' },
  travessia: { label: 'Travessia', style: 'bg-amber-500/10 text-amber-600/70 border-amber-500/15' },
  integracao: { label: 'Integração', style: 'bg-emerald-500/10 text-emerald-600/70 border-emerald-500/15' },
};

export function BussolaAtual({ leituraMomento, distritoDominante, distritoTensao, nivelIntegracao, temCartografia, welcomeName }: Props) {
  if (!temCartografia) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="font-display text-xl text-foreground mb-1">
          Bem-vinda, <span className="text-primary">{welcomeName}</span>
        </p>
        <p className="text-sm text-muted-foreground/60">
          Sua jornada começa pela revelação do seu mapa interior.
        </p>
      </motion.section>
    );
  }

  const badge = NIVEL_BADGE[nivelIntegracao];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Seu momento na jornada
        </p>
        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${badge.style}`}>
          {badge.label}
        </span>
      </div>

      <div className="rounded-2xl border border-border/15 bg-card/30 p-5 space-y-3">
        {/* Distrito + Estado */}
        <div className="flex items-center gap-3">
          {distritoDominante && (
            <div className="w-11 h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">{distritoDominante.icon}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {distritoDominante && (
              <p className="text-sm font-medium text-foreground">
                {distritoDominante.nome}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted-foreground/60 capitalize">
                {distritoDominante?.estado === 'central' ? 'ativo' : distritoDominante?.estado}
              </span>
              {distritoTensao && (
                <>
                  <span className="w-1 h-1 rounded-full bg-destructive/40" />
                  <span className="text-[10px] text-destructive/60">
                    Tensão: {distritoTensao.nome}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Leitura clínica direta */}
        {leituraMomento && (
          <p className="text-[13px] text-foreground/70 leading-relaxed">
            {leituraMomento}
          </p>
        )}
      </div>
    </motion.section>
  );
}
