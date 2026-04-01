import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Pratica } from '@/hooks/useClienteJardimCompleto';

interface Props {
  pratica: Pratica | null;
}

export function PraticaRecomendadaBloco({ pratica }: Props) {
  if (!pratica) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-2"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 px-1">
        Prática recomendada
      </p>
      <Card className="border-border/15 bg-card/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary/60" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs text-primary/50">Sugerida para você</p>
              <p className="text-sm font-medium text-foreground/80">{pratica.titulo}</p>
              {pratica.descricao && (
                <p className="text-xs text-muted-foreground/60 leading-relaxed">
                  {pratica.descricao.slice(0, 150)}
                </p>
              )}
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 gap-2 text-sm h-11"
            variant="ghost"
          >
            <BookOpen className="w-4 h-4" />
            Começar prática
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
