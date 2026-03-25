import { motion } from 'framer-motion';
import { AlertTriangle, Eye } from 'lucide-react';
import type { AlertaClinico } from '@/hooks/useBussolaOracular';

interface Props {
  alertas: AlertaClinico[];
}

const ICONS = {
  atencao: AlertTriangle,
  observacao: Eye,
};

const STYLES = {
  atencao: 'border-amber-500/15 bg-amber-500/[0.03]',
  observacao: 'border-primary/10 bg-primary/[0.02]',
};

export function AlertaOracular({ alertas }: Props) {
  if (alertas.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mb-6"
    >
      <div className="space-y-2">
        {alertas.map((a, i) => {
          const Icon = ICONS[a.tipo];
          const style = STYLES[a.tipo];
          return (
            <div key={i} className={`rounded-xl border p-3.5 flex items-start gap-3 ${style}`}>
              <Icon className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/55 leading-relaxed">
                {a.mensagem}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
