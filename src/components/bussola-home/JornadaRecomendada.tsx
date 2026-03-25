import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeituraRecomendada } from '@/hooks/useBussolaOracular';

interface Props {
  leitura: LeituraRecomendada;
}

export function JornadaRecomendada({ leitura }: Props) {
  const navigate = useNavigate();

  if (!leitura.titulo) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-6"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
        Jornada de leitura
      </p>

      <div className="rounded-2xl border border-border/15 p-4">
        <div className="flex gap-4">
          {/* Capa */}
          <div className="w-14 h-20 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {leitura.capa ? (
              <img src={leitura.capa} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <BookOpen className="w-5 h-5 text-primary/30" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {leitura.titulo}
            </h3>
            {leitura.autor && (
              <p className="text-xs text-muted-foreground/60 mt-0.5">{leitura.autor}</p>
            )}
            {leitura.motivo && (
              <p className="text-xs text-foreground/40 italic mt-1.5 leading-relaxed line-clamp-2">
                {leitura.motivo}
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 mt-2.5 border-primary/15 text-primary/70 hover:bg-primary/5 text-xs"
              onClick={() => navigate(leitura.cicloId ? `/clube-livro/${leitura.cicloId}` : '/clube-livro')}
            >
              Ir para jornada <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
