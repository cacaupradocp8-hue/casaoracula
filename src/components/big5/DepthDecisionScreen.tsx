import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DepthDecisionScreenProps {
  portaAssociada: string | null;
  isCertified: boolean;
  onClose: () => void;
  onAccessNarroterapia: () => void;
}

export function DepthDecisionScreen({
  portaAssociada,
  isCertified,
  onClose,
  onAccessNarroterapia,
}: DepthDecisionScreenProps) {
  const navigate = useNavigate();

  const handleNarroterapia = () => {
    if (!isCertified) return;
    
    onAccessNarroterapia();
    
    // Navigate to narroterapia with porta filter
    const portaParam = portaAssociada ? encodeURIComponent(portaAssociada) : '';
    navigate(`/narroterapia/clinica?porta=${portaParam}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="glass border-gold/20">
        <CardContent className="py-12 space-y-8">
          {/* Quote */}
          <div className="text-center">
            <p className="font-display text-xl text-gold italic">
              "Nem todo campo pede história."
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Encerrar */}
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full h-auto py-6 flex flex-col items-start gap-2 text-left"
            >
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Encerrar por hoje</span>
              </div>
              <p className="text-sm text-muted-foreground pl-8">
                O ritual foi suficiente.
              </p>
            </Button>

            {/* Narroterapia */}
            <Button
              onClick={handleNarroterapia}
              disabled={!isCertified}
              size="lg"
              className="w-full h-auto py-6 flex flex-col items-start gap-2 text-left relative overflow-hidden"
              variant={isCertified ? 'default' : 'outline'}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Acessar Narroterapia</span>
                {!isCertified && (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className={`text-sm pl-8 ${isCertified ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {portaAssociada 
                  ? `Contos da ${portaAssociada}` 
                  : 'Biblioteca de contos clínicos'}
              </p>
              {!isCertified && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
                    Apenas certificadas
                  </span>
                </div>
              )}
            </Button>
          </div>

          {/* Info para não certificadas */}
          {!isCertified && (
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                A Narroterapia Oracular™ está disponível apenas para facilitadoras certificadas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
