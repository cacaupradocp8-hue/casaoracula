import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, ArrowRight, Compass, Eye, Hammer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RotaLaboratorioProps {
  estacaoId?: string | null;
  livroTitulo?: string | null;
}

/**
 * Bloco "Câmara do Sussurro" na Home do Clube.
 * Convida a usuária a entrar na cabine de simulação clínica para treinar escuta.
 */
export function RotaLaboratorio({ estacaoId, livroTitulo }: RotaLaboratorioProps) {
  const navigate = useNavigate();

  const fases = [
    { icon: Compass, label: 'Cartografia' },
    { icon: Eye, label: 'Simbologia' },
    { icon: Hammer, label: 'Condução' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="space-y-3"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium text-center">
        Prática Clínica
      </p>

      <Card className="border-gold/15 bg-gradient-to-br from-gold/5 via-card/40 to-card/20 backdrop-blur overflow-hidden">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <FlaskConical className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base text-foreground leading-tight">
                Câmara do Sussurro
              </h3>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Simulações clínicas e leitura de campo.
              </p>
            </div>
          </div>

          {/* Fases */}
          <div className="flex items-center justify-between gap-2 px-1">
            {fases.map((f, i) => (
              <div key={f.label} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <f.icon className="w-3.5 h-3.5 text-primary/60" />
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">
                    {f.label}
                  </span>
                </div>
                {i < fases.length - 1 && (
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-primary/5" />
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-1">
            <Button
              variant="gold"
              size="sm"
              className="w-full gap-2"
              onClick={() => navigate('/clube/treinamento')}
            >
              Entrar na Sala de Treinamento
              {livroTitulo && (
                <span className="text-[10px] opacity-70 truncate max-w-[140px]">
                  · {livroTitulo}
                </span>
              )}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[11px] text-muted-foreground/70 hover:text-primary"
              onClick={() => navigate('/clube/laboratorio')}
            >
              Ver acervo de laboratórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
