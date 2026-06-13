import React from 'react';
import { motion } from 'framer-motion';

/**
 * Bloco "Introdução à Jornada" — Propósito + Tese Central da Rota.
 * Exibido apenas no Hub da Rota (acima da grid de Estações).
 * Não substitui nem altera nenhum step validado.
 */
export const RotaPropositoTese: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto px-4 py-10 md:py-16"
      aria-labelledby="proposito-rota"
    >
      <div className="border border-gold/15 rounded-2xl bg-white/[0.02] backdrop-blur-sm p-6 md:p-12 space-y-8 md:space-y-10">
        <div className="space-y-3 text-center">
          <p
            id="proposito-rota"
            className="text-[10px] md:text-xs text-gold uppercase tracking-[0.4em] font-bold"
          >
            Propósito da Rota
          </p>
          <p className="text-white/85 font-cormorant text-lg md:text-2xl leading-relaxed italic">
            Desenvolvimento da leitura simbólica da psique feminina —
            sinais, padrões e movimentos de retorno.
          </p>
        </div>

        <div
          className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-3 text-center">
          <p className="text-[10px] md:text-xs text-gold/80 uppercase tracking-[0.4em] font-bold">
            Tese Central
          </p>
          <p className="text-white/90 font-display text-xl md:text-3xl leading-snug">
            Recuperação da natureza instintiva: percepção, voz,
            discernimento e soberania simbólica.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default RotaPropositoTese;
