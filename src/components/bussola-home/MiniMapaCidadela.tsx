import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

interface Props {
  temCartografia: boolean;
  distritoDominante: DistritoResumo | null;
  distritosAtivos: DistritoResumo[];
  distritoTensao: DistritoResumo | null;
  corHex: string;
  distritosRaw: Record<string, any>;
}

export function MiniMapaCidadela(props: Props) {
  const { temCartografia, distritosRaw, distritoDominante } = props;
  const navigate = useNavigate();

  // Build district display states from raw data
  const districtStates = useMemo<Record<string, DistrictDisplayState>>(() => {
    const states: Record<string, DistrictDisplayState> = {};
    Object.values(distritosRaw).forEach((d: any) => {
      const name = d?.nome?.toLowerCase();
      if (!name) return;
      if (d.estado === 'central' || d.estado === 'ativo') {
        states[name] = 'ativo';
      } else if (d.estado === 'tensao') {
        states[name] = 'em_tensao';
      } else if (d.estado === 'integrado') {
        states[name] = 'integrado';
      }
    });
    return states;
  }, [distritosRaw]);

  const activeDistrictName = distritoDominante?.nome || null;

  if (!temCartografia) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.02] p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary/30 animate-pulse" />
          </div>
          <p className="font-display text-base text-foreground/70 mb-1">
            Sua CidaDELA aguarda revelação
          </p>
          <p className="text-xs text-muted-foreground/50 mb-4 max-w-xs mx-auto">
            Um mapa simbólico da sua psique será gerado pela Cartografia Psíquica.
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Sua CidaDELA
        </p>
        <button
          onClick={() => navigate('/cidadela/revelacao')}
          className="text-[10px] text-primary/50 hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          Ver mapa completo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-border/20 bg-muted/10 p-3 transition-all hover:border-primary/20">
        <CidadelaMapSVG
          districtStates={districtStates}
          activeDistrict={activeDistrictName}
          forceCircular
          maxWidth={520}
        />
      </div>
    </motion.section>
  );
}
