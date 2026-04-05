import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Flower2, Play } from 'lucide-react';

const praticas = [
  { icon: Sparkles, label: 'Tirar uma carta', path: '/oraculos' },
  { icon: Moon, label: 'Registrar sonho', path: '/jardim-da-psique' },
  { icon: Flower2, label: 'Jardim da Psique', path: '/jardim-da-psique' },
  { icon: Play, label: 'Sala de Treinamento', path: '/sala-de-treinamento' },
];

export function HomePraticas() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="mb-10"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
        Práticas
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {praticas.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => navigate(p.path)}
              className="group flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-border/15 hover:border-primary/20 hover:bg-primary/[0.03] transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors font-medium">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
