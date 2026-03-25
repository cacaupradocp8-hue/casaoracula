import { motion } from 'framer-motion';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

interface Props {
  leituraMomento: string | null;
  distritoDominante: DistritoResumo | null;
  distritoTensao: DistritoResumo | null;
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao';
  temCartografia: boolean;
}

const NIVEL_LABEL: Record<string, string> = {
  inicio: 'Início da jornada',
  travessia: 'Em travessia',
  integracao: 'Fase de integração',
};

export function BussolaAtual({ leituraMomento, distritoDominante, distritoTensao, nivelIntegracao, temCartografia }: Props) {
  if (!temCartografia) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
        Seu momento na jornada
      </p>

      <div className="rounded-2xl border border-border/15 p-5 space-y-3">
        {/* Distrito + Estado */}
        <div className="flex items-center gap-3">
          {distritoDominante && (
            <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">{distritoDominante.icon}</span>
            </div>
          )}
          <div className="min-w-0">
            {distritoDominante && (
              <p className="text-sm font-medium text-foreground truncate">
                {distritoDominante.nome}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground/60">
              {NIVEL_LABEL[nivelIntegracao]}
              {distritoTensao && (
                <span className="text-destructive/60"> · Tensão: {distritoTensao.nome}</span>
              )}
            </p>
          </div>
        </div>

        {/* Leitura direta */}
        {leituraMomento && (
          <p className="text-sm text-foreground/65 leading-relaxed">
            {leituraMomento}
          </p>
        )}
      </div>
    </motion.section>
  );
}
