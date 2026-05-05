import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bookmark, Compass, RefreshCw } from 'lucide-react';
import { useClubeInsights } from '@/hooks/useClubeInsights';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const InsightPortalBlock: React.FC = () => {
  const { insight, isLoading, reroll } = useClubeInsights();
  const navigate = useNavigate();

  if (isLoading || !insight) return null;

  const handleGuardar = () => {
    toast.success("Insight guardado em suas reflexões", {
      description: "Este insight foi registrado em seu Jardim da Psique."
    });
  };

  const handleRefletir = () => {
    navigate('/jardim/psique/reflexao', { state: { insight: insight.frase } });
  };

  return (
    <div className="w-full mb-8 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-background/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center space-y-4 md:space-y-6"
        >
          <div className="p-2 bg-primary/20 rounded-full">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>

          <blockquote className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed italic max-w-2xl">
            "{insight.frase}"
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-xs gap-2"
              onClick={handleGuardar}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Guardar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-xs gap-2"
              onClick={handleRefletir}
            >
              <Compass className="w-3.5 h-3.5" />
              Refletir no Jardim
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/40 hover:text-white/60 text-[10px] gap-1"
              onClick={reroll}
            >
              <RefreshCw className="w-3 h-3" />
              Ver outro
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
