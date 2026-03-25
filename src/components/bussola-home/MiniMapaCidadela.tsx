import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

const ESTADO_STYLES: Record<string, string> = {
  central: 'bg-primary/15 border-primary/25 text-primary',
  ativo: 'bg-primary/8 border-primary/15 text-primary/70',
  tensao: 'bg-destructive/8 border-destructive/15 text-destructive/70',
  integrado: 'bg-emerald-500/8 border-emerald-500/15 text-emerald-600/70',
  nao_explorado: 'bg-muted/30 border-border/10 text-muted-foreground/40',
};

interface Props {
  temCartografia: boolean;
  distritoDominante: DistritoResumo | null;
  distritosAtivos: DistritoResumo[];
  distritoTensao: DistritoResumo | null;
  corHex: string;
}

export function MiniMapaCidadela({ temCartografia, distritoDominante, distritosAtivos, distritoTensao, corHex }: Props) {
  const navigate = useNavigate();

  if (!temCartografia) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.02] p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary/30 animate-pulse" />
          </div>
          <p className="font-display text-base text-foreground/70 mb-1">
            Sua CidaDELA aguarda revelação
          </p>
          <p className="text-xs text-muted-foreground/50 mb-4 max-w-xs mx-auto">
            Um mapa simbólico da sua psique será gerado pela Cartografia Psíquica Orácula.
          </p>
          <Button
            variant="gold"
            className="gap-2"
            onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
          >
            Revelar meu mapa <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.section>
    );
  }

  // Todos os distritos exibíveis (dominante, ativos, tensão)
  const allDistritos = new Map<string, DistritoResumo>();
  if (distritoDominante) allDistritos.set(distritoDominante.key, { ...distritoDominante, estado: 'central' as const });
  distritosAtivos.forEach(d => {
    if (!allDistritos.has(d.key)) allDistritos.set(d.key, d);
  });
  if (distritoTensao && !allDistritos.has(distritoTensao.key)) {
    allDistritos.set(distritoTensao.key, distritoTensao);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Sua CidaDELA
        </p>
        <button
          onClick={() => navigate('/revelacao-cidadela')}
          className="text-[10px] text-primary/50 hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          Ver mapa completo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div
        className="rounded-2xl border border-border/10 p-4 cursor-pointer hover:border-primary/20 transition-all"
        style={{ background: `linear-gradient(135deg, ${corHex}08, transparent 60%)` }}
        onClick={() => navigate('/revelacao-cidadela')}
      >
        <div className="grid grid-cols-3 gap-2">
          {Array.from(allDistritos.values()).slice(0, 6).map((d) => {
            const style = ESTADO_STYLES[d.estado] || ESTADO_STYLES.nao_explorado;
            return (
              <div
                key={d.key}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border ${style} transition-all`}
              >
                <span className="text-lg">{d.icon}</span>
                <span className="text-[9px] text-center leading-tight truncate w-full">
                  {d.nome}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
