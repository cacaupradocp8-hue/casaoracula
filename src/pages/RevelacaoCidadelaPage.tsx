import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MapaVivoCidadelaV2 from '@/components/cidadela/MapaVivoCidadelaV2';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevelacaoCidadelaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <MapaVivoCidadelaV2
        selfMode
        overrideId={user?.id}
        standalone
      />

      {/* CTA → Dashboard Member */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="max-w-md mx-auto px-4 pb-20 text-center space-y-4"
      >
        <Button
          variant="gold"
          size="lg"
          onClick={() => navigate('/dashboard-membro', { replace: true })}
          className="gap-2 px-10 h-14 shadow-premium-glow"
        >
          Entrar na sua CidaDELA
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
          Seu Perfil Estrutural estará sempre disponível no seu painel.
        </p>
      </motion.div>
    </div>
  );
}
