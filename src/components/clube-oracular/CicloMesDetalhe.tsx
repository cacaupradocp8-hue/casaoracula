import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Target } from 'lucide-react';
import type { MesJornada } from '@/constants/jornadaAnual';

interface Props {
  mes: MesJornada;
  isAtual: boolean;
}

export function CicloMesDetalhe({ mes, isAtual }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/15 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display text-xl text-foreground">{mes.nome}</h2>
            {isAtual && (
              <Badge variant="outline" className="border-gold/30 text-gold text-[10px] uppercase tracking-wider">
                Mês Atual
              </Badge>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">
                  Portal
                </p>
                <p className="text-sm text-foreground/80">{mes.portal}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">
                  Foco Clínico
                </p>
                <p className="text-sm text-foreground/80">{mes.foco_clinico}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
