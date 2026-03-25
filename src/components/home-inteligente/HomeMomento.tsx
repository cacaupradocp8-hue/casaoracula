import { motion } from 'framer-motion';
import type { MomentoData, MapaData } from '@/hooks/useHomeInteligente';

interface Props { momento: MomentoData; mapa: MapaData; }

export function HomeMomento({ momento, mapa }: Props) {
  if (!mapa.temCartografia || !momento.direcaoSimbolica) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="mb-8"
    >
      <div className="relative rounded-2xl border border-primary/8 p-5 overflow-hidden">
        {/* Fundo sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ background: `radial-gradient(circle at 30% 50%, ${mapa.corHex}, transparent 70%)` }}
        />

        <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-3 relative z-10">
          Seu momento atual
        </p>

        <blockquote className="text-sm md:text-base text-foreground/70 italic font-display leading-relaxed relative z-10 max-w-lg">
          "{momento.direcaoSimbolica}"
        </blockquote>

        {(momento.distritoAtivo || momento.distritoTensao) && (
          <div className="flex flex-wrap gap-3 mt-4 relative z-10">
            {momento.distritoAtivo && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-foreground/50">
                Território ativo: {momento.distritoAtivo}
              </span>
            )}
            {momento.distritoTensao && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-destructive/5 border border-destructive/10 text-foreground/50">
                Em tensão: {momento.distritoTensao}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
