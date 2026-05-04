import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoasVindasBannerProps {
  nome: string;
  temCartografia: boolean;
  onDismiss: () => void;
}

export function BoasVindasBanner({ nome, temCartografia, onDismiss }: BoasVindasBannerProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden premium-card p-8 md:p-12 mb-10 text-center"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto bg-gold/5 mb-2"
        >
          <span className="text-gold text-xl">✨</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl md:text-5xl text-white tracking-wide"
        >
          Bem-vinda à Casa, <span className="text-gold">{nome}</span>.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto font-display italic"
        >
          A Casa ORÁCULA agora é seu refúgio. Seu primeiro passo essencial é revelar o mapa do seu território interno — a CidaDELA Interior.
        </motion.p>

        {!temCartografia && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="gold"
              size="xl"
              onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
              className="gap-3 px-12 mt-4 shadow-premium-glow hover:scale-[1.03] transition-transform rounded-2xl group"
            >
              Revelar meu mapa agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
