import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { VozResumo } from '@/hooks/useBussolaOracular';

interface Props {
  voz: VozResumo | null;
  welcomeName: string;
}

export function SuaVozResumo({ voz, welcomeName }: Props) {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-6"
    >
      {voz ? (
        <div className="rounded-2xl border border-border/10 p-4 flex items-center gap-4">
          <span className="text-2xl shrink-0">{voz.icone}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground/50">
              {welcomeName}, <span className="text-foreground/70">{voz.nome}</span>
            </p>
            <p className="text-[11px] text-foreground/40 italic truncate mt-0.5">
              {voz.fraseSintese}
            </p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="text-[10px] text-primary/40 hover:text-primary/70 transition-colors shrink-0 flex items-center gap-1"
          >
            Aprofundar <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="font-display text-xl text-foreground mb-1">
            Bem-vinda, <span className="text-primary">{welcomeName}</span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            Descubra sua Voz na Casa Orácula
          </p>
        </div>
      )}
    </motion.section>
  );
}
