import { motion } from 'framer-motion';
import { Check, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PostSignupMessageProps {
  userName?: string;
  onContinue: () => void;
  onJoinWaitingList?: () => void;
  showWaitingListOption?: boolean;
}

/**
 * PostSignupMessage - Mensagem exibida após cadastro bem-sucedido
 * 
 * Tom: Humano, calmo, seguro, não promocional
 * Objetivo: Confirmar entrada, acolher, orientar sem pressão
 */
export function PostSignupMessage({ 
  userName, 
  onContinue, 
  onJoinWaitingList,
  showWaitingListOption = true 
}: PostSignupMessageProps) {
  const firstName = userName?.split(' ')[0];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gold/5 via-background to-background pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full space-y-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-gold" />
            </div>
          </div>
        </motion.div>

        {/* Confirmation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h1 className="font-display text-2xl md:text-3xl text-foreground">
            {firstName ? `${firstName}, o portal foi atravessado.` : 'O portal foi atravessado.'}
          </h1>
          <p className="text-gold font-medium">
            Sua entrada na Casa ORÁCULA está confirmada.
          </p>
        </motion.div>

        {/* Orientation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Leaf className="w-4 h-4 text-gold/60" />
            <span className="text-sm">Orientação suave</span>
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <p>Não é preciso fazer tudo agora.</p>
            <p>O Jardim se revela aos poucos.</p>
            <p>O ritmo é pessoal — e a Casa respeita isso.</p>
          </div>
        </motion.div>

        {/* Waiting List Option */}
        {showWaitingListOption && onJoinWaitingList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-3">
                  Se quiser, você pode receber avisos de:
                </p>
                <ul className="text-sm text-muted-foreground/80 space-y-1 mb-4">
                  <li>• Encontros abertos</li>
                  <li>• Eventos gratuitos</li>
                  <li>• Portais temporários</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onJoinWaitingList}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Quero ser avisada
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-6"
        >
          <blockquote className="border-l-2 border-gold/30 pl-4 text-left max-w-sm mx-auto">
            <p className="font-display italic text-foreground">
              "Aqui, você não precisa correr."
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              A Casa respeita ciclos.
            </p>
          </blockquote>

          <Button
            variant="gold"
            size="lg"
            onClick={onContinue}
            className="gap-2"
          >
            Começar a explorar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
