/**
 * Saída Clínica — visão da terapeuta na cabine
 * Exibe leitura diagnóstica técnica derivada automaticamente das 30 respostas.
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, AlertTriangle, Target, Gauge, Shield, Compass } from 'lucide-react';
import type { LeituraComportamental } from '@/lib/cartografia/leituraComportamental';
import type { CidadelaDerivada } from '@/lib/cartografia/derivacaoCidadela';

interface Props {
  leitura: LeituraComportamental;
  cidadela: CidadelaDerivada;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const RITMO_LABEL: Record<string, string> = {
  lento: 'Lento — contenção antes de aprofundamento',
  medio: 'Médio — equilíbrio entre estrutura e exploração',
  rapido: 'Dinâmico — abertura para experimentação ativa',
};

export function SaidaClinica({ leitura, cidadela }: Props) {
  const { profile, saida_terapeuta } = leitura;

  return (
    <div className="space-y-5 w-full max-w-2xl mx-auto overflow-hidden">
      <motion.div {...anim(0)} className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-primary" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Leitura Diagnóstica</p>
        <h2 className="font-display text-xl font-bold text-foreground">Saída Clínica</h2>
      </motion.div>

      {/* Eixo Dominante */}
      <motion.div {...anim(0.1)}>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-primary/70 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Eixo Dominante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{cidadela.porta_inicial_nome}</p>
            <p className="text-xs text-muted-foreground mt-1">{saida_terapeuta.padrao_dominante}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tensão Central */}
      <motion.div {...anim(0.15)}>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-amber-600/70 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Tensão Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground capitalize">{profile.tensao_central}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid: Defesa + Risco + Ritmo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div {...anim(0.2)}>
          <Card className="border-border/15 bg-card/50 h-full">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-muted-foreground/60" />
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Estratégia de defesa</p>
              </div>
              <p className="text-xs font-medium text-foreground capitalize">{profile.estrategia_defesa}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(0.25)}>
          <Card className="border-border/15 bg-card/50 h-full">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive/60" />
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Medo dominante</p>
              </div>
              <p className="text-xs font-medium text-foreground capitalize">{profile.medo_dominante}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(0.3)}>
          <Card className="border-border/15 bg-card/50 h-full">
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-muted-foreground/60" />
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Ritmo recomendado</p>
              </div>
              <p className="text-xs font-medium text-foreground">{RITMO_LABEL[profile.ritmo_ideal] || profile.ritmo_ideal}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Direção Clínica + Porta Inicial */}
      <motion.div {...anim(0.35)}>
        <Card className="border-border/15 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-foreground/70 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Direção Clínica Inicial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-foreground/80">{profile.estilo_conducao}</p>
            <div className="flex items-center gap-2 pt-1 border-t border-border/10">
              <span className="text-lg">{cidadela.simbolo_icon}</span>
              <div>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Porta inicial de trabalho</p>
                <p className="text-sm font-medium text-primary">{cidadela.porta_inicial_nome}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* O que evitar / O que priorizar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div {...anim(0.4)}>
          <Card className="border-destructive/15 bg-destructive/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-destructive/70">⛔ Risco de condução</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {saida_terapeuta.o_que_evitar.map((item, i) => (
                  <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                    <span className="text-destructive/50 mt-0.5 shrink-0">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(0.45)}>
          <Card className="border-accent/15 bg-accent/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-accent-foreground/70">✓ O que priorizar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {saida_terapeuta.o_que_priorizar.map((item, i) => (
                  <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                    <span className="text-accent-foreground/50 mt-0.5 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CidaDELA derivada */}
      <motion.div {...anim(0.5)}>
        <Card className="border-border/15 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-foreground/70">🏰 CidaDELA Derivada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Torre dominante</p>
                <p className="text-xs font-medium text-foreground">{cidadela.torre_dominante}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Clima da cidade</p>
                <p className="text-xs font-medium text-foreground">{cidadela.clima_cidade}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Cor</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cidadela.cor_hex }} />
                  <p className="text-xs font-medium text-foreground">{cidadela.cor_derivada}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Equilíbrio</p>
                <p className="text-xs font-medium text-foreground">{cidadela.indice_equilibrio}%</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1">Distritos acesos</p>
              <div className="flex flex-wrap gap-1.5">
                {cidadela.distritos_acesos.map(d => (
                  <Badge key={d} variant="secondary" className="text-[9px] capitalize">{d.replace(/_/g, ' ')}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Observação ética */}
      <motion.div {...anim(0.55)}>
        <Card className="border-border/10 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1.5">Observação ética</p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Esta leitura é um instrumento de apoio à decisão clínica, não um diagnóstico.
              A interpretação final e a responsabilidade de condução pertencem à facilitadora.
              Tolerância ao confronto: <span className="font-medium text-foreground/60">{profile.tolerancia_confronto}</span>.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
