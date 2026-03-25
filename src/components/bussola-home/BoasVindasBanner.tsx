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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6 }}
      className="relative border border-gold/20 bg-gradient-to-br from-card to-gold/[0.03] rounded-2xl p-6 md:p-8 mb-8"
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="text-center space-y-4">
        <span className="text-gold/50 text-2xl block">🜂</span>
        <h2 className="font-display text-2xl text-foreground">
          Bem-vinda à Casa, {nome}.
        </h2>
        <p className="text-foreground/70 leading-relaxed max-w-md mx-auto">
          Agora você habita a Casa Orácula. Seu primeiro passo é revelar
          o mapa do seu território interno — a CidaDELA Interior.
        </p>

        {!temCartografia && (
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
            className="gap-2 px-8 mt-2"
          >
            Revelar meu mapa
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
