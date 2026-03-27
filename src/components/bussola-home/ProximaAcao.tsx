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
      className="mb-8"
    >
      {/* Ação principal — grande e clara */}
      <button
        onClick={() => navigate(principal.rota)}
        className="w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] p-6 flex items-center gap-4 group hover:border-primary/30 hover:from-primary/[0.08] transition-all active:scale-[0.99]"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
          <Icon className="w-6 h-6 text-primary/70" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-1">
            Próxima ação
          </p>
          <p className="text-base font-medium text-foreground/90">
            {principal.texto}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-primary/70 group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>

      {/* Ações secundárias */}
      {secundarias.length > 0 && (
        <div className="flex gap-2 mt-3">
          {secundarias.slice(0, 2).map((a) => {
            const SIcon = ICON_MAP[a.tipo] || Compass;
            return (
              <Button
                key={a.rota}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 border-border/20 text-foreground/60 hover:text-foreground/80 hover:bg-primary/[0.03] text-xs h-10"
                onClick={() => navigate(a.rota)}
              >
                <SIcon className="w-3.5 h-3.5" />
                {a.texto}
              </Button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
