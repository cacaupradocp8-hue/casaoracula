import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Wrench, BookOpen, Sparkles, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RecomendacaoAcao } from '@/hooks/useBussolaOracular';

const ICON_MAP: Record<string, React.ElementType> = {
  pratica: Sparkles,
  ferramenta: Wrench,
  travessia: Compass,
  leitura: BookOpen,
  escuta: Headphones,
};

interface Props {
  principal: RecomendacaoAcao;
  secundarias: RecomendacaoAcao[];
}

export function ProximaAcao({ principal, secundarias }: Props) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[principal.tipo] || Compass;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-4 ml-1">
        <div className="w-1 h-1 rounded-full bg-gold" />
        <h3 className="text-[11px] uppercase tracking-[0.4em] text-gold/60 font-bold">Direção do Momento</h3>
      </div>

      {/* Ação principal — grande e clara */}
      <button
        onClick={() => navigate(principal.rota)}
        className="w-full rounded-2xl border border-white/5 bg-white/5 p-6 sm:p-8 flex items-center gap-6 group hover:border-gold/30 hover:bg-white/[0.08] transition-all active:scale-[0.99] shadow-premium hover:shadow-premium-glow overflow-hidden relative"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-[40px] transition-all group-hover:bg-gold/10" />
        
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all relative z-10 shadow-lg">
          <Icon className="w-7 h-7 text-gold" />
        </div>
        <div className="flex-1 min-w-0 text-left relative z-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5 font-semibold">
            Sugestão Oracular
          </p>
          <p className="text-lg font-display text-white tracking-wide leading-snug group-hover:text-gold transition-colors">
            {principal.texto}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-gold/40 transition-all relative z-10">
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </div>
      </button>

      {/* Ações secundárias */}
      {secundarias.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {secundarias.slice(0, 2).map((a) => {
            const SIcon = ICON_MAP[a.tipo] || Compass;
            return (
              <Button
                key={a.rota}
                variant="outline"
                className="w-full gap-2.5 border-white/5 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 text-[11px] h-12 uppercase tracking-widest font-bold rounded-xl transition-all"
                onClick={() => navigate(a.rota)}
              >
                <SIcon className="w-4 h-4 opacity-60" />
                {a.texto}
              </Button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
