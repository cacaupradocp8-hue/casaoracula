import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, DoorOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodasRotas } from '@/hooks/useTodasRotas';

interface PortaInicialHeroProps {
  portaNome?: string;
  portaSlug?: string; // This is the recommended route slug (e.g., 'rota-do-aterramento')
}

export const PortaInicialHero: React.FC<PortaInicialHeroProps> = ({ portaNome, portaSlug }) => {
  const navigate = useNavigate();
  const { data: estacoes, isLoading } = useTodasRotas();

  if (!portaNome) return null;

  const handleNavigate = () => {
    if (!portaSlug) {
      navigate('/clube');
      return;
    }

    // Check if the recommended route actually exists and is available
    const exists = estacoes?.some(e => e.primeiro_slug === portaSlug && e.status !== 'locked');
    
    if (exists) {
      navigate(`/clube/rota/${portaSlug}`);
    } else {
      console.warn(`[PortaInicial] Rota ${portaSlug} não disponível ou bloqueada. Redirecionando para /clube.`);
      navigate('/clube');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto mt-20 p-8 rounded-3xl border border-gold/20 bg-gold/5 text-center space-y-6"
    >
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <DoorOpen className="w-8 h-8 text-gold" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm uppercase tracking-[0.2em] text-gold/60">Porta Inicial</h3>
        <h2 className="text-3xl font-display text-gold">{portaNome}</h2>
        <p className="text-muted-foreground/80 max-w-md mx-auto pt-2">
          Esta CidadELA pede para começar por aqui. Um convite para sua primeira travessia.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <Button 
          variant="gold" 
          size="lg" 
          onClick={handleNavigate}
          disabled={isLoading}
          className="group px-12 h-14 text-base shadow-premium-glow"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Atravessar
          {!isLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </Button>

        <button 
          onClick={() => navigate('/clube')}
          className="text-xs text-muted-foreground/50 hover:text-gold/60 underline underline-offset-4 transition-colors"
        >
          Conhecer todas as rotas
        </button>
      </div>
    </motion.div>
  );
};
