import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, ArrowRight } from 'lucide-react';

interface RiteOfPassageModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
}

export function RiteOfPassageModal({ open, onAccept, onDecline, isLoading }: RiteOfPassageModalProps) {
  const [choice, setChoice] = useState<'accept' | 'decline' | null>(null);

  const handleAccept = () => {
    setChoice('accept');
    onAccept();
  };

  const handleDecline = () => {
    setChoice('decline');
    onDecline();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-gold/20">
        <DialogHeader className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center"
          >
            <Home className="w-8 h-8 text-gold" />
          </motion.div>

          <DialogTitle className="font-display text-2xl font-light text-foreground">
            O Rito de Passagem
          </DialogTitle>

          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Você pode atravessar esta Casa como visitante — <br />
            ou escolher <span className="text-gold">habitar</span> dentro dela.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Habitar significa ter acesso às câmaras mais profundas:
              ferramentas simbólicas, acompanhamento formativo e a
              comunidade das guardiãs.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {['Ferramentas completas', 'Formação simbólica', 'Comunidade'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 rounded-full text-xs text-gold"
                >
                  <Sparkles className="w-3 h-3" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="gold"
              size="lg"
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full gap-2"
            >
              {isLoading && choice === 'accept' ? (
                'Abrindo as portas...'
              ) : (
                <>
                  Desejo habitar esta Casa
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleDecline}
              disabled={isLoading}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              {isLoading && choice === 'decline' ? 'Preparando...' : 'Continuar como visitante'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Esta escolha pode ser feita a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
