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

      {/* CTA → Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="max-w-md mx-auto px-4 pb-16 text-center space-y-3"
      >
        <Button
          variant="gold"
          size="lg"
          onClick={() => navigate('/dashboard-membro', { replace: true })}
          className="gap-2 px-8"
        >
          Entrar na Casa com meu mapa
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-muted-foreground/50">
          Seu mapa estará sempre disponível no seu painel.
        </p>
      </motion.div>
    </div>
  );
}
