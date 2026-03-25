import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Wrench, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProximoPassoData } from '@/hooks/useHomeInteligente';

const ICON_MAP = {
  pratica: Compass,
  ferramenta: Wrench,
  travessia: BookOpen,
};

interface Props { proximoPasso: ProximoPassoData; }

export function HomeProximoPasso({ proximoPasso }: Props) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[proximoPasso.tipo] || Compass;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="mb-8"
    >
      <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-0.5">
              Próximo passo
            </p>
            <p className="text-sm font-medium text-foreground/80 truncate">
              {proximoPasso.texto}
            </p>
          </div>
          <Button
            size="sm"
            variant="gold"
            className="gap-1.5 shrink-0"
            onClick={() => navigate(proximoPasso.rota)}
          >
            Ir <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
