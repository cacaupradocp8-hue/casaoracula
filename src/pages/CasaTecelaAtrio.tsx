import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { RitualGate } from '@/components/ritual';
import { FormationMapTrigger } from '@/components/formation-map';

export default function CasaTecelaAtrio() {
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      navigate('/casa-tecelas/interior');
    }, 800);
  };

  return (
    <AppLayout>
      <RitualGate 
        triggerEvent="first_sala_access" 
        contextType="sala" 
        contextId="casa-tecelas"
      >
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="atrium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-center"
            >
              {/* Symbolic Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-purple-500/30 flex items-center justify-center border border-gold/30">
                  <Sparkles className="w-10 h-10 text-gold" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-3xl md:text-4xl font-display text-gold mb-6"
              >
                A Casa das Tecelãs
              </motion.h1>

              {/* Manifesto */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="glass p-8 rounded-2xl border border-gold/20 mb-8"
              >
                <p className="text-lg text-foreground leading-relaxed italic">
                  "Este não é um espaço de aprendizado técnico.
                </p>
                <p className="text-lg text-foreground leading-relaxed italic mt-4">
                  É um espaço de sustentação, refinamento e maturação
                  para mulheres que trabalham com o invisível.
                </p>
                <p className="text-lg text-foreground leading-relaxed italic mt-4">
                  Se você busca respostas rápidas, este não é o lugar.
                </p>
                <p className="text-lg text-foreground leading-relaxed italic mt-4">
                  Se você busca permanecer inteira enquanto sustenta outras, bem-vinda."
                </p>
              </motion.div>

              {/* Entry Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  onClick={handleEnter}
                  variant="gold"
                  size="lg"
                  className="gap-2 px-8"
                >
                  Entrar na Casa
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Subtle note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-sm text-muted-foreground mt-6"
              >
                Este espaço permanece ativo antes, durante e após a Mentoria.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 animate-pulse flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <p className="text-muted-foreground mt-4">Atravessando o limiar...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </RitualGate>
      
      {/* Floating Map Trigger */}
      <FormationMapTrigger />
    </AppLayout>
  );
}
