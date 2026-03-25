import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MapaData } from '@/hooks/useHomeInteligente';

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

interface Props { mapa: MapaData; }

export function HomeSeuMapa({ mapa }: Props) {
  const navigate = useNavigate();

  // ── Sem cartografia: mapa latente ──
  if (!mapa.temCartografia) {
    return (
      <motion.section {...anim(0.2)} className="mb-8">
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.02] p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Compass className="w-7 h-7 text-primary/30 animate-pulse" />
          </div>
          <p className="font-display text-lg text-foreground/70 mb-1">Sua CidaDELA aguarda revelação</p>
          <p className="text-xs text-muted-foreground/60 mb-5 max-w-sm mx-auto">
            Um mapa simbólico da sua psique será gerado pela Cartografia Psíquica Orácula.
          </p>
          <Button
            variant="gold"
            size="lg"
            className="gap-2"
            onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
          >
            Revelar meu mapa <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.section>
    );
  }

  // ── Com cartografia: mandala resumida ──
  return (
    <motion.section {...anim(0.2)} className="mb-8">
      <div
        className="rounded-2xl border border-border/10 p-5 cursor-pointer hover:border-primary/20 transition-all"
        style={{ background: `linear-gradient(135deg, ${mapa.corHex}08, transparent 60%)` }}
        onClick={() => navigate('/revelacao-cidadela')}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            Sua CidaDELA Interior
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Distrito central visual */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${mapa.corHex}12`, border: `1.5px solid ${mapa.corHex}30` }}
          >
            <span className="text-3xl">{mapa.distritoCentral?.icon || '🏛️'}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {mapa.distritoCentral?.nome || 'CidaDELA Interior'}
            </p>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mapa.corHex }} />
              <span className="text-xs text-muted-foreground/70">{mapa.cor}</span>
              {mapa.simbolo && (
                <span className="text-xs text-muted-foreground/50">· {mapa.simbolo}</span>
              )}
            </div>

            {/* Mini distritos ativos */}
            {mapa.distritosAtivos.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {mapa.distritosAtivos.slice(0, 4).map(d => (
                  <span key={d.key} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-muted-foreground/60 border border-primary/10">
                    {d.icon} {d.nome}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
        </div>
      </div>
    </motion.section>
  );
}
