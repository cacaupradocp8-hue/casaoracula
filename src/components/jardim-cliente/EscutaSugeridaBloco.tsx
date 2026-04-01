import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Orientacao } from '@/hooks/useOrientacoes';

interface Props {
  escuta: Orientacao | null;
}

export function EscutaSugeridaBloco({ escuta }: Props) {
  if (!escuta) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-2"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 px-1">
        Escuta sugerida
      </p>
      <Card className="border-border/15 bg-card/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary border border-accent/15 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-accent/60" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs text-accent/50">Deixada para você pela sua terapeuta</p>
              {escuta.titulo && (
                <p className="text-sm font-medium text-foreground/80">{escuta.titulo}</p>
              )}
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                {escuta.mensagem?.slice(0, 120)}
              </p>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/15 gap-2 text-sm h-11"
            variant="ghost"
          >
            <Headphones className="w-4 h-4" />
            Ouvir agora
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
