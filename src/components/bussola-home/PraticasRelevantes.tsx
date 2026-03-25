import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props {
  praticas: { icon: string; label: string; path: string }[];
}

export function PraticasRelevantes({ praticas }: Props) {
  const navigate = useNavigate();

  if (praticas.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mb-6"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
        Práticas para o momento
      </p>

      <div className="flex gap-2">
        {praticas.map((p) => (
          <button
            key={p.path + p.label}
            onClick={() => navigate(p.path)}
            className="flex-1 group flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-border/15 hover:border-primary/20 hover:bg-primary/[0.03] transition-all"
          >
            <span className="text-xl">{p.icon}</span>
            <span className="text-[11px] text-foreground/60 group-hover:text-foreground/80 transition-colors font-medium text-center leading-tight">
              {p.label}
            </span>
          </button>
        ))}
      </div>
    </motion.section>
  );
}
