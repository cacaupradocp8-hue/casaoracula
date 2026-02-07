import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowRight, Calendar } from 'lucide-react';

interface WaitingListStepProps {
  onAccept: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function WaitingListStep({ onAccept, onSkip, isLoading }: WaitingListStepProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-foreground">
            A Casa funciona em ciclos
          </h1>
          <p className="text-muted-foreground">
            As portas abrem em momentos específicos — e você pode ser avisada quando isso acontecer.
          </p>
        </div>

        {/* Waiting List Card */}
        <Card className="bg-card/50 border-gold/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-gold" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Receber avisos de eventos gratuitos
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Encontros abertos e vivências iniciais</li>
                  <li>• Avisos de novos ciclos de formação</li>
                  <li>• Conteúdos exclusivos para a lista</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="gold"
            size="lg"
            onClick={onAccept}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? 'Entrando...' : 'Quero ser avisada'}
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={onSkip}
            disabled={isLoading}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            Continuar sem entrar na lista
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs text-muted-foreground/60">
          Você pode cancelar a qualquer momento. Sem compromisso.
        </p>
      </motion.div>
    </div>
  );
}
