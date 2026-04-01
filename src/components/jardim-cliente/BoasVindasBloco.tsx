import { Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

function getSaudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function BoasVindasBloco() {
  const { user } = useAuth();
  const nome = (user as any)?.user_metadata?.nome || user?.email?.split('@')[0] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center space-y-4 py-8"
    >
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
      >
        <Leaf className="w-7 h-7 text-primary/60" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-lg font-display text-foreground/90">
          {getSaudacao()}{nome ? `, ${nome}` : ''}
        </h1>
        <p className="text-base font-display text-primary/70 italic">
          Bem-vinda ao seu Jardim da Heroína
        </p>
        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
          Este é um espaço para escutar, registrar e continuar a sua travessia.
        </p>
      </div>
    </motion.div>
  );
}
