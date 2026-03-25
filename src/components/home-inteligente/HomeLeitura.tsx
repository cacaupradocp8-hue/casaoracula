import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeituraData } from '@/hooks/useHomeInteligente';

interface Props { leitura: LeituraData; }

export function HomeLeitura({ leitura }: Props) {
  const navigate = useNavigate();

  if (!leitura.livroTitulo) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="mb-8"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
        Jornada de Leitura
      </p>

      <div className="rounded-2xl border border-border/20 p-5">
        <div className="flex gap-4">
          {/* Capa */}
          <div className="w-16 h-22 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {leitura.livroCapa ? (
              <img src={leitura.livroCapa} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <BookOpen className="w-6 h-6 text-primary/30" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {leitura.livroTitulo}
            </h3>
            {leitura.livroAutor && (
              <p className="text-xs text-muted-foreground/60 mt-0.5">{leitura.livroAutor}</p>
            )}
            {leitura.motivoSugestao && (
              <p className="text-xs text-foreground/40 italic mt-2 leading-relaxed">
                {leitura.motivoSugestao}
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 mt-3 border-primary/15 text-primary/70 hover:bg-primary/5 text-xs"
              onClick={() => navigate(leitura.cicloId ? `/clube-livro/${leitura.cicloId}` : '/clube-livro')}
            >
              Iniciar essa jornada <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
