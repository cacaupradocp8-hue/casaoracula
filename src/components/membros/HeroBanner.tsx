import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeroBannerProps {
  isCertificada: boolean;
}

export function HeroBanner({ isCertificada }: HeroBannerProps) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-10">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
      <div className="absolute inset-0 bg-hero-radial opacity-60" />
      <div className="absolute inset-0 pattern-geometric opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-4 font-body">
            Casa Orácula
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 leading-tight">
            A travessia{' '}
            <span className="text-gold-gradient font-semibold">continua.</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
            Cada portal aberto revela um novo campo. Siga onde a escuta te conduz.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gold"
              size="xl"
              onClick={() => navigate('/formacao')}
              className="gap-2"
            >
              Continuar Jornada
              <ArrowRight className="w-5 h-5" />
            </Button>
            {isCertificada && (
              <Button
                variant="mystical"
                size="lg"
                onClick={() => navigate('/casa-das-maquinas')}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Acessar Casa das Máquinas
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
