import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { useMapaEgoState } from './useMapaEgoState';
import { ETAPAS_INFO } from './types';
import { EtapaExploracao } from './EtapaExploracao';
import { EtapaIntegracao } from './EtapaIntegracao';
import { EtapaVisualizacao } from './EtapaVisualizacao';
import { EtapaSintese } from './EtapaSintese';
import { EtapaJardim } from './EtapaJardim';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MapaEgoFemininoProps {
  onComplete?: () => void;
}

export function MapaEgoFeminino({ onComplete }: MapaEgoFemininoProps) {
  const {
    state, atualizarResposta, proximaEtapa, etapaAnterior,
    setSinteseNarrativa, setReflexaoFinal, finalizarMapa,
    podeAvancar, etapaIndex, totalEtapas,
  } = useMapaEgoState();

  const etapaInfo = ETAPAS_INFO[state.etapaAtual];
  const progressoGeral = ((etapaIndex + 1) / totalEtapas) * 100;

  const handleComplete = () => {
    finalizarMapa();
    onComplete?.();
  };

  const renderEtapa = () => {
    switch (state.etapaAtual) {
      case 'exploracao':
        return <EtapaExploracao respostas={state.respostas} onAtualizarResposta={atualizarResposta} />;
      case 'integracao':
        return <EtapaIntegracao respostas={state.respostas} />;
      case 'visualizacao':
        return <EtapaVisualizacao respostas={state.respostas} />;
      case 'sintese':
        return <EtapaSintese respostas={state.respostas} sinteseNarrativa={state.sinteseNarrativa} onSinteseChange={setSinteseNarrativa} />;
      case 'jardim':
        return <EtapaJardim respostas={state.respostas} sinteseNarrativa={state.sinteseNarrativa} reflexaoFinal={state.reflexaoFinal} onReflexaoChange={setReflexaoFinal} onSalvo={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── Etapa Header — Ritualistic ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 relative"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-full bg-gold/5 blur-[60px] pointer-events-none" />

        <div className="flex items-center justify-center gap-3 relative">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-gold" />
          </div>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold/50 font-medium">
            Etapa {etapaIndex + 1} de {totalEtapas}
          </span>
          <h2 className="text-xl md:text-2xl font-display text-foreground tracking-wide">{etapaInfo.titulo}</h2>
          <p className="text-sm text-foreground/50 max-w-md mx-auto leading-relaxed">{etapaInfo.subtitulo}</p>
        </div>
      </motion.div>

      {/* ─── Progress bar — double glow ─── */}
      <div className="relative">
        <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressoGeral}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold/50"
          />
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressoGeral}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-gold to-gold/50 blur-sm opacity-40"
        />
      </div>

      {/* ─── Etapa content with transition ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.etapaAtual}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[400px]"
        >
          {renderEtapa()}
        </motion.div>
      </AnimatePresence>

      {/* ─── Navigation — premium buttons ─── */}
      <div className="flex justify-between pt-6 border-t border-border/10">
        <Button
          variant="ghost"
          onClick={etapaAnterior}
          disabled={etapaIndex === 0}
          className="gap-2 text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {state.etapaAtual !== 'jardim' && (
          <Button
            onClick={proximaEtapa}
            disabled={!podeAvancar}
            className={cn(
              'gap-2 rounded-xl transition-all duration-500',
              podeAvancar
                ? 'bg-gradient-to-r from-gold to-gold/80 text-background hover:shadow-[0_0_30px_-6px_hsl(var(--gold)/0.4)]'
                : 'bg-muted/30 text-muted-foreground border border-border/20'
            )}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
