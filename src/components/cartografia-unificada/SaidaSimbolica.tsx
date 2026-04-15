/**
 * Saída Simbólica — visão da cliente / jardim
 * Linguagem simbólica, clara e profunda. Sem termos técnicos.
 * Sem cor, sem símbolo lúdico. Profissional e simbólica.
 */

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { SaidaCliente } from '@/lib/cartografia/leituraComportamental';
import type { CidadelaDerivada } from '@/lib/cartografia/derivacaoCidadela';
import type { ProfileJsonFinal } from '@/lib/cartografia/montarProfileJson';

interface Props {
  saida: SaidaCliente;
  cidadela: CidadelaDerivada;
  profileJson?: ProfileJsonFinal;
  /** Optional AI-generated frase-semente */
  fraseSemente?: string;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export function SaidaSimbolica({ saida, cidadela, profileJson, fraseSemente }: Props) {
  const simbolica = profileJson?.leitura_simbolica;

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
          <Sparkles className="w-7 h-7 text-primary/60" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">Sua Cartografia Psíquica</h2>
        <p className="text-xs text-muted-foreground italic">Um mapa do seu campo interior neste momento</p>
      </motion.div>

      {/* Força que organiza seu campo */}
      <motion.div {...anim(0.15)}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary/60" />
              <p className="text-[10px] text-primary/60 uppercase tracking-wider font-medium">Força que organiza seu campo</p>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {simbolica?.forca_que_sustenta || saida.forca_principal}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tensão que pede escuta */}
      <motion.div {...anim(0.25)}>
        <Card className="border-amber-500/15 bg-amber-500/5">
          <CardContent className="p-5 space-y-2">
            <p className="text-[10px] text-amber-600/60 uppercase tracking-wider font-medium">Tensão que pede escuta</p>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {simbolica?.tensao_que_pede_escuta || saida.tensao_central}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Movimento necessário */}
      {simbolica?.movimento_necessario && (
        <motion.div {...anim(0.35)}>
          <Card className="border-border/15 bg-card/50">
            <CardContent className="p-5 space-y-2">
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">Movimento que pede cuidado</p>
              <p className="text-sm text-foreground/85 leading-relaxed">{simbolica.movimento_necessario}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Convite inicial */}
      <motion.div {...anim(0.4)}>
        <Card className="border-accent/15 bg-accent/5">
          <CardContent className="p-5 space-y-2">
            <p className="text-[10px] text-accent-foreground/60 uppercase tracking-wider font-medium">Convite inicial</p>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {simbolica?.convite_inicial || saida.convite_inicial}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frase-semente */}
      <motion.div {...anim(0.5)}>
        <Card className="border-primary/10">
          <CardContent className="p-5 text-center">
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-2">Frase-semente</p>
            <p className="text-base italic text-foreground/80 font-display leading-relaxed">
              "{fraseSemente || simbolica?.frase_semente || 'O mapa se revela a quem caminha.'}"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* CidaDELA visual — sem cor, sem símbolo */}
      <motion.div {...anim(0.55)}>
        <Card className="border-border/15 bg-card/40">
          <CardContent className="p-5 text-center space-y-3">
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Sua CidaDELA Interior</p>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">{cidadela.torre_dominante}</p>
              <p className="text-[10px] text-muted-foreground">{cidadela.clima_cidade}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-center">
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="2.5"
                    strokeDasharray={`${cidadela.indice_equilibrio} ${100 - cidadela.indice_equilibrio}`}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                  {cidadela.indice_equilibrio}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground">equilíbrio</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nota ética */}
      <motion.div {...anim(0.6)}>
        <p className="text-[10px] text-center text-muted-foreground/30 leading-relaxed max-w-sm mx-auto">
          Esta leitura é simbólica e exploratória. Não constitui avaliação clínica formal.
          A interpretação final pertence a você.
        </p>
      </motion.div>
    </div>
  );
}
