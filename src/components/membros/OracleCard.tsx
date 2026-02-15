import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function OracleCard() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/oraculo')}
      className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 hover:shadow-glow transition-all duration-500 mb-10"
    >
      <div className="relative p-8 text-center">
        {/* Halo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-display text-2xl text-foreground mb-2">
            🔮 Oráculo
          </h3>
          <p className="text-sm text-muted-foreground">
            Uma pergunta. Uma escuta. Uma revelação.
          </p>
        </div>
      </div>
    </motion.button>
  );
}
